// MODULES
var nlp = require('nlp_compromise')
nlp.plugin(require('nlp-syllables'))
var async = require('async')


// LOGIC
var lengthFeatures = {
  characterCount: 0,
  wordCount: 0,
  syllableCount: 0,
  sentenceCount: 0
}

var words = []
var sentences = []

const countCharacters = (cb) => {
  var characterCount = 0
  words.forEach((word) => {
    characterCount = characterCount + word.length
  })
  lengthFeatures.characterCount = characterCount
  cb(null, 'Count Characters')
}

const countWords = (cb) => {
  lengthFeatures.wordCount = words.length
  cb(null, 'Count Words')
}

const countSyllables = (cb) => {
  var syllableCount = 0
  words.forEach((word) => {
    syllableCount = syllableCount + nlp.term(word).syllables().length
  })
  lengthFeatures.syllableCount = syllableCount
  cb(null, 'Count Syllables')
}

const countSentences = (cb) => {
  lengthFeatures.sentenceCount = sentences.length
  cb(null, 'Count Sentences')
}


const analyze = (_words, _sentences, cb) => {
  words = _words
  sentences = _sentences
  async.parallel([
    countCharacters,
    countWords,
    countSyllables,
    countSentences
  ], (err, result) => {
    cb(lengthFeatures)
  }
  )
}

// EXPORTS
module.exports.analyze = analyze
