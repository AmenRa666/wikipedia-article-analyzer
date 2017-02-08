// MODULES
const PythonShell = require('python-shell')
const fs = require('fs')
const xml2js = require('xml2js')
const nlp = require('nlp_compromise')
nlp.plugin(require('nlp-syllables'))
const math = require('mathjs')
const _ = require('underscore')
const async = require('async')
const time = require('node-tictoc')
const jsonfile = require('jsonfile')
const mkdirp = require('mkdirp')
const path = require('path')
// Analizer
// const articleAnalyzer = require('./articleAnalyzer.js')
// Database Agent
// const dbAgent = require('./dbAgent.js')
// XML Parser
// const parser = new xml2js.Parser()
// POS Tagger
const posTagger = require('./posTagger.js')
let endOfLine = require('os').EOL


// LOGIC
const folder = path.join('articles', 'articlesXML')
const paths = ['featuredArticles','aClassArticles', 'goodArticles', 'bClassArticles', 'cClassArticles', 'startArticles', 'stubArticles']
let pathIndex = 0
let qualityClass = 7

let articleNumber = 1

// Calculate POS Trigrams
const getAllPosTrigrams = (sentencesTags, cb) => {
  let posTrigrams = {}

  sentencesTags.forEach((sentenceTags) => {
    for (let i = 0; i <= sentenceTags.length-3; i++) {
      if (sentenceTags.slice(i, i + 3).length == 3) {
        if (sentenceTags.slice(i, i + 3) in posTrigrams) {
          posTrigrams[sentenceTags.slice(i, i + 3)]++
        }
        else {
          posTrigrams[sentenceTags.slice(i, i + 3)] = 1
        }
      }
    }
  })

  cb(posTrigrams)
}

// Calculate Char Trigrams
const getAllCharacterTrigrams = (text, cb) => {
  let characterTrigrams = {}

  for (let i = 0; i <= text.length-3; i++) {
    if (text.slice(i, i + 3).length == 3) {
      if (text.slice(i, i + 3) in characterTrigrams) {
        characterTrigrams[text.slice(i, i + 3)]++
      }
      else {
        characterTrigrams[text.slice(i, i + 3)] = 1
      }
    }
  }

  cb(characterTrigrams)
}

//
const load = (file, cb) => {
  if (file == '.DS_Store') {
    cb(null, 'ds_store')
  }
  else {
    let xmlFilename = path.join(folder, paths[pathIndex], file)

    console.log(articleNumber + ' XML LOADED: ' + file)
    console.log('- - - - - - - - - - - - - - - - - - - -')

    articleNumber++

    let options = {
      args: ['-o', 'tmp', '-q', xmlFilename]
    }

    // Run Python script
    PythonShell.run('WikiExtractor.py', options, (err, results) => {
      if (err && JSON.stringify(err.toString()).indexOf('2703') == -1) {
        throw err
      }

      // Load extracted article
      fs.readFile('tmp/AA/wiki_00', 'utf8', (err, extractedArticle) => {
        if (err) throw err
        // Now we have the xml file and the clean article

        // Delete surraunding tags (<doc> ...text... <\doc>)
        let text = extractedArticle.substring(extractedArticle.indexOf(">") + 1, extractedArticle.length - 7).trim()

        // ID
        let id = extractedArticle.split('\"')[1]

        // Article title from filename
        let title = file.replace(/\.xml/, '').trim()

        // Extract sentences
        let sentences = nlp.text(text).sentences

        text = text.substring(text.indexOf(endOfLine)).trim().replace(new RegExp(endOfLine, 'g'), ' ')


        let pos = []
        let sentencesTags = []

        posTagger.tag(sentences, (_pos, _sentencesTags) => {

          let article = {
            posTrigrams: {},
            characterTrigrams: {},
            qualityClass: qualityClass
          }

          pos = _pos.taggedWords
          sentencesTags = _sentencesTags

          getAllPosTrigrams(sentencesTags, (posTrigrams) => {
            article.posTrigrams = posTrigrams

            getAllCharacterTrigrams(text, (characterTrigrams) => {
              article.characterTrigrams = characterTrigrams


              fs.writeFileSync('trigrams_NUOVI/' + id, JSON.stringify(article, null, 2), 'utf-8')

              cb(null, 'Trigrams saved')
            })

          })

        })
      })
    })
  }
}

const readAllFiles = (_path, cb) => {
  _path = path.join(folder, _path)
  fs.readdir(_path, (err, files) => {
    if (err) console.log(err);
    else {
      console.log('Articles analysis: STARTING');
      async.eachSeries(
        files,
        load,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          else {
            pathIndex++
            qualityClass--
            console.log('Articles analysis: DONE');
            cb(null, 'Read All Files')
        }
      })
    }
  })
}

time.tic();

async.eachSeries(
  paths,
  readAllFiles,
  (err, result) => {
    if (err) console.log(err);
    else console.log('All articles have been analyzed!');
    console.log('Time elapsed: ');
    time.toc()
    process.exit()
  }
)
