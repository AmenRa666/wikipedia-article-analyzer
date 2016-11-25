// MODULES
const nlp = require('nlp_compromise')
nlp.plugin(require('nlp-syllables'))
const math = require('mathjs')
const async = require('async')


// Readability Modules
const automatedReadability = require('automated-readability')
const colemanLiau = require('coleman-liau')
const flesch = require('flesch')
const fleschKincaid = require('flesch-kincaid')
const gunningFog = require('gunning-fog')
const smogFormula = require('smog-formula')
const daleChallFormula = require('dale-chall-formula')
const daleChall = require('dale-chall')


// LOGIC
let readabilityFeatures = {
  automatedReadabilityIndex: 0,
  colemanLiauIndex: 0,
  fleshReadingEase: 0,
  fleschKincaidGradeLevel: 0,
  gunningFogIndex: 0,
  lasbarhetsIndex: 0,
  smogGrading: 0,
  // linsearWriteFormula: 0,
  daleChallReadabilityFormula: 0
}

// Complex words count
let complexWordCount = 0
// Dale-Chall complex word count
let daleChallComplexWordCount = 0
// Long words count
let longWordCount = 0

let characterCount = 0
let wordCount = 0
let sentenceCount = 0
let syllableCount = 0
let words = []
let text = ''
let periodCount = 0

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
  cb(null, 'Automated Readability Index')
}

// Coleman-Liau Index
const getColemanLiauIndex = (cb) => {
  readabilityFeatures.colemanLiauIndex = colemanLiau({
    sentence: sentenceCount,
    word: wordCount,
    letter: characterCount
  })
  cb(null, 'Coleman Liau Index')
}

// Flesch Reading Ease
const getFleshReadingEase = (cb) => {
  let fleshReadingEase = flesch({
    sentence: sentenceCount,
    word: wordCount,
    syllable: syllableCount
  })
  if (fleshReadingEase > 0) {
    readabilityFeatures.fleshReadingEase = fleshReadingEase
  }
  else {
    readabilityFeatures.fleshReadingEase = 0
  }

  cb(null, 'Flesh Reading Ease')
}

// Flesch-Kincaid Grade Level
const getFleschKincaidGradeLevel = (cb) => {
  readabilityFeatures.fleschKincaidGradeLevel = fleschKincaid({
    sentence: sentenceCount,
    word: wordCount,
    syllable: syllableCount
  })
  cb(null, 'Flesh Kincaid Grade Level')
}

// Gunning Fog Index
const getGunningFogIndex = (cb) => {
  readabilityFeatures.gunningFogIndex = gunningFog({
    sentence: sentenceCount,
    word: wordCount,
    complexPolysillabicWord: complexWordCount
  })
  cb(null, 'Gunning Fog Index')
}

// Läsbarhets Index
const getLasbarhetsIndex = (cb) => {
  readabilityFeatures.lasbarhetsIndex = (wordCount/periodCount) + (longWordCount*100/wordCount)
  cb(null, 'Lasbarhets Index')
}

// SMOG Grade
const getSmogGrading = (cb) => {
  readabilityFeatures.smogGrading = smogFormula({
    sentence: sentenceCount,
    polysillabicWord: complexWordCount
  })
  cb(null, 'SMOG Grading')
}

// Linsear Write Formula
const getLinsearWriteFormula = (cb) => {
  let lwfSimpleWordCount = 0
  let lwfComplexWordCount = 0

  for (let i = 0; i < 99; i++) {
    let word = words[Math.floor(Math.random()*words.length)]
    if (nlp.term(word).syllables().length >= 3) {
      lwfComplexWordCount++
    }
    else {
      lwfSimpleWordCount++
    }
  }

  let lwf = (lwfSimpleWordCount + 3*lwfComplexWordCount)/sentenceCount
  if (lwf > 20) {
    lwf = lwf/2
  }
  else {
    lwf = (lwf-2)/2
  }
  readabilityFeatures.linsearWriteFormula = lwf
  cb(null, 'Linsear Write Formula')
}

// Dale-Chall
const getDaleChallReadabilityFormula = (cb) => {
  readabilityFeatures.daleChallReadabilityFormula = daleChallFormula({
    word: wordCount,
    sentence: sentenceCount,
    difficultWord: daleChallComplexWordCount
  })
  cb(null, 'Dale-Chall Readability Formula')
}

const analyze = (_characterCount, _wordCount, _sentenceCount, _syllableCount, _words, _text, cb) => {
  characterCount = _characterCount
  wordCount = _wordCount
  sentenceCount = _sentenceCount
  syllableCount = _syllableCount
  words = _words
  text = _text

  readabilityFeatures.automatedReadabilityIndex = 0
  readabilityFeatures.colemanLiauIndex = 0
  readabilityFeatures.fleshReadingEase = 0
  readabilityFeatures.fleschKincaidGradeLevel = 0
  readabilityFeatures.gunningFogIndex = 0
  readabilityFeatures.lasbarhetsIndex = 0
  readabilityFeatures.smogGrading = 0
  readabilityFeatures.daleChallReadabilityFormula = 0

  complexWordCount = 0
  daleChallComplexWordCount = 0
  longWordCount = 0
  periodCount = 0

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
        // getLinsearWriteFormula,
        getDaleChallReadabilityFormula
      ], cb )
    }
  ], (err, result) => {
    cb(readabilityFeatures)
  }
  )
}

// EXPORTS
module.exports.analyze = analyze
