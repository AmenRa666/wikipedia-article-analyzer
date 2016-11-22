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
var revisionAnalyzer = require('./analyzers/revisionAnalyzer.js')


// LOGIC
var pos = []
var words = []
var sentencesTags = []

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
    readabilityFeatures: {},
    posTrigrams: {},
    charTrigrams: {},
    reviewFeatures: {}
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
  posTagger.tag(articleJSON.sentences, (_pos, _sentencesTags) => {
    pos = _pos
    sentencesTags = _sentencesTags
    cb(null, 'Get POS')
  })
}

// const getTags = (cb) => {
//   posTagger.tag(articleJSON.plainText, (_pos) => {
//     pos = _pos
//     cb(null, 'Get POS')
//   })
// }

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
    sentencesTags,
    (styleFeatures) => {
      articleJSON.features.styleFeatures = styleFeatures
      cb(null, 'Get Style Features')
    }
  )
}

const getPosTrigrams = (cb) => {
  posAnalyzer.getPosTrigrams(sentencesTags, (posTrigrams) => {
    articleJSON.features.posTrigrams = posTrigrams
    cb(null, 'Get POS Trigrams')
  })
}

const getCharTrigrams = (cb) => {
  trigramAnalyzer.getCharTrigrams(articleJSON.plainText, (charTrigrams) => {
    articleJSON.features.charTrigrams = charTrigrams
    cb(null, 'Get Trigrams')
  })
}

const getReviewFeatures = (cb) => {
  revisionAnalyzer.getReviewFeatures(articleJSON.title, (reviewFeatures) => {
    articleJSON.features.reviewFeatures = reviewFeatures
    cb(null, 'Get Review Features')
  })
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

  var pos = []
  var words = []
  var sentencesTags = []

  articleJSON.features.lengthFeatures = {}
  articleJSON.features.structureFeatures = {}
  articleJSON.features.styleFeatures = {}
  articleJSON.features.readabilityFeatures = {}
  articleJSON.features.posTrigrams = {}
  articleJSON.features.charTrigrams = {}
  articleJSON.features.reviewFeatures = {}

  // async.series([
  //   getLengthFeatures,
  //   getStructureFeatures,
  //   getReadabilityIndexes,
  //   getTags,
  //   getPosTrigrams,
  //   getCharTrigrams,
  //   getLexicalFeatures,
  //   getStyleFeatures
  // ], (res, result) => {
  //   cb(articleJSON)
  // })

  async.parallel([
    getReviewFeatures,
    (cb) => {
      async.series([
        (cb) => {
          async.parallel([
            (cb) => {
              async.series([
                getLengthFeatures,
                (cb) => {
                  async.parallel([
                    getStructureFeatures,
                    getReadabilityIndexes
                  ], cb)
                },
              ], cb)
            },
            (cb) => {
              async.series([
                getTags,
                getPosTrigrams
              ], cb)
            },
            getCharTrigrams
          ], cb)
        },
        getLexicalFeatures,
        getStyleFeatures
      ], cb)
    }
  ], (err, res) => {
    if (err) throw err
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
