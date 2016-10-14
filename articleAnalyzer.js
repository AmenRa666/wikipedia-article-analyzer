// MODULES
var async = require('async')
// POS Tagger
var posTagger = require('./posTagger.js')
// Analizers
var posAnalyzer = require('./analyzers/posAnalyzer.js')
var trigramAnalyzer = require('./analyzers/trigramAnalyzer.js')
var readabilityAnalyzer = require('./analyzers/readabilityAnalyzer.js')
var lengthAnalyzer = require('./analyzers/lengthAnalyzer.js')
var structureAnalyzer = require('./analyzers/structureAnalyzer.js')
var lexicalAnalyzer = require('./analyzers/lexicalAnalyzer.js')
var styleAnalyzer = require('./analyzers/styleAnalyzer.js')


// LOGIC
var pos = []
var words = []

var articleJSON = {
  id: '',
  title: '',
  abstract: '',
  text: '',
  textFromXML: '',
  plainText: '',
  onlyLettersAndNumbersText: '',
  words: [],
  sections: [],
  subsectionIndexes: [],
  sentences: [],
  features: {
    lengthFeatures: {},
    structureFeatures : {},
    styleFeatures: {},
    readabilityFeatures: {}
  }
}

const getLengthFeatures = (cb) => {
  lengthAnalyzer.analyze(
    articleJSON.words,
    articleJSON.sentences,
    (lengthFeatures) => {
      articleJSON.features.lengthFeatures = lengthFeatures
      cb(null, 'Get Length Features')
    }
  )
}

const getTags = (cb) => {
  posTagger.tag(articleJSON.plainText, (_pos) => {
    pos = _pos
    cb(null, 'Get POS')
  })
}

const getStructureFeatures = (cb) => {
  structureAnalyzer.analyze(
    articleJSON.sections,
    articleJSON.subsectionIndexes,
    articleJSON.features.lengthFeatures.characterCount,
    articleJSON.features.lengthFeatures.wordCount,
    articleJSON.features.lengthFeatures.sentenceCount,
    articleJSON.textFromXML,
    (structureFeatures) => {
      articleJSON.features.structureFeatures = structureFeatures
      cb(null, 'Get Structure Features')
    }
  )
}

const getReadabilityIndexes = (cb) => {
  readabilityAnalyzer.analyze(
    articleJSON.features.lengthFeatures.characterCount,
    articleJSON.features.lengthFeatures.wordCount,
    articleJSON.features.lengthFeatures.sentenceCount,
    articleJSON.features.lengthFeatures.syllableCount,
    articleJSON.words,
    articleJSON.text,
    (readabilityFeatures) => {
      articleJSON.features.readabilityFeatures = readabilityFeatures
      cb(null, 'Get Readability Indexes Features')
    }
  )
}

const getLexicalFeatures = (cb) => {
  lexicalAnalyzer.analyze(
    pos,
    articleJSON.words,
    articleJSON.features.lengthFeatures.characterCount,
    articleJSON.features.lengthFeatures.wordCount,
    articleJSON.features.lengthFeatures.syllableCount,
    articleJSON.features.lengthFeatures.sentenceCount,
    (lexicalFeatures) => {
      articleJSON.features.lexicalFeatures = lexicalFeatures
      cb(null, 'Get Lexical Features')
    }
  )
}

const getStyleFeatures = (cb) => {
  styleAnalyzer.analyze(
    pos,
    articleJSON.words,
    articleJSON.sentences,
    articleJSON.features.lengthFeatures.wordCount,
    articleJSON.features.lengthFeatures.sentenceCount,
    (styleFeatures) => {
      articleJSON.features.styleFeatures = styleFeatures
      cb(null, 'Get Style Features')
    }
  )
}

const analyze = (articleTextFromXML, id, title, textWithSectionTitles, subsectionIndexes, abstract, sections, text, sentences, onlyLettersAndNumbersText, words, cb) => {

  articleJSON.textFromXML = articleTextFromXML
  articleJSON.id = id
  articleJSON.title = title
  articleJSON.text = textWithSectionTitles
  articleJSON.subsectionIndexes = subsectionIndexes
  articleJSON.abstract = abstract
  articleJSON.sections = sections
  articleJSON.plainText = text
  articleJSON.sentences = sentences
  articleJSON.onlyLettersAndNumbersText = onlyLettersAndNumbersText
  articleJSON.words = words

  async.series([
    getLengthFeatures,
    getTags,
    getStructureFeatures,
    getReadabilityIndexes,
    getLexicalFeatures,
    getStyleFeatures,
  ], (res, result) => {
    cb(articleJSON)
  })
}


// EXPORTS
module.exports.analyze = analyze

// articleTextFromXML
// id
// title
// textWithSectionTitles --> text
// subsectionIndexes
// abstract
// sections
// text --> plainText
// sentences
// onlyLettersAndNumbersText
// words
