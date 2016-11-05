// MODULES
var _ = require('underscore')
var async = require('async')


// LOGIC
// POS Trigram example: 'DT,NN,CC': 3 (the number indicates the repetition of the trigram in the article's text)
const getPosTrigrams = (sentencesTags, cb) => {
  var posTrigrams = {}
  sentencesTags.forEach((sentenceTags) => {
    for (let i = 0; i < sentenceTags.length; i += 3) {
      trigram = {
        posTrigram: sentenceTags.slice(i, i + 3)
      }
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

  // var wordTags = _.pluck(taggedWords, 'tag')
  // var posTrigrams = {}
  //
  //
  // for (var i = 0; i < wordTags.length; i += 3) {
  //   trigram = {
  //     posTrigram: wordTags.slice(i, i + 3)
  //   }
  //   if (wordTags.slice(i, i + 3).length == 3) {
  //     if (wordTags.slice(i, i + 3) in posTrigrams) {
  //       posTrigrams[wordTags.slice(i, i + 3)]++
  //     }
  //     else {
  //       posTrigrams[wordTags.slice(i, i + 3)] = 1
  //     }
  //   }
  // }

  cb(posTrigrams)
}


// EXPORTS
module.exports.getPosTrigrams = getPosTrigrams
