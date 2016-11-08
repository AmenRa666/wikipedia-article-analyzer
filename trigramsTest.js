// MODULES
var fs = require('fs');
var async = require('async')
var _ = require('underscore')
var math = require('mathjs')


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



// sentencesTags.forEach((sentenceTags) => {
//
//   for (let i = 0; i < sentenceTags.length; i += 3) {
//
//     trigram = {
//       posTrigram: sentenceTags.slice(i, i + 3)
//     }
//
//     if (sentenceTags.slice(i, i + 3).length == 3) {
//
//       if (sentenceTags.slice(i, i + 3) in posTrigrams) {
//         posTrigrams[sentenceTags.slice(i, i + 3)]++
//       }
//
//       else {
//         posTrigrams[sentenceTags.slice(i, i + 3)] = 1
//       }
//     }
//
//   }
//
// })

// Count the number of occurences of each trigrams in all fa articles
var faPosTrigramsSums = {}
// occurences mean of each trigrams in fa articles
var faPosTrigramsMeans = {}
// Count in how many fa articles is present a certain pos trigrams
var faPosTrigramsPresence = {}
// standard deviations
var faPosTrigramsStdDev = {}

// Count the number of occurences of each trigrams in all a articles
var aPosTrigramsSums = {}
// occurences mean of each trigrams in a articles
var aPosTrigramsMeans = {}
// Count in how many a articles is present a certain pos trigrams
var aPosTrigramsPresence = {}
// standard deviations
var aPosTrigramsStdDev = {}

// Count the number of occurences of each trigrams in all ga articles
var gaPosTrigramsSums = {}
// occurences mean of each trigrams in ga articles
var gaPosTrigramsMeans = {}
// Count in how many ga articles is present a certain pos trigrams
var gaPosTrigramsPresence = {}
// standard deviations
var gaPosTrigramsStdDev = {}

// Count the number of occurences of each trigrams in all b articles
var bPosTrigramsSums = {}
// occurences mean of each trigrams in b articles
var bPosTrigramsMeans = {}
// Count in how many b articles is present a certain pos trigrams
var bPosTrigramsPresence = {}
// standard deviations
var bPosTrigramsStdDev = {}

// Count the number of occurences of each trigrams in all c articles
var cPosTrigramsSums = {}
// occurences mean of each trigrams in c articles
var cPosTrigramsMeans = {}
// Count in how many c articles is present a certain pos trigrams
var cPosTrigramsPresence = {}
// standard deviations
var cPosTrigramsStdDev = {}

// Count the number of occurences of each trigrams in all start articles
var startPosTrigramsSums = {}
// occurences mean of each trigrams in start articles
var startPosTrigramsMeans = {}
// Count in how many start articles is present a certain pos trigrams
var startPosTrigramsPresence = {}
// standard deviations
var startPosTrigramsStdDev = {}

// Count the number of occurences of each trigrams in all stub articles
var stubPosTrigramsSums = {}
// occurences mean of each trigrams in stub articles
var stubPosTrigramsMeans = {}
// Count in how many stub articles is present a certain pos trigrams
var stubPosTrigramsPresence = {}
// standard deviations
var stubPosTrigramsStdDev = {}

const analyzeFA = (cb) => {
  var fa = articlesTrigrams.fa

  fa.forEach((articleTrigrams) => {
    var articlePosTrigrams = articleTrigrams.posTrigrams
    for (var key in articlePosTrigrams) {
      if (articlePosTrigrams.hasOwnProperty(key)) {
        if (key in faPosTrigramsSums) {
          faPosTrigramsSums[key] = faPosTrigramsSums[key] + articlePosTrigrams[key]
          faPosTrigramsPresence[key]++
        }
        else {
          faPosTrigramsSums[key] = articlePosTrigrams[key]
          faPosTrigramsPresence[key] = 1
        }
      }
    }
  })

  for (var key in faPosTrigramsSums) {
    if (faPosTrigramsSums.hasOwnProperty(key)) {
      faPosTrigramsMeans[key] = faPosTrigramsSums[key]/fa.length
    }
  }

  for (var key in faPosTrigramsSums) {
    var posArray = []
    fa.forEach((articleTrigrams) => {
      var articlePosTrigrams = articleTrigrams.posTrigrams

      if (articlePosTrigrams.hasOwnProperty(key)) {
        posArray.push(articlePosTrigrams[key])
      }
      else {
        posArray.push(0)
      }

    })

    faPosTrigramsStdDev[key] = math.std(posArray)
  }
  cb(null, 'FA OK')
}

