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
const articleAnalyzer = require('./articleAnalyzer.js')
// Database Agent
const dbAgent = require('./dbAgent.js')
// XML Parser
const parser = new xml2js.Parser()

// LOGIC
const folder = path.join('articles', 'articlesXML')
// const paths = ['featuredArticles','aClassArticles', 'goodArticles', 'bClassArticles', 'cClassArticles', 'startArticles', 'stubArticles']
const paths = ['stubArticles']
let pathIndex = 0
// let qualityClass = 7
let qualityClass = 1

let articleNumber = 1

const load = (file, cb) => {
  let xmlFilename = path.join(folder, paths[pathIndex], file)

  // Read the file and print its contents.
  fs.readFile(xmlFilename, 'utf8', (err, xmlArticle) => {
    if (err) throw err

    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log(articleNumber + ' XML LOADED: ' + file)
    console.log('- - - - - - - - - - - - - - - - - - - -')

    articleNumber++

    // Remove subsubsection titles and similar
    const subsubsectionRegex = /====(.+?)====/g
    xmlArticle = xmlArticle.replace(subsubsectionRegex, '') || []

    let options = {
      args: ['-o', 'tmp', '--sections', '-q', xmlFilename]
    };

    // Run Python script
    PythonShell.run('WikiExtractor.py', options, (err, results) => {
      if (err && JSON.stringify(err.toString()).indexOf('2703') == -1) {
        throw err
      }


      // Load extracted article
      fs.readFile('tmp/AA/wiki_00', 'utf8', (err, extractedArticle) => {
        if (err) throw err
        // Now we have the xml file and the clean article

        // Parse XML file
        parser.parseString(xmlArticle, (err, result) => {
          if (err) throw err

          let articleTextFromXML = result.mediawiki.page[0].revision[0].text[0]._

          const sectionsRegex = /==(.+?)==/g
          let rawSections = articleTextFromXML.match(sectionsRegex) || []

          // Section titles with extra sections
          let sectionTitlesXML = rawSections.filter((element) => {
            return element.charAt(2) != '='
          })
          sectionTitlesXML = sectionTitlesXML.map((sectionTitle) => {
            sectionTitle = sectionTitle.substring(2)
            sectionTitle = sectionTitle.substring(0, sectionTitle.length - 2)
            return sectionTitle.trim()
          })

          // Subsection titles
          let subsectionTitlesXML = rawSections.filter((element) => {
            return element.charAt(2) == '=' && element.charAt(3) != '='
          })
          subsectionTitlesXML = subsectionTitlesXML.map((subsectionTitle) => {
            subsectionTitle = subsectionTitle.substring(3)
            subsectionTitle = subsectionTitle.substring(0, subsectionTitle.length - 2)
            return subsectionTitle.trim()
          })

          // Delete surraunding tags (<doc> ...text... <\doc>)
          let textWithTitleAndSectionTitles = extractedArticle.substring(extractedArticle.indexOf(">") + 1, extractedArticle.length - 7).trim()

          // ID
          let id = extractedArticle.split('\"')[1]

          dbAgent.findById(id, (doc) => {
            if (doc) {
              console.log('Article Found in DB');
              cb(null, 'Article Found in DB')
            }
            else {
              console.log('Article NOT Found in DB');
              console.log('ID: ' + id);

              // Article title from filename
              let title = file.replace(/\.xml/, '').trim()

              // Article title from article text
              // let title = decodeURI(textWithTitleAndSectionTitles.substring(0, textWithTitleAndSectionTitles.indexOf("\n")).replace(/\//g, '\u2215').replace(/:/g, '&#58;'))

              console.log('Title: ' + title);
              console.log('- - - - - - - - - - - - - - - - - - - -')

              // Delete the title
              let textWithSectionTitles = textWithTitleAndSectionTitles.substring(textWithTitleAndSectionTitles.indexOf("\n")).trim()

              // Subsection indexes
              let subsectionIndexes = []
              subsectionTitlesXML.forEach((subsectionTitle) => {
                let subsectionPattern = subsectionTitle.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g'), '\\$&') + '.'
                let regex = new RegExp(subsectionPattern, '')
                let index = textWithSectionTitles.search(regex)
                if (index > -1) {
                  subsectionIndexes.push(index)
                  textWithSectionTitles = textWithSectionTitles.replace(subsectionTitle + '.', '')
                }
              })

              // Initialized with element 0 because it's the index of the abstract
              let sectionIndexes = [0]
              sectionTitlesXML.forEach((sectionTitle) => {
                let sectionPattern = sectionTitle.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g'), '\\$&')
                let index = textWithSectionTitles.search(sectionPattern + '.')
                if (index > -1) {
                  sectionIndexes.push(index)
                  textWithSectionTitles = textWithSectionTitles.replace(sectionTitle + '.', '')
                }
              })

              sectionIndexes.sort((a, b) => {
                return a - b
              })

              let sections = []
              let abstract = ''

              // Get abstract and sections
              for (let i = 0; i < sectionIndexes.length; i++) {
                if (i == 0) {
                  abstract = textWithSectionTitles.substring(sectionIndexes[i], sectionIndexes[i+1]).trim()
                  // Put abstract in sections array
                  sections.push(textWithSectionTitles.substring(sectionIndexes[i], sectionIndexes[i+1]).trim())
                }
                else if (i == sectionIndexes.length - 1) {
                  sections.push(textWithSectionTitles.substring(sectionIndexes[i]).trim())
                }
                else {
                  sections.push(textWithSectionTitles.substring(sectionIndexes[i], sectionIndexes[i+1]).trim())
                }
              }

              // Section titles have been removed
              let text = textWithSectionTitles.replace(/\r?\n|\r/g, ' ')

              ////////////// PREPROCESSING ////////////

              // Extract sentences
              let sentences = nlp.text(text).sentences

              // Expand contractions
              let expandedText = nlp.text(text.toLowerCase()).contractions.expand().text()

              // Normalize text (remove all punctation, except for dots, and 'new line')
              let normalizedText = nlp.text(expandedText).normal();

              // Remove dots, question marks, exclamation marks and brackets
              let noPointsText = normalizedText.replace(/[\.|?|!|{|}|\[|\]]/g, '')

              // Text composed only by letters and numbers (no white spaces)
              let onlyLettersAndNumbersText = noPointsText.replace(/ /g, '')

              // Words array
              words = noPointsText.split(' ')

              // Root text (she sold seashells -> she sell seashell)
              let rootText = nlp.text(expandedText).root()

              if(text.length == 0) {
                console.log('NO TESTO');
                process.exit()
              }

              articleAnalyzer.analyze(articleTextFromXML, id, title, textWithSectionTitles, subsectionIndexes, abstract, sections, text, sentences, onlyLettersAndNumbersText, words, qualityClass, (articleJSON) => {
                // console.log(JSON.stringify(articleJSON.features, null, 2));

                let lengthFeatures = {}
                let structureFeatures = {}
                let styleFeatures = {}
                let readabilityFeatures = {}
                let lexicalFeatures = {}
                let posTrigrams = {}
                let charTrigrams = {}
                let reviewFeatures = {}

                lengthFeatures = articleJSON.features.lengthFeatures
                structureFeatures = articleJSON.features.structureFeatures
                styleFeatures = articleJSON.features.styleFeatures
                readabilityFeatures = articleJSON.features.readabilityFeatures
                lexicalFeatures = articleJSON.features.lexicalFeatures
                posTrigrams = articleJSON.features.posTrigrams
                charTrigrams = articleJSON.features.charTrigrams
                reviewFeatures = articleJSON.features.reviewFeatures

                let article = {}

                article.id = id
                article.title = title
                // // Length Features
                for (key in lengthFeatures) {
                  article[key] = lengthFeatures[key]
                }
                // Structure Features
                for (key in structureFeatures) {
                  article[key] = structureFeatures[key]
                }
                // Style Features
                for (key in styleFeatures) {
                  article[key] = styleFeatures[key]
                }
                // Readability Features
                for (key in readabilityFeatures) {
                  article[key] = readabilityFeatures[key]
                }
                // Lexical Features
                for (key in lexicalFeatures) {
                  article[key] = lexicalFeatures[key]
                }
                // Lexical Features
                for (key in posTrigrams) {
                  article[key] = posTrigrams[key]
                }
                // Lexical Features
                for (key in charTrigrams) {
                  article[key] = charTrigrams[key]
                }
                // Review Features
                for (key in reviewFeatures) {
                  article[key] = reviewFeatures[key]
                }
                // Quality Class
                article.qualityClass = qualityClass

                dbAgent.insertArticle(article, cb)

                // Print trigrams
                // let trigramObj = {
                //   posTrigrams: trigrams.posTrigrams,
                //   characterTrigrams: trigrams.characterTrigrams,
                //   qualityClass: qualityClass
                // }
                // let fileToSave = id + '.json'
                // let trigramPath = 'trigrams/'
                // mkdirp(trigramPath, (err) => {
                //   if (err) throw err
                //   jsonfile.writeFile(trigramPath + fileToSave, trigramObj, {spaces: 2}, (err) => {
                //     if (err) throw err
                //     // Save the article in MongoDB
                //     dbAgent.insertArticle(article, cb)
                //   })
                // })

              })

            }
          })

        })
      })
    })
  })

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
