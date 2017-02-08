// MODULES
const fs = require('fs');
const async = require('async')
const _ = require('underscore')
const math = require('mathjs')
const json2csv = require('json2csv');
let endOfLine = require('os').EOL

// LOGIC
const path = '../trigrams_NUOVI/'

// Count in how many fa articles is present a certain char trigrams
let faCharTrigramsPresence = {}
// Count in how many a articles is present a certain char trigrams
let aCharTrigramsPresence = {}
// Count in how many ga articles is present a certain char trigrams
let gaCharTrigramsPresence = {}
// Count in how many b articles is present a certain char trigrams
let bCharTrigramsPresence = {}
// Count in how many c articles is present a certain char trigrams
let cCharTrigramsPresence = {}
// Count in how many start articles is present a certain char trigrams
let startCharTrigramsPresence = {}
// Count in how many stub articles is present a certain char trigrams
let stubCharTrigramsPresence = {}

let charTrigrams = []
let fields = []
let articles = []

const load = (file) => {
  let articleTrigramsFile = fs.readFileSync(path + file, 'utf8')
  let articleTrigrams = JSON.parse(articleTrigramsFile)
  let articleCharTrigrams = articleTrigrams.characterTrigrams

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
}

// const createJSON = (file) => {
//   let articleTrigramsFile = JSON.parse(fs.readFileSync(path + file, 'utf8'))
//   let articleCharTrigrams = articleTrigramsFile.characterTrigrams
//   let articleJSON = {}
//   let i = 1
//   charTrigrams.forEach((charTrigram) => {
//     if (articleCharTrigrams.hasOwnProperty(charTrigram)) {
//       articleJSON[(i).toString()] = articleCharTrigrams[charTrigram]
//     }
//     else {
//       articleJSON[(i).toString()] = 0
//     }
//     i++
//   })
//   articleJSON.qualityClass = articleTrigramsFile['qualityClass']
//   articles.push(articleJSON)
// }

const createJSON = (file) => {
  let articleTrigramsFile = JSON.parse(fs.readFileSync(path + file, 'utf8'))
  let articleCharTrigrams = articleTrigramsFile.characterTrigrams
  let articleJSON = {}



  let line = ''


  charTrigrams.forEach((charTrigram) => {
    if (articleCharTrigrams.hasOwnProperty(charTrigram)) {
      // articleJSON[charTrigram] = articleCharTrigrams[charTrigram]
      line = line + articleCharTrigrams[charTrigram] + ','
    }
    else {
      // articleJSON[charTrigram] = 0

      line = line + '0,'

    }
  })

  line = line + articleTrigramsFile['qualityClass']
  // articles.push(articleJSON)



  // console.log(csv.indexOf(endOfLine));

  fs.appendFileSync('../datasets/MHcharTrigramsDataset.csv', line+endOfLine, 'utf-8')

  // process.exit()


}

