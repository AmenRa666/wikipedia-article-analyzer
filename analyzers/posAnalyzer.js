// MODULES
const _ = require('underscore')
const async = require('async')


// LOGIC
const posTrigramTags = [
  "DT,NNP,NNP",
  "NNP,NNP,NNP",
  "DT,NN,IN",
  "NN,IN,DT",
  "IN,DT,NNP",
  "NNP,NNP,IN",
  "NNP,IN,NNP",
  "NNP,IN,DT",
  "IN,DT,NN",
  "DT,NN,VBD",
  "NNS,IN,DT",
  "NNP,NNP,VBD",
  "JJ,NN,IN",
  "IN,DT,JJ",
  "DT,JJ,NN",
  "NN,IN,NNP",
  "IN,NNP,NNP",
  "VBD,DT,NN",
  "VBD,VBN,IN",
  "VBN,IN,DT",
  "NN,IN,NN",
  "IN,NN,IN",
  "JJ,NNS,IN",
  "NN,CC,NN",
  "IN,JJ,NNS",
  "IN,DT,NNS",
  "TO,VB,DT",
  "DT,NN,NN",
  "NNP,NNP,CC",
  "IN,JJ,NN",
  "NNP,CC,NNP",
  "NNP,POS,NN",
  "NN,IN,JJ"
]

// POS Trigram example: 'DT,NN,CC': 3 (the number indicates the repetition of the trigram in the article's text)
const getPosTrigrams = (sentencesTags, cb) => {
  let posTrigrams = {
      "DT,NNP,NNP": 0,
      "NNP,NNP,NNP": 0,
      "DT,NN,IN": 0,
      "NN,IN,DT": 0,
      "IN,DT,NNP": 0,
      "NNP,NNP,IN": 0,
      "NNP,IN,NNP": 0,
      "NNP,IN,DT": 0,
      "IN,DT,NN": 0,
      "DT,NN,VBD": 0,
      "NNS,IN,DT": 0,
      "NNP,NNP,VBD": 0,
      "JJ,NN,IN": 0,
      "IN,DT,JJ": 0,
      "DT,JJ,NN": 0,
      "NN,IN,NNP": 0,
      "IN,NNP,NNP": 0,
      "VBD,DT,NN": 0,
      "VBD,VBN,IN": 0,
      "VBN,IN,DT": 0,
      "NN,IN,NN": 0,
      "IN,NN,IN": 0,
      "JJ,NNS,IN": 0,
      "NN,CC,NN": 0,
      "IN,JJ,NNS": 0,
      "IN,DT,NNS": 0,
      "TO,VB,DT": 0,
      "DT,NN,NN": 0,
      "NNP,NNP,CC": 0,
      "IN,JJ,NN": 0,
      "NNP,CC,NNP": 0,
      "NNP,POS,NN": 0,
      "NN,IN,JJ": 0
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