const analyzeA = (cb) => {
  var a = articlesTrigrams.a

  a.forEach((articleTrigrams) => {
    var articlePosTrigrams = articleTrigrams.posTrigrams
    for (var key in articlePosTrigrams) {
      if (articlePosTrigrams.hasOwnProperty(key)) {
        if (key in aPosTrigramsSums) {
          aPosTrigramsSums[key] = aPosTrigramsSums[key] + articlePosTrigrams[key]
          aPosTrigramsPresence[key]++
        }
        else {
          aPosTrigramsSums[key] = articlePosTrigrams[key]
          aPosTrigramsPresence[key] = 1
        }
      }
    }
  })

  for (var key in aPosTrigramsSums) {
    if (aPosTrigramsSums.hasOwnProperty(key)) {
      aPosTrigramsMeans[key] = aPosTrigramsSums[key]/a.length
    }
  }

  for (var key in aPosTrigramsSums) {
    var posArray = []
    a.forEach((articleTrigrams) => {
      var articlePosTrigrams = articleTrigrams.posTrigrams

      if (articlePosTrigrams.hasOwnProperty(key)) {
        posArray.push(articlePosTrigrams[key])
      }
      else {
        posArray.push(0)
      }

    })

    aPosTrigramsStdDev[key] = math.std(posArray)
  }
  cb(null, 'A OK')
}

const analyzeGA = (cb) => {
  var ga = articlesTrigrams.ga

  ga.forEach((articleTrigrams) => {
    var articlePosTrigrams = articleTrigrams.posTrigrams
    for (var key in articlePosTrigrams) {
      if (articlePosTrigrams.hasOwnProperty(key)) {
        if (key in gaPosTrigramsSums) {
          gaPosTrigramsSums[key] = gaPosTrigramsSums[key] + articlePosTrigrams[key]
          gaPosTrigramsPresence[key]++
        }
        else {
          gaPosTrigramsSums[key] = articlePosTrigrams[key]
          gaPosTrigramsPresence[key] = 1
        }
      }
    }
  })

  for (var key in gaPosTrigramsSums) {
    if (gaPosTrigramsSums.hasOwnProperty(key)) {
      gaPosTrigramsMeans[key] = gaPosTrigramsSums[key]/ga.length
    }
  }

  for (var key in gaPosTrigramsSums) {
    var posArray = []
    ga.forEach((articleTrigrams) => {
      var articlePosTrigrams = articleTrigrams.posTrigrams

      if (articlePosTrigrams.hasOwnProperty(key)) {
        posArray.push(articlePosTrigrams[key])
      }
      else {
        posArray.push(0)
      }

    })

    gaPosTrigramsStdDev[key] = math.std(posArray)
  }
  cb(null, 'GA OK')
}

const analyzeB = (cb) => {
  var b = articlesTrigrams.b

  b.forEach((articleTrigrams) => {
    var articlePosTrigrams = articleTrigrams.posTrigrams
    for (var key in articlePosTrigrams) {
      if (articlePosTrigrams.hasOwnProperty(key)) {
        if (key in bPosTrigramsSums) {
          bPosTrigramsSums[key] = bPosTrigramsSums[key] + articlePosTrigrams[key]
          bPosTrigramsPresence[key]++
        }
        else {
          bPosTrigramsSums[key] = articlePosTrigrams[key]
          bPosTrigramsPresence[key] = 1
        }
      }
    }
  })

  for (var key in bPosTrigramsSums) {
    if (bPosTrigramsSums.hasOwnProperty(key)) {
      bPosTrigramsMeans[key] = bPosTrigramsSums[key]/b.length
    }
  }

  for (var key in bPosTrigramsSums) {
    var posArray = []
    b.forEach((articleTrigrams) => {
      var articlePosTrigrams = articleTrigrams.posTrigrams

      if (articlePosTrigrams.hasOwnProperty(key)) {
        posArray.push(articlePosTrigrams[key])
      }
      else {
        posArray.push(0)
      }

    })

    bPosTrigramsStdDev[key] = math.std(posArray)
  }
  cb(null, 'B OK')
}

const analyzeC = (cb) => {
  var c = articlesTrigrams.c

  c.forEach((articleTrigrams) => {
    var articlePosTrigrams = articleTrigrams.posTrigrams
    for (var key in articlePosTrigrams) {
      if (articlePosTrigrams.hasOwnProperty(key)) {
        if (key in cPosTrigramsSums) {
          cPosTrigramsSums[key] = cPosTrigramsSums[key] + articlePosTrigrams[key]
          cPosTrigramsPresence[key]++
        }
        else {
          cPosTrigramsSums[key] = articlePosTrigrams[key]
          cPosTrigramsPresence[key] = 1
        }
      }
    }
  })

  for (var key in cPosTrigramsSums) {
    if (cPosTrigramsSums.hasOwnProperty(key)) {
      cPosTrigramsMeans[key] = cPosTrigramsSums[key]/c.length
    }
  }

  for (var key in cPosTrigramsSums) {
    var posArray = []
    c.forEach((articleTrigrams) => {
      var articlePosTrigrams = articleTrigrams.posTrigrams

      if (articlePosTrigrams.hasOwnProperty(key)) {
        posArray.push(articlePosTrigrams[key])
      }
      else {
        posArray.push(0)
      }

    })

    cPosTrigramsStdDev[key] = math.std(posArray)
  }
  cb(null, 'C OK')
}


