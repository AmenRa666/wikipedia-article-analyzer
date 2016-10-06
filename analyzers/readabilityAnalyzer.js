// MODULES
var nlp = require('nlp_compromise')
nlp.plugin(require('nlp-syllables'))
var math = require('mathjs')
var async = require('async')


// Readability Modules
var automatedReadability = require('automated-readability')
var colemanLiau = require('coleman-liau')
var flesch = require('flesch')
var fleschKincaid = require('flesch-kincaid')
var gunningFog = require('gunning-fog')
var smogFormula = require('smog-formula')
var daleChallFormula = require('dale-chall-formula')
var daleChall = require('dale-chall')


// LOGIC

var readabilityFeatures = {
  automatedReadabilityIndex: 0,
  colemanLiauIndex: 0,
  fleshReadingEase: 0,
  fleschKincaidGradeLevel: 0,
  gunningFogIndex: 0,
  lasbarhetsIndex: 0,
  smogGrading: 0,
  linsearWriteFormula: 0,
  daleChallReadabilityFormula: 0
}

// Complex words count
var complexWordCount = 0
// Dale-Chall complex word count
var daleChallComplexWordCount = 0
// Long words count
var longWordCount = 0

var characterCount = 0
var wordCount = 0
var sentenceCount = 0
var syllableCount = 0
var words = []
var text = ''
var periodCount = 0

const preprocess = (cb) => {
  words.forEach((word) => {
    if (nlp.term(word).syllables().length >= 3) {
      complexWordCount++
    }
    if (daleChall.indexOf(word.toLowerCase()) == -1) {
      daleChallComplexWordCount++
    }
    if (word.length > 6) {
      longWordCount++
    }
  })
  periodCount = sentenceCount + (text.match(/:/g) || []).length
  cb(null, 'preprocess')
}

// Automated Readability Index
const getAutomatedReadabilityIndex = (cb) => {
  readabilityFeatures.automatedReadabilityIndex = automatedReadability({
    sentence: sentenceCount,
    word: wordCount,
    character: characterCount
  })
}

// Coleman-Liau Index
const getColemanLiauIndex = (cb) => {
  readabilityFeatures.colemanLiauIndex = colemanLiau({
    sentence: sentenceCount,
    word: wordCount,
    letter: characterCount
  })
}

// Flesch Reading Ease
const getFleshReadingEase = (cb) => {
  readabilityFeatures.fleshReadingEase = flesch({
    sentence: sentenceCount,
    word: wordCount,
    syllable: syllableCount
  })
}

// Flesch-Kincaid Grade Level
const getFleschKincaidGradeLevel = (cb) => {
  readabilityFeatures.fleschKincaidGradeLevel = fleschKincaid({
    sentence: sentenceCount,
    word: wordCount,
    syllable: syllableCount
  })
}

// Gunning Fog Index
const getGunningFogIndex = (cb) => {
  readabilityFeatures.gunningFogIndex = gunningFog({
    sentence: sentenceCount,
    word: wordCount,
    complexPolysillabicWord: complexWordCount
  })
}

// Läsbarhets Index
const getLasbarhetsIndex = (cb) => {
  readabilityFeatures.lasbarhetsIndex = (wordCount/periodCount) + (longWordCount*100/wordCount)
}

// SMOG Grade
const getSmogGrading = (cb) => {
  readabilityFeatures.smogGrading = smogFormula({
    sentence: sentenceCount,
    polysillabicWord: complexWordCount
  })
}

// Linsear Write Formula
const getLinsearWriteFormula = (cb) => {
  var lwf = 0
  var lwfSimpleWordCount = 0
  var lwfComplexWordCount = 0

  for (var i = 0; i < 99; i++) {
    var word = words[Math.floor(Math.random()*words.length)]
    if (nlp.term(word).syllables().length >= 3) {
      lwfComplexWordCount++
    }
    else {
      lwfSimpleWordCount++
    }
  }

  var lwf = (lwfSimpleWordCount + 3*lwfComplexWordCount)/sentenceCount
  if (lwf > 20) {
    lwf = lwf/2
  }
  else {
    lwf = (lwf-2)/2
  }
  readabilityFeatures.linsearWriteFormula = lwf
}

// Dale-Chall
const getDaleChallReadabilityFormula = (cb) => {
  readabilityFeatures.daleChallReadabilityFormula = daleChallFormula({
    word: wordCount,
    sentence: sentenceCount,
    difficultWord: daleChallComplexWordCount
  })
}

const analyze = (characterCount, wordCount, sentenceCount, syllableCount, words, text, cb) => {
  characterCount = characterCount
  wordCount = wordCount
  sentenceCount = sentenceCount
  syllableCount = syllableCount
  words = words
  text = text

  async.series([
    preprocess,
    (cb) => {
      async.parallel([
        getAutomatedReadabilityIndex,
        getColemanLiauIndex,
        getFleshReadingEase,
        getFleschKincaidGradeLevel,
        getGunningFogIndex,
        getLasbarhetsIndex,
        getSmogGrading,
        getLinsearWriteFormula,
        getDaleChallReadabilityFormula
      ], cb )
    }
  ],
  (err, result) => {
    cb(readabilityFeatures)
  }
  )

}

// EXPORTS
module.exports.analyze = analyze
