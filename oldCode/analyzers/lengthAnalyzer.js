// MODULES

var syllable = require('syllable')


// LOGIC

// Count characters (space are counted)
const countCharacters = (text) => {
  var characterCount = text.length
  return characterCount
}

// Count syllables
const countSyllables = (text) => {
  var syllableCount = syllable(text)
  return syllableCount
}

// Count words
const countWords = (text) => {
  text = text.replace(/\n/g, ' ')
  // Remove all non-letter/digit symbols and saxon genitive
  var cleanText = text.replace(/\W|'s/g,"")
  var wordCount = cleanText.split(' ').length
  return wordCount
}

// Count sentences
const countSentences = (text) => {
  text = text.replace(/\n/g, ' ')
  var sentenceCount = text.split('. ').length
  return sentenceCount
}

// Call to all the function above
const analyze = (text, callback) => {
  var lengthFeatureScores = {
    characters: countCharacters(text),
    syllables: countSyllables(text),
    words: countWords(text),
    sentences: countSentences(text)
  }
  callback(lengthFeatureScores)
}

module.exports.countCharacters = countCharacters
module.exports.countSyllables = countSyllables
module.exports.countWords = countWords
module.exports.countSentences = countSentences
module.exports.analyze = analyze