const analyzeStart = (cb) => {
  var start = articlesTrigrams.start

  start.forEach((articleTrigrams) => {
    var articlePosTrigrams = articleTrigrams.posTrigrams
    for (var key in articlePosTrigrams) {
      if (articlePosTrigrams.hasOwnProperty(key)) {
        if (key in startPosTrigramsSums) {
          startPosTrigramsSums[key] = startPosTrigramsSums[key] + articlePosTrigrams[key]
          startPosTrigramsPresence[key]++
        }
        else {
          startPosTrigramsSums[key] = articlePosTrigrams[key]
          startPosTrigramsPresence[key] = 1
        }
      }
    }
  })

  for (var key in startPosTrigramsSums) {
    if (startPosTrigramsSums.hasOwnProperty(key)) {
      startPosTrigramsMeans[key] = startPosTrigramsSums[key]/start.length
    }
  }

  for (var key in startPosTrigramsSums) {
    var posArray = []
    start.forEach((articleTrigrams) => {
      var articlePosTrigrams = articleTrigrams.posTrigrams

      if (articlePosTrigrams.hasOwnProperty(key)) {
        posArray.push(articlePosTrigrams[key])
      }
      else {
        posArray.push(0)
      }

    })

    startPosTrigramsStdDev[key] = math.std(posArray)
  }
  cb(null, 'Start OK')
}

const analyzeStub = (cb) => {
  var stub = articlesTrigrams.stub

  stub.forEach((articleTrigrams) => {
    var articlePosTrigrams = articleTrigrams.posTrigrams
    for (var key in articlePosTrigrams) {
      if (articlePosTrigrams.hasOwnProperty(key)) {
        if (key in stubPosTrigramsSums) {
          stubPosTrigramsSums[key] = stubPosTrigramsSums[key] + articlePosTrigrams[key]
          stubPosTrigramsPresence[key]++
        }
        else {
          stubPosTrigramsSums[key] = articlePosTrigrams[key]
          stubPosTrigramsPresence[key] = 1
        }
      }
    }
  })

  for (var key in stubPosTrigramsSums) {
    if (stubPosTrigramsSums.hasOwnProperty(key)) {
      stubPosTrigramsMeans[key] = stubPosTrigramsSums[key]/stub.length
    }
  }

  for (var key in stubPosTrigramsSums) {
    var posArray = []
    stub.forEach((articleTrigrams) => {
      var articlePosTrigrams = articleTrigrams.posTrigrams

      if (articlePosTrigrams.hasOwnProperty(key)) {
        posArray.push(articlePosTrigrams[key])
      }
      else {
        posArray.push(0)
      }

    })

    stubPosTrigramsStdDev[key] = math.std(posArray)
  }
  cb(null, 'Stub OK')
}

const load = (file, cb) => {
  var articleTrigramsFile = fs.readFileSync(path + file, 'utf8')
  var articleTrigrams = JSON.parse(articleTrigramsFile);

  if (articleTrigrams.qualityClass == 7) {
    articlesTrigrams.fa.push(articleTrigrams)
  }
  else if (articleTrigrams.qualityClass == 6) {
    articlesTrigrams.a.push(articleTrigrams)
  }
  else if (articleTrigrams.qualityClass == 5) {
    articlesTrigrams.ga.push(articleTrigrams)
  }
  else if (articleTrigrams.qualityClass == 4) {
    articlesTrigrams.b.push(articleTrigrams)
  }
  else if (articleTrigrams.qualityClass == 3) {
    articlesTrigrams.c.push(articleTrigrams)
  }
  else if (articleTrigrams.qualityClass == 2) {
    articlesTrigrams.start.push(articleTrigrams)
  }
  else if (articleTrigrams.qualityClass == 1) {
    articlesTrigrams.stub.push(articleTrigrams)
  }

  cb(null, 'Load Trigrams')
}

