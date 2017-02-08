// MODULES
const fs = require('fs');
const async = require('async')
const _ = require('underscore')
const math = require('mathjs')
const json2csv = require('json2csv');


// LOGIC
var path = '../trigrams_NUOVI/'

// Count in how many fa articles is present a certain pos trigrams
var faPosTrigramsPresence = {}
// Count in how many a articles is present a certain pos trigrams
var aPosTrigramsPresence = {}
// Count in how many ga articles is present a certain pos trigrams
var gaPosTrigramsPresence = {}
// Count in how many b articles is present a certain pos trigrams
var bPosTrigramsPresence = {}
// Count in how many c articles is present a certain pos trigrams
var cPosTrigramsPresence = {}
// Count in how many start articles is present a certain pos trigrams
var startPosTrigramsPresence = {}
// Count in how many stub articles is present a certain pos trigrams
var stubPosTrigramsPresence = {}

var posTrigrams = []
var fields = []
var articles = []

const load = (file) => {
  var articleTrigramsFile = fs.readFileSync(path + file, 'utf8')
  var articleTrigrams = JSON.parse(articleTrigramsFile)
  var articlePosTrigrams = articleTrigrams.posTrigrams

  for (key in articlePosTrigrams) {
    if (articlePosTrigrams.hasOwnProperty(key)) {
      if (articleTrigrams.qualityClass == 7) {
        if (faPosTrigramsPresence.hasOwnProperty(key)) {
        faPosTrigramsPresence[key]++
        }
        else {
          faPosTrigramsPresence[key] = 1
        }
      }
      else if (articleTrigrams.qualityClass == 6) {
        if (aPosTrigramsPresence.hasOwnProperty(key)) {
        aPosTrigramsPresence[key]++
        }
        else {
          aPosTrigramsPresence[key] = 1
        }
      }
      else if (articleTrigrams.qualityClass == 5) {
        if (gaPosTrigramsPresence.hasOwnProperty(key)) {
        gaPosTrigramsPresence[key]++
        }
        else {
          gaPosTrigramsPresence[key] = 1
        }
      }
      else if (articleTrigrams.qualityClass == 4) {
        if (bPosTrigramsPresence.hasOwnProperty(key)) {
        bPosTrigramsPresence[key]++
        }
        else {
          bPosTrigramsPresence[key] = 1
        }
      }
      else if (articleTrigrams.qualityClass == 3) {
        if (cPosTrigramsPresence.hasOwnProperty(key)) {
        cPosTrigramsPresence[key]++
        }
        else {
          cPosTrigramsPresence[key] = 1
        }
      }
      else if (articleTrigrams.qualityClass == 2) {
        if (startPosTrigramsPresence.hasOwnProperty(key)) {
        startPosTrigramsPresence[key]++
        }
        else {
          startPosTrigramsPresence[key] = 1
        }
      }
      else if (articleTrigrams.qualityClass == 1) {
        if (stubPosTrigramsPresence.hasOwnProperty(key)) {
        stubPosTrigramsPresence[key]++
        }
        else {
          stubPosTrigramsPresence[key] = 1
        }
      }


      if (posTrigrams.indexOf(key) == -1) {
        posTrigrams.push(key)
      }
    }
  }
}

const createJSON = (file) => {
  var articleTrigramsFile = JSON.parse(fs.readFileSync(path + file, 'utf8'))
  var articlePosTrigrams = articleTrigramsFile.posTrigrams
  var articleJSON = {}
  posTrigrams.forEach((posTrigram) => {
    if (articlePosTrigrams.hasOwnProperty(posTrigram)) {
      articleJSON[posTrigram] = articlePosTrigrams[posTrigram]
    }
    else {
      articleJSON[posTrigram] = 0
    }
  })
  articleJSON.qualityClass = articleTrigramsFile['qualityClass']
  articles.push(articleJSON)
}

const printDataset = (cb) => {
  articles.sort(function(a, b) {
    return b.qualityClass - a.qualityClass
  })
  var csv = json2csv({ data: articles, fields: fields })
  fs.writeFile('../datasets/MHposTrigramsDataset.csv', csv, function(err) {
    if (err) throw err;
    console.log('Pos trigrams dataset Saved!')
    cb()
  })
}

