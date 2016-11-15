// MODULES
var fs = require('fs');
var async = require('async')
var _ = require('underscore')
var math = require('mathjs')
var json2csv = require('json2csv');


// LOGIC
var path = 'trigrams/'

var charTrigrams = [ "he ", "ing", "ng ", " th", "the", " of", "of ", "in ", " in", "ion", "on ", "ed ", " an", "and", "nd ", "er ", " to", "to ", "as " ]
var posTrigrams = [ "DT,NNP,NNP", "NNP,NNP,NNP", "DT,NN,IN", "NN,IN,DT", "IN,DT,NNP", "NNP,NNP,IN", "NNP,IN,NNP", "NNP,IN,DT", "IN,DT,NN", "DT,NN,VBD", "NNS,IN,DT", "NNP,NNP,VBD", "JJ,NN,IN", "IN,DT,JJ", "DT,JJ,NN", "NN,IN,NNP", "IN,NNP,NNP", "VBD,DT,NN", "VBD,VBN,IN", "VBN,IN,DT", "NN,IN,NN", "IN,NN,IN", "JJ,NNS,IN", "NN,CC,NN", "IN,JJ,NNS", "IN,DT,NNS", "TO,VB,DT", "DT,NN,NN", "NNP,NNP,CC", "IN,JJ,NN", "NNP,CC,NNP", "NNP,POS,NN", "NN,IN,JJ" ]
var fields = []
var articles = []



const createJSON = (file, cb) => {
  var articleTrigramsFile = JSON.parse(fs.readFileSync(path + file, 'utf8'))
  var articlePosTrigrams = articleTrigramsFile.posTrigrams
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
  cb(null, 'Create JSON')
}

const printDataset = (cb) => {
  articles.sort(function(a, b) {
    return b.qualityClass - a.qualityClass
  })
  var csv = json2csv({ data: articles, fields: fields })
  fs.writeFile('../datasets/posCharTrigramsDataset.csv', csv, function(err) {
    if (err) throw err;
    console.log('Char trigrams dataset Saved!')
    cb()
  })
}

fs.readdir(path, (err, files) => {
  if (err) console.log(err);
  else {

    fields = _.union(charTrigrams, posTrigrams, ["qualityClass"])

    async.eachSeries(
      files,
      createJSON,
      (err, result) => {
        if (err) {
          console.log(err);
        }
        else {
          printDataset(() => {
            console.log(fields.length - 1);
            console.log('Trigrams analysis: DONE')
            process.exit()
          })

        }
    })
  }
})