const printDataset = (cb) => {
  articles.sort(function(a, b) {
    return b.qualityClass - a.qualityClass
  })
  let csv = json2csv({ data: articles, fields: fields })
  fs.writeFile('../datasets/MHcharTrigramsDataset.csv', csv, function(err) {
    if (err) throw err;
    console.log('Char trigrams dataset Saved!')
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



    for (let i = 0; i < charTrigrams.length; i++) {
      if (
        i == 34 -1 ||
        i == 35 -1 ||
        i == 76 -1 ||
        i == 77 -1 ||
        i == 78 -1 ||
        i == 79 -1 ||
        i == 80 -1 ||
        i == 86 -1 ||
        i == 119 -1 ||
        i == 120 -1 ||
        i == 121 -1 ||
        i == 122 -1 ||
        i == 124 -1 ||
        i == 131 -1 ||
        i == 134 -1 ||
        i == 135 -1 ||
        i == 136 -1 ||
        i == 137 -1 ||
        i == 138 -1 ||
        i == 139 -1 ||
        i == 158 -1 ||
        i == 164 -1 ||
        i == 175 -1 ||
        i == 184 -1 ||
        i == 202 -1 ||
        i == 203 -1 ||
        i == 217 -1 ||
        i == 227 -1 ||
        i == 228 -1 ||
        i == 249 -1 ||
        i == 250 -1 ||
        i == 267 -1 ||
        i == 273 -1 ||
        i == 278 -1 ||
        i == 314 -1 ||
        i == 329 -1 ||
        i == 334 -1 ||
        i == 343 -1 ||
        i == 353 -1 ||
        i == 361 -1 ||
        i == 367 -1 ||
        i == 376 -1 ||
        i == 410 -1 ||
        i == 412 -1 ||
        i == 413 -1 ||
        i == 460 -1 ||
        i == 465 -1 ||
        i == 501 -1 ||
        i == 522 -1 ||
        i == 529 -1 ||
        i == 582 -1 ||
        i == 590 -1 ||
        i == 608 -1 ||
        i == 629 -1 ||
        i == 630 -1 ||
        i == 631 -1 ||
        i == 635 -1 ||
        i == 651 -1 ||
        i == 779 -1 ||
        i == 970 -1 ||
        i == 975 -1 ||
        i == 1131 -1 ||
        i == 1418 -1 ) {
          console.log('"' + charTrigrams[i] + '"');
        }


      charTrigrams[i] = (i+1).toString()
    }






    process.exit()


    console.log(charTrigrams.length);

    fields = _.union(charTrigrams, ["qualityClass"])

    let line = ''


    // charTrigrams.forEach((charTrigram) => {
    //   line = line + '"' + charTrigram + '",'
    // })


    for (var i = 0; i < charTrigrams.length; i++) {
      let j = i+1
      line = line + '"' + j + '",'
    }


    line = line + "qualityClass"



    fs.writeFileSync('../datasets/MHcharTrigramsDataset.csv', line+endOfLine, 'utf-8')


    files.forEach((file) => {
      createJSON(file)
    })

    console.log('Trigrams analysis: DONE')
    process.exit()

    // printDataset(() => {
    //   // console.log(charTrigrams);
    //   console.log(charTrigrams.length);
    //   console.log('Trigrams analysis: DONE')
    //   process.exit()
    // })






    // async.eachSeries(
    //   files,
    //   load,
    //   (err, result) => {
    //     if (err) {
    //       console.log(err);
    //     }
    //     else {
    //       async.eachSeries(
    //         files,
    //         createJSON,
    //         (err, result) => {
    //           if (err) {
    //             console.log(err);
    //           }
    //           else {
    //             // for (let i = 0; i < charTrigrams.length; i++) {
    //             //   if (
    //             //     i == 42 - 1 ||
    //             //     i == 70 - 1 ||
    //             //     i == 71 - 1 ||
    //             //     i == 81 - 1 ||
    //             //     i == 82 - 1 ||
    //             //     i == 89 - 1 ||
    //             //     i == 90 - 1 ||
    //             //     i == 111 - 1 ||
    //             //     i == 140 - 1 ||
    //             //     i == 169 - 1 ||
    //             //     i == 170 - 1 ||
    //             //     i == 183 - 1 ||
    //             //     i == 194 - 1 ||
    //             //     i == 195 - 1 ||
    //             //     i == 196 - 1 ||
    //             //     i == 248 - 1 ||
    //             //     i == 291 - 1 ||
    //             //     i == 566 - 1 ||
    //             //     i == 836 - 1 ) {
    //             //       console.log(charTrigrams[i]);
    //             //     }
    //             //
    //             //
    //             //
    //             //
    //             //
    //             //
    //             //
    //             //
    //             //
    //             //
    //             //   charTrigrams[i] = (i+1).toString()
    //             // }
    //
    //             fields = _.union(charTrigrams, ["qualityClass"])
    //             printDataset(() => {
    //               // console.log(charTrigrams);
    //               console.log(charTrigrams.length);
    //               console.log('Trigrams analysis: DONE')
    //               process.exit()
    //             })
    //           }
    //       })
    //     }
    // })
  }
})
