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
// XML Parser
const parser = new xml2js.Parser()

// LOGIC
const folder = path.join('articles', 'articlesXML')
const paths = ['featuredArticles','aClassArticles', 'goodArticles', 'bClassArticles', 'cClassArticles', 'startArticles', 'stubArticles']
let pathIndex = 0
let qualityClass = 7

let articleNumber = 1

let namesIds = []

const load = (file, cb) => {
  if (file == '.DS_Store') {
    cb(null, 'ds_store')
  }
  else {
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

          // ID
          let id = extractedArticle.split('\"')[1]
          namesIds.push(file+'|'+id)
          cb(null, 'ok')
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
    else {
      namesIds.forEach((id) => {
        fs.appendFileSync('namesIds_NUOVI.txt', id + '\n')
      })
      console.log('Time elapsed: ');
      time.toc()
      process.exit()
    }
  }
)
