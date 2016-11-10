// MODULES
var fs = require('fs');
var async = require('async')
var _ = require('underscore')
var math = require('mathjs')
var json2csv = require('json2csv');


// LOGIC
var path = 'trigrams/'

var articlesTrigrams = {
  fa: [],
  a: [],
  ga: [],
  b: [],
  c: [],
  start: [],
  stub: []
}

// Count in how many fa articles is present a certain pos trigrams
var faCharTrigramsPresence = {}
// Count in how many a articles is present a certain pos trigrams
var aCharTrigramsPresence = {}
// Count in how many ga articles is present a certain pos trigrams
var gaCharTrigramsPresence = {}
// Count in how many b articles is present a certain pos trigrams
var bCharTrigramsPresence = {}
// Count in how many c articles is present a certain pos trigrams
var cCharTrigramsPresence = {}
// Count in how many start articles is present a certain pos trigrams
var startCharTrigramsPresence = {}
// Count in how many stub articles is present a certain pos trigrams
var stubCharTrigramsPresence = {}

var charTrigrams = []
var fields = []
var articles = []

const load = (file, cb) => {
  var articleTrigramsFile = fs.readFileSync(path + file, 'utf8')
  var articleTrigrams = JSON.parse(articleTrigramsFile)
  var articleCharTrigrams = articleTrigrams.characterTrigrams

  for (key in articleCharTrigrams) {
    if (articleCharTrigrams.hasOwnProperty(key)) {
      if (articleTrigrams.qualityClass == 7) {
        if (faCharTrigramsPresence.hasOwnProperty(key)) {
        faCharTrigramsPresence[key]++
        }
        else {
          faCharTrigramsPresence[key] = 1
        }
      }
      else if (articleTrigrams.qualityClass == 6) {
        if (aCharTrigramsPresence.hasOwnProperty(key)) {
        aCharTrigramsPresence[key]++
        }
        else {
          aCharTrigramsPresence[key] = 1
        }
      }
      else if (articleTrigrams.qualityClass == 5) {
        if (gaCharTrigramsPresence.hasOwnProperty(key)) {
        gaCharTrigramsPresence[key]++
        }
        else {
          gaCharTrigramsPresence[key] = 1
        }
      }
      else if (articleTrigrams.qualityClass == 4) {
        if (bCharTrigramsPresence.hasOwnProperty(key)) {
        bCharTrigramsPresence[key]++
        }
        else {
          bCharTrigramsPresence[key] = 1
        }
      }
      else if (articleTrigrams.qualityClass == 3) {
        if (cCharTrigramsPresence.hasOwnProperty(key)) {
        cCharTrigramsPresence[key]++
        }
        else {
          cCharTrigramsPresence[key] = 1
        }
      }
      else if (articleTrigrams.qualityClass == 2) {
        if (startCharTrigramsPresence.hasOwnProperty(key)) {
        startCharTrigramsPresence[key]++
        }
        else {
          startCharTrigramsPresence[key] = 1
        }
      }
      else if (articleTrigrams.qualityClass == 1) {
        if (stubCharTrigramsPresence.hasOwnProperty(key)) {
        stubCharTrigramsPresence[key]++
        }
        else {
          stubCharTrigramsPresence[key] = 1
        }
      }


      // if (charTrigrams.indexOf(key.replace(/[\\$'"]/g, "\\$&")) == -1) {
      //   charTrigrams.push(key.replace(/[\\$'"]/g, "\\$&"))
      // }
      if (charTrigrams.indexOf(key) == -1) {
        charTrigrams.push(key)
      }
    }
  }
  cb(null, 'Load Trigrams')
}

const createJSON = (file, cb) => {
  var articleTrigramsFile = JSON.parse(fs.readFileSync(path + file, 'utf8'))
  var articleCharTrigrams = articleTrigramsFile.characterTrigrams
  var articleJSON = {}
  charTrigrams.forEach((charTrigram) => {
    if (articleCharTrigrams.hasOwnProperty(charTrigram)) {
      articleJSON[charTrigram] = articleCharTrigrams[charTrigram]
    }
    else {
      articleJSON[charTrigram] = 0
    }
  })
  articleJSON.qualityClass = articleTrigramsFile['qualityClass']
  articles.push(articleJSON)
  cb(null, 'Create JSON')
}

const printDataset = (cb) => {
  articles.sort(function(a, b) {
    return b.qualityClass - a.qualityClass
  })
  var csv = json2csv({ data: articles, fields: fields })
  fs.writeFile('datasets/charTrigramsDataset.csv', csv, function(err) {
    if (err) throw err;
    console.log('Char trigrams dataset Saved!')
    cb()
  })
}

fs.readdir(path, (err, files) => {
  if (err) console.log(err);
  else {
    console.log('Trigrams analysis: STARTING');
    async.eachSeries(
      files,
      load,
      (err, result) => {
        if (err) {
          console.log(err);
        }
        else {

          // for (var i = 0; i < charTrigrams.length; i++) {
          //   charTrigrams[i] = '"' + charTrigrams[i] + '"'
          // }
          //
          // console.log(charTrigrams.join(', '));
          // process.exit()

          for (var i = 0; i < charTrigrams.length; i++) {
            // console.log(faCharTrigramsPresence[charTrigrams[i]])
            // console.log(aCharTrigramsPresence[charTrigrams[i]])
            // console.log(gaCharTrigramsPresence[charTrigrams[i]])
            // console.log(bCharTrigramsPresence[charTrigrams[i]])
            // console.log(cCharTrigramsPresence[charTrigrams[i]])
            // console.log(startCharTrigramsPresence[charTrigrams[i]])
            // console.log(stubCharTrigramsPresence[charTrigrams[i]])
            // console.log('- - - - - - - - - - -');
            if (
              // (faCharTrigramsPresence[charTrigrams[i]] > 90 &&
              // aCharTrigramsPresence[charTrigrams[i]] > 90 &&
              // gaCharTrigramsPresence[charTrigrams[i]] > 90 &&
              // bCharTrigramsPresence[charTrigrams[i]] > 90 &&
              // cCharTrigramsPresence[charTrigrams[i]] > 90 &&
              // startCharTrigramsPresence[charTrigrams[i]] > 90 &&
              // stubCharTrigramsPresence[charTrigrams[i]] > 90)
              // ||
              (faCharTrigramsPresence[charTrigrams[i]] < 10 ||
                aCharTrigramsPresence[charTrigrams[i]] < 10 ||
                gaCharTrigramsPresence[charTrigrams[i]] < 10 ||
                bCharTrigramsPresence[charTrigrams[i]] < 10 ||
                cCharTrigramsPresence[charTrigrams[i]] < 10 ||
                startCharTrigramsPresence[charTrigrams[i]] < 10 ||
                stubCharTrigramsPresence[charTrigrams[i]] < 10)
            ) {
              charTrigrams.splice(i, 1)
              i--
            }

          }

          fields = _.union(charTrigrams, ["qualityClass"])

          async.eachSeries(
            files,
            createJSON,
            (err, result) => {
              if (err) {
                console.log(err);
              }
              else {
                printDataset(() => {
                  console.log(charTrigrams.length);
                  console.log('Trigrams analysis: DONE')
                  process.exit()
                })

              }
          })




        }
    })
  }
})