fs.readdir(path, (err, files) => {
  if (err) console.log(err);
  else {
    console.log('Trigrams analysis: STARTING');

    let index = files.indexOf('.DS_Store');
    if (index > -1) {
      files.splice(index, 1);
    }

    files.forEach((file) => {
      load(file)
    })

    console.log(posTrigrams.length)
    // process.exit()

    fields = _.union(posTrigrams, ["qualityClass"])

    files.forEach((file) => {
      createJSON(file)
    })

    printDataset(() => {
      // console.log(posTrigrams);
      console.log(posTrigrams.length);
      console.log('Trigrams analysis: DONE')
      process.exit()
    })


    // async.eachSeries(
    //   files,
    //   load,
    //   (err, result) => {
    //     if (err) {
    //       console.log(err);
    //     }
    //     else {
    //       // for (var i = 0; i < posTrigrams.length; i++) {
    //       //
    //       //   if (faPosTrigramsPresence[posTrigrams[i]] == undefined) {
    //       //     faPosTrigramsPresence[posTrigrams[i]] = 0
    //       //   }
    //       //   if (aPosTrigramsPresence[posTrigrams[i]] == undefined) {
    //       //     aPosTrigramsPresence[posTrigrams[i]] = 0
    //       //   }
    //       //   if (gaPosTrigramsPresence[posTrigrams[i]] == undefined) {
    //       //     gaPosTrigramsPresence[posTrigrams[i]] = 0
    //       //   }
    //       //   if (bPosTrigramsPresence[posTrigrams[i]] == undefined) {
    //       //     bPosTrigramsPresence[posTrigrams[i]] = 0
    //       //   }
    //       //   if (cPosTrigramsPresence[posTrigrams[i]] == undefined) {
    //       //     cPosTrigramsPresence[posTrigrams[i]] = 0
    //       //   }
    //       //   if (startPosTrigramsPresence[posTrigrams[i]] == undefined) {
    //       //     startPosTrigramsPresence[posTrigrams[i]] = 0
    //       //   }
    //       //   if (stubPosTrigramsPresence[posTrigrams[i]] == undefined) {
    //       //     stubPosTrigramsPresence[posTrigrams[i]] = 0
    //       //   }
    //       //
    //       //   if (
    //       //     // faPosTrigramsPresence[posTrigrams[i]] ||
    //       //     // aPosTrigramsPresence[posTrigrams[i]] ||
    //       //     // gaPosTrigramsPresence[posTrigrams[i]] ||
    //       //     // bPosTrigramsPresence[posTrigrams[i]] ||
    //       //     // cPosTrigramsPresence[posTrigrams[i]] ||
    //       //     // startPosTrigramsPresence[posTrigrams[i]] ||
    //       //     // stubPosTrigramsPresence[posTrigrams[i]] ||
    //       //
    //       //
    //       //     (faPosTrigramsPresence[posTrigrams[i]] < 5 ||
    //       //     aPosTrigramsPresence[posTrigrams[i]] < 5 ||
    //       //     gaPosTrigramsPresence[posTrigrams[i]] < 5 ||
    //       //     bPosTrigramsPresence[posTrigrams[i]] < 5 ||
    //       //     cPosTrigramsPresence[posTrigrams[i]] < 5 ||
    //       //     startPosTrigramsPresence[posTrigrams[i]] < 5 ||
    //       //     stubPosTrigramsPresence[posTrigrams[i]] < 5)
    //       //   ) {
    //       //     posTrigrams.splice(i, 1)
    //       //     i--
    //       //   }
    //       //
    //       // }
    //
    //       // console.log(faPosTrigramsPresence["يخ "]);
    //       // console.log(aPosTrigramsPresence["يخ "]);
    //       // console.log(gaPosTrigramsPresence["يخ "]);
    //       // console.log(bPosTrigramsPresence["يخ "]);
    //       // console.log(cPosTrigramsPresence["يخ "]);
    //       // console.log(startPosTrigramsPresence["يخ "]);
    //       // console.log(stubPosTrigramsPresence["يخ "]);
    //
    //
    //       // for (var i = 0; i < posTrigrams.length; i++) {
    //       //   posTrigrams[i] = (i+1).toString()
    //       // }
    //
    //       // console.log(posTrigrams.join(', '));
    //
    //       // console.log(posTrigrams.length)
    //       // process.exit()
    //
    //       fields = _.union(posTrigrams, ["qualityClass"])
    //
    //       async.eachSeries(
    //         files,
    //         createJSON,
    //         (err, result) => {
    //           if (err) {
    //             console.log(err);
    //           }
    //           else {
    //             printDataset(() => {
    //               // console.log(posTrigrams);
    //               console.log(posTrigrams.length);
    //               console.log('Trigrams analysis: DONE')
    //               process.exit()
    //             })
    //
    //           }
    //       })
    //
    //
    //
    //
    //     }
    // })
  }
})
