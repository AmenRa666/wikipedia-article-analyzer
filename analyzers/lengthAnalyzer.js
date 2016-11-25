// MODULES
const nlp = require('nlp_compromise')
nlp.plugin(require('nlp-syllables'))
const async = require('async')


// LOGIC
let lengthFeatures = {
  characterCount: 0,
  wordCount: 0,
  syllableCount: 0,
  sentenceCount: 0
}

let words = []
let sentences = []

const countCharacters = (cb) => {
  let characterCount = 0
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
  let syllableCount = 0
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
  lengthFeatures.characterCount = 0
  lengthFeatures.wordCount = 0
  lengthFeatures.syllableCount = 0
  lengthFeatures.sentenceCount = 0

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