const analyze = (cb) => {
  async.parallel([
    analyzeFA,
    analyzeA,
    analyzeGA,
    analyzeB,
    analyzeC,
    analyzeStart,
    analyzeStub
  ], (err, result) => {

    var posTrigramsList = []

    for (var key in faPosTrigramsMeans) {
      if (faPosTrigramsMeans.hasOwnProperty(key)) {
        if (posTrigramsList.indexOf(key) < 0) {
          posTrigramsList.push(key)
        }
      }
    }

    for (var key in aPosTrigramsMeans) {
      if (aPosTrigramsMeans.hasOwnProperty(key)) {
        if (posTrigramsList.indexOf(key) < 0) {
          posTrigramsList.push(key)
        }
      }
    }

    for (var key in gaPosTrigramsMeans) {
      if (gaPosTrigramsMeans.hasOwnProperty(key)) {
        if (posTrigramsList.indexOf(key) < 0) {
          posTrigramsList.push(key)
        }
      }
    }

    for (var key in bPosTrigramsMeans) {
      if (bPosTrigramsMeans.hasOwnProperty(key)) {
        if (posTrigramsList.indexOf(key) < 0) {
          posTrigramsList.push(key)
        }
      }
    }

    for (var key in cPosTrigramsMeans) {
      if (cPosTrigramsMeans.hasOwnProperty(key)) {
        if (posTrigramsList.indexOf(key) < 0) {
          posTrigramsList.push(key)
        }
      }
    }

    for (var key in startPosTrigramsMeans) {
      if (startPosTrigramsMeans.hasOwnProperty(key)) {
        if (posTrigramsList.indexOf(key) < 0) {
          posTrigramsList.push(key)
        }
      }
    }

    for (var key in stubPosTrigramsMeans) {
      if (stubPosTrigramsMeans.hasOwnProperty(key)) {
        if (posTrigramsList.indexOf(key) < 0) {
          posTrigramsList.push(key)
        }
      }
    }

    var i = 1

    posTrigramsList.forEach((posTrigrams) => {
      if (faPosTrigramsPresence[posTrigrams] > 89 ||
          aPosTrigramsPresence[posTrigrams] > 89 ||
          gaPosTrigramsPresence[posTrigrams] > 89 ||
          bPosTrigramsPresence[posTrigrams] > 89 ||
          cPosTrigramsPresence[posTrigrams] > 89 ||
          startPosTrigramsPresence[posTrigrams] > 89 ||
          stubPosTrigramsPresence[posTrigrams] > 89
      ) {

        var max = 0

        if (faPosTrigramsMeans[posTrigrams] > max) {
          max = faPosTrigramsMeans[posTrigrams]
        }
        if (aPosTrigramsMeans[posTrigrams]  > max) {
          max = aPosTrigramsMeans[posTrigrams]
        }
        if (gaPosTrigramsMeans[posTrigrams]  > max) {
          max = gaPosTrigramsMeans[posTrigrams]
        }
        if (bPosTrigramsMeans[posTrigrams]  > max) {
          max = bPosTrigramsMeans[posTrigrams]
        }
        if (cPosTrigramsMeans[posTrigrams]  > max) {
          max = cPosTrigramsMeans[posTrigrams]
        }
        if (startPosTrigramsMeans[posTrigrams]  > max) {
          max = startPosTrigramsMeans[posTrigrams]
        }
        if (stubPosTrigramsMeans[posTrigrams]  > max) {
          max = stubPosTrigramsMeans[posTrigrams]
        }

        console.log('- - - - - - - - - -');
        console.log(posTrigrams);
        console.log(faPosTrigramsMeans[posTrigrams]/max);
        console.log(aPosTrigramsMeans[posTrigrams]/max);
        console.log(gaPosTrigramsMeans[posTrigrams]/max);
        console.log(bPosTrigramsMeans[posTrigrams]/max);
        console.log(cPosTrigramsMeans[posTrigrams]/max);
        console.log(startPosTrigramsMeans[posTrigrams]/max);
        console.log(stubPosTrigramsMeans[posTrigrams]/max);
        // console.log('      - - - -      ');
        // console.log(faPosTrigramsStdDev[posTrigrams]);
        // console.log(aPosTrigramsStdDev[posTrigrams]);
        // console.log(gaPosTrigramsStdDev[posTrigrams]);
        // console.log(bPosTrigramsStdDev[posTrigrams]);
        // console.log(cPosTrigramsStdDev[posTrigrams]);
        // console.log(startPosTrigramsStdDev[posTrigrams]);
        // console.log(stubPosTrigramsStdDev[posTrigrams]);
        i++
        console.log(i);
      }
    })








    cb()
  }
  )
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


          analyze(() => {
            console.log('Trigrams analysis: DONE');
          })

        }
    })
  }
})
