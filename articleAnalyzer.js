// MODULES
const async = require('async')
const time = require('node-tictoc')
// POS Tagger
const posTagger = require('./posTagger.js')
// Analizers
const posAnalyzer = require('./analyzers/posAnalyzer.js')
const trigramAnalyzer = require('./analyzers/trigramAnalyzer.js')
const readabilityAnalyzer = require('./analyzers/readabilityAnalyzer.js')
const lengthAnalyzer = require('./analyzers/lengthAnalyzer.js')
const structureAnalyzer = require('./analyzers/structureAnalyzer.js')
const lexicalAnalyzer = require('./analyzers/lexicalAnalyzer.js')
const styleAnalyzer = require('./analyzers/styleAnalyzer.js')
const revisionAnalyzer = require('./analyzers/revisionAnalyzer.js')


// LOGIC
let pos = []
let words = []
let sentencesTags = []

let articleJSON = {
  id: '',
  title: '',
  qualityClass: 0,
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
  revisionAnalyzer.getReviewFeatures(articleJSON.title, articleJSON.qualityClass, (reviewFeatures) => {
    articleJSON.features.reviewFeatures = reviewFeatures
    cb(null, 'Get Review Features')
  })
}

const analyze = (articleTextFromXML, id, title, textWithSectionTitles, subsectionIndexes, abstract, sections, text, sentences, onlyLettersAndNumbersText, words, qualityClass, cb) => {

  time.tic()

  articleJSON.qualityClass = qualityClass
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

  pos = []
  words = []
  sentencesTags = []

  articleJSON.features.lengthFeatures = {}
  articleJSON.features.structureFeatures = {}
  articleJSON.features.styleFeatures = {}
  articleJSON.features.readabilityFeatures = {}
  articleJSON.features.posTrigrams = {}
  articleJSON.features.charTrigrams = {}
  articleJSON.features.reviewFeatures = {}

  // async.series([
  //   getReviewFeatures,
  //   getLengthFeatures,
  //   getStructureFeatures,
  //   getReadabilityIndexes,
  //   getTags,
  //   getPosTrigrams,
  //   getCharTrigrams,
  //   getLexicalFeatures,
  //   getStyleFeatures,
  // ], (err, res) => {
  //   if (err) throw err
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
    time.toc()
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
