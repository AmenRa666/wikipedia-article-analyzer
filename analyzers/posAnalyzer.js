// MODULES
const _ = require('underscore')
const async = require('async')


// LOGIC
const posTrigramTags = [
  "NNP,NNP,NNP",
  "VBD,DT,JJ",
  "IN,DT,NNP",
  "NNP,IN,DT",
  "DT,NNP,NNP",
  "JJ,NN,IN",
  "NN,IN,DT",
  "IN,DT,NN",
  "NN,IN,NNP",
  "IN,NNP,NNP",
  "NNP,VBD,DT",
  "VBD,DT,NN",
  "DT,NN,IN",
  "VBD,VBN,IN",
  "NNP,NNP,VBD",
  "IN,NN,IN",
  "NNP,NNP,IN",
  "NNP,IN,NNP",
  "VBD,IN,DT",
  "IN,DT,JJ",
  "JJ,NNS,IN",
  "DT,JJ,NN",
  "IN,DT,NNS",
  "IN,CD,NNP",
  "VBN,IN,DT",
  "DT,NN,NN",
  "IN,PRP$,NN",
  "NNP,VBD,VBN",
  "NNP,CC,NNP",
  "NNS,IN,DT",
  "NN,IN,NN",
  "DT,NN,VBD",
  "NN,VBD,VBN",
  "TO,VB,DT",
  "NNP,POS,NN"
]

// POS Trigram example: 'DT,NN,CC': 3 (the number indicates the repetition of the trigram in the article's text)
const getPosTrigrams = (sentencesTags, cb) => {
  let posTrigrams = {
    "NNP,NNP,NNP": 0,
    "VBD,DT,JJ": 0,
    "IN,DT,NNP": 0,
    "NNP,IN,DT": 0,
    "DT,NNP,NNP": 0,
    "JJ,NN,IN": 0,
    "NN,IN,DT": 0,
    "IN,DT,NN": 0,
    "NN,IN,NNP": 0,
    "IN,NNP,NNP": 0,
    "NNP,VBD,DT": 0,
    "VBD,DT,NN": 0,
    "DT,NN,IN": 0,
    "VBD,VBN,IN": 0,
    "NNP,NNP,VBD": 0,
    "IN,NN,IN": 0,
    "NNP,NNP,IN": 0,
    "NNP,IN,NNP": 0,
    "VBD,IN,DT": 0,
    "IN,DT,JJ": 0,
    "JJ,NNS,IN": 0,
    "DT,JJ,NN": 0,
    "IN,DT,NNS": 0,
    "IN,CD,NNP": 0,
    "VBN,IN,DT": 0,
    "DT,NN,NN": 0,
    "IN,PRP$,NN": 0,
    "NNP,VBD,VBN": 0,
    "NNP,CC,NNP": 0,
    "NNS,IN,DT": 0,
    "NN,IN,NN": 0,
    "DT,NN,VBD": 0,
    "NN,VBD,VBN": 0,
    "TO,VB,DT": 0,
    "NNP,POS,NN": 0
  }

  sentencesTags.forEach((sentenceTags) => {
    for (let i = 0; i <= sentenceTags.length-3; i++) {
      if (sentenceTags.slice(i, i + 3) in posTrigrams) {
        posTrigrams[sentenceTags.slice(i, i + 3)]++
      }
    }
  })

  cb(posTrigrams)
}

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


// EXPORTS
module.exports.getPosTrigrams = getPosTrigrams
module.exports.getAllPosTrigrams = getAllPosTrigrams
