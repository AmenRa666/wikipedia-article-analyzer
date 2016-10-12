// MODULES
var async = require('async')
var nlp = require('nlp_compromise')


// LOGIC
var styleFeatures = {
  meanSentenceSize: 0,
  largestSentenceSize: 0,
  shortestSentenceSize: 0,
  largeSentenceRate: 0,
  shortSentenceCount: 0
  questionCount: 0,
  questionRatio: 0,
  exclamationCount: 0,
  exclamationRatio: 0
}


var sentences = []
var wordCount = 0,
var sentenceCount = 0

const getMeanSentenceSize = (cb) => {
  styleFeatures.meanSentenceSize = wordCount/sentenceCount
  cb(null, 'Get Mean Sentence Size')
}

const getLargestSentenceSize = (cb) => {
  var largestSentenceSize = 0
  sentences.forEach((sentence) => {
    // Expand contractions (i'll -> i will)
    var expandedSentence = sentence.contractions.expand().text()
    var sentenceLengthInWords = expandedSentence.split(' ').length
    if (sentenceLengthInWords > largestSentenceSize) {
      largestSentenceSize = sentenceLengthInWords
    }
    styleFeatures.largestSentenceSize = largestSentenceSize
  cb(null, 'Get Largest Sentence Size')
}

const getShortestSentenceSize = (cb) => {
  var shortestSentenceSize = 0
  sentences.forEach((sentence) => {
    // Expand contractions (i'll -> i will)
    var expandedSentence = sentence.contractions.expand().text()
    var sentenceLengthInWords = expandedSentence.split(' ').length
    if (sentenceLengthInWords < shortestSentenceSize) {
      shortestSentenceSize = sentenceLengthInWords
    }
    styleFeatures.shortestSentenceSize = shortestSentenceSize
  cb(null, 'Get Shortest Sentence Size')
}

const getLargeSentenceRate = (cb) => {
  var largeSentenceCount = 0
  sentences.forEach((sentence) => {
    // Expand contractions (i'll -> i will)
    var expandedSentence = nlp.text(sentence.str.toLowerCase()).contractions.expand().text()
    var sentenceLengthInWords = expandedSentence.split(' ').length
    if (sentenceLengthInWords > styleFeatures.meanSentenceSize + 10) {
      largeSentenceCount++
    }
  })
  styleFeatures.largeSentenceRate = largeSentenceCount/sentenceCount
  cb(null, 'Get Large Sentence Rate')
}

const getShortSentenceRate = (cb) => {
  var shortSentenceCount = 0
  sentences.forEach((sentence) => {
    // Expand contractions (i'll -> i will)
    var expandedSentence = nlp.text(sentence.str.toLowerCase()).contractions.expand().text()
    var sentenceLengthInWords = expandedSentence.split(' ').length
    if (sentenceLengthInWords < styleFeatures.meanSentenceSize - 5) {
      shortSentenceCount++
    }
  })
  styleFeatures.shortSentenceRate = shortSentenceCount/sentenceCount
  cb(null, 'Get Large Sentence Rate')
}

const countQuestions = (cb) => {
  var questionCount = 0
  sentences.forEach((sentence) => {
    if (sentence.sentence_type() == 'interrogative') {
      questionCount++
    }
  })
  styleFeatures.questionCount = questionCount
  cb(null, 'Count Questions')
}

const getQuestionRatio = (cb) => {
  styleFeatures.questionRatio = styleFeatures.questionCount/sentenceCount
  cb(null, 'Get Question Ratio')
}

const countExclamations = (cb) => {
  var exclamationCount = 0
  sentences.forEach((sentence) => {
    if (sentence.sentence_type() == 'exclamative') {
      exclamationCount++
    }
  })
  styleFeatures.exclamationCount = exclamationCount
  cb(null, 'Count Exclamations')
}

const getExclamationRatio = (cb) => {
  styleFeatures.exclamationRatio = styleFeatures.exclamationCount/sentenceCount
  cb(null, 'Get Exclamation Ratio')
}

const analyze = (_sentences, _wordCount, _sentenceCount, cb) => {

}

// EXPORTS
module.exports.analyze = analyze

//////////////////////////////////////////////////////////////////////////////

Array.prototype.min = function() {
  return Math.min.apply(null, this)
}

Array.prototype.max = function() {
  return Math.max.apply(null, this)
}
