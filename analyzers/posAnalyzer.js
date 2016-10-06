// MODULES
var Tagger = require("node-stanford-postagger/postagger").Tagger
var _ = require('underscore')
var async = require('async')


// LOGIC

// Tagger
var tagger = new Tagger({
  port: "9000",
  host: "localhost"
});

// Object to return
var resultObj = {
  nouns: [],
  nounCount: 0,
  nounsRate: 0,
  differentNounCount: 0,
  differentNounsRate: 0,
  varbs: [],
  verbCount: 0,
  verbsRate: 0,
  differentVerbCount: 0,
  differentVerbsRate: 0,
  pronouns: [],
  pronounCount: 0,
  pronounsRate: 0,
  differentPronounCount: 0,
  differentPronounsRate: 0,
  adjectives: [],
  adjectiveCount: 0,
  adjectivesRate: 0,
  differentAdjectiveCount: 0,
  differentAdjectivesRate: 0,
  adverbs: [],
  adverbCount: 0,
  adverbsRate: 0,
  differentAdverbCount: 0,
  differentAdverbsRate: 0,
  posTrigrams: {}
}

var taggedWordsGLOBAL = []

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// TAGS /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// TAGS
// read at http://www.comp.leeds.ac.uk/amalgam/tagsets/upenn.html
// for en extensive explaination

var tags = [
  'CC', 'CD', 'DT', 'EX', 'FW', 'IN', 'JJ', 'JJR', 'JJS', 'LS', 'MD', 'NN', 'NNS', 'NNP', 'NNPS', 'PDT', 'POS', 'PRP', 'PRP$', 'RB', 'RBR', 'RBS', 'RP', 'SYM', 'TO', 'UH', 'VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ', 'WDT', 'WP', 'WP$', 'WRB',
]

// CC conjunction, coordinating
var coordinatingConjunctionTag = 'CC'
var coordinatingConjunctions = []

// CD numeral, cardinal
var cardinalNumberTag = 'CD'
var cardinalNumbers = []

// DT determiner
var determinerTag = 'DT'
var determiners = []

// EX existential there
var existentialThereTag = 'EX'
var existentialTheres = []

// FW foreign word
var foreignWordTag = 'FW'
var foreignWords = []

// IN preposition or conjunction, subordinating
var subordinatingPrepositionAndConjunctionCTag = 'IN'
var subordinatingPrepositionAndConjunctions = []

// JJ adjective or numeral, ordinal
var ordinalAdjectiveAndNumeralTag = 'JJ'
var ordinalAdjectivesAndNumerals = []

// JJR adjective, comparative
var comparativeAdjectiveTag = 'JJR'
var comparativeAdjectives = []

// JJS adjective, superlative
var superlativeAdjectiveTag = 'JJS'
var superlativeAdjectives = []

// LS list item marker
var listItemMarkerTag = 'LS'
var listItemMarkers = []

// MD modal auxiliary
var modalAuxiliaryTag = 'MD'
var modalAuxiliaries = []

// NN noun, common, singular or mass
var singolarCommonNounAndMassTag = 'NN'
var singolarCommonNounsAndMasses = []

// NNS noun, common, plural
var pluralCommonNounTag = 'NNS'
var pluralCommonNouns = []

// NNP noun, proper, singular
var singularProperNounTag = 'NNP'
var singularProperNouns = []

// NNPS noun, proper, plural
var pluralProperNounTag = 'NNPS'
var pluralProperNouns = []

// PDT pre-determiner
var preDeterminerTag = 'PDT'
var preDeterminers = []

// POS genitive marker
var genitiveMarkerTag = 'POS'
var genitiveMarkers = []

// PRP pronoun, personal
var personalPronounTag = 'PRP'
var personalPronouns = []

// PRP$ pronoun, possessive
var possessivePronounTag = 'PRP$'
var possessivePronouns = []

// RB adverb
var adverbTag = 'RB'
var adverbs = []

// RBR adverb, comparative
var comparativeAdverbTag = 'RBR'
var comparativeAdverbs = []

// RBS adverb, superlative
var superlativeAdverbTag = 'RBS'
var superlativeAdverbs = []

// RP particle
var particleTag = 'RP'
var particles = []

// SYM symbol
var symbolTag = 'SYM'
var symbols = []

// TO "to" as preposition or infinitive marker
var toTag = 'TO'
var tos = []

// UH interjection
var interjectionTag = 'UH'
var interjections = []

// VB verb, base form
var baseFormVerbTag = 'VB'
var baseFormVerbs = []

// VBD verb, past tense
var pastTenseVerbTag = 'VBD'
var pastTenseVerbs = []

// VBG verb, present participle or gerund
var presentParticipleAndGerundVerbTag = 'VBG'
var presentParticipleAndGerundVerbs = []

// VBN verb, past participle
var pastParticipleVerbTag = 'VBN'
var pastParticipleVerbs = []

// VBP verb, present tense, not 3rd person singular
var  notThirdPersonSingularPresentTenseVerbTag = 'VBP'
var  notThirdPersonSingularPresentTenseVerbs = []

// VBZ verb, present tense, 3rd person singular
var thirdPersonSingularPresentTenseVerbTag = 'VBZ'
var thirdPersonSingularPresentTenseVerbs = []

// WDT WH-determiner
var whDeterminerTag = 'WDT'
var whDeterminers = []

// WP WH-pronoun
var whPronounTag = 'WP'
var whPronouns = []

// WP$ WH-pronoun, possessive
var possessiveWHPronounTag = 'WP$'
var possessiveWHPronouns = []

// WRB Wh-adverb
var whAdverbTag = 'WRB'
var whAdverbs = []

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const tag = (text, cb) => {
  tagger.tag(text, function(err, resp) {
    if (err) return console.error(err)

    resp = resp.join(' ')
    var taggedWords = resp.split(' ')
    var _taggedWords = []
    taggedWords.forEach((taggedWord) => {
      // Array with two element, word and tag
      taggedWord = taggedWord.split('_')
      // If the tag is not in the 'tags' array the element will be discarded
      if (_.indexOf(tags, taggedWord[1]) != -1) {
        taggedWord = {
          word: taggedWord[0],
          tag: taggedWord[1]
        }
        _taggedWords.push(taggedWord)
      }
    })

    taggedWordsGLOBAL = _taggedWords

    var taggedWordsGroupedByTag = _.groupBy(_taggedWords, 'tag')

    coordinatingConjunctions = _.pluck(taggedWordsGroupedByTag[coordinatingConjunctionTag], 'word') || []
    cardinalNumbers = _.pluck(taggedWordsGroupedByTag[cardinalNumberTag], 'word') || []
    determiners = _.pluck(taggedWordsGroupedByTag[determinerTag], 'word') || []
    existentialTheres = _.pluck(taggedWordsGroupedByTag[existentialThereTag], 'word') || []
    foreignWords = _.pluck(taggedWordsGroupedByTag[foreignWordTag], 'word') || []
    subordinatingPrepositionAndConjunctions = _.pluck(taggedWordsGroupedByTag[subordinatingPrepositionAndConjunctionCTag], 'word') || []
    ordinalAdjectivesAndNumerals = _.pluck(taggedWordsGroupedByTag[ordinalAdjectiveAndNumeralTag], 'word') || []
    comparativeAdjectives = _.pluck(taggedWordsGroupedByTag[superlativeAdjectiveTag], 'word') || []
    superlativeAdjectives = _.pluck(taggedWordsGroupedByTag[superlativeAdjectiveTag], 'word') || []
    listItemMarkers = _.pluck(taggedWordsGroupedByTag[listItemMarkerTag], 'word') || []
    modalAuxiliaries = _.pluck(taggedWordsGroupedByTag[modalAuxiliaryTag], 'word') || []
    singolarCommonNounsAndMasses = _.pluck(taggedWordsGroupedByTag[singolarCommonNounAndMassTag], 'word') || []
    pluralCommonNouns = _.pluck(taggedWordsGroupedByTag[pluralCommonNounTag], 'word') || []
    singularProperNouns = _.pluck(taggedWordsGroupedByTag[singularProperNounTag], 'word') || []
    pluralProperNouns = _.pluck(taggedWordsGroupedByTag[pluralProperNounTag], 'word') || []
    preDeterminers = _.pluck(taggedWordsGroupedByTag[preDeterminerTag], 'word') || []
    genitiveMarkers = _.pluck(taggedWordsGroupedByTag[genitiveMarkerTag], 'word') || []
    personalPronouns = _.pluck(taggedWordsGroupedByTag[personalPronounTag], 'word') || []
    possessivePronouns = _.pluck(taggedWordsGroupedByTag[possessivePronounTag], 'word') || []
    adverbs = _.pluck(taggedWordsGroupedByTag[adverbTag], 'word') || []
    comparativeAdverbs = _.pluck(taggedWordsGroupedByTag[comparativeAdverbTag], 'word') || []
    superlativeAdverbs = _.pluck(taggedWordsGroupedByTag[superlativeAdverbTag], 'word') || []
    particles = _.pluck(taggedWordsGroupedByTag[particleTag], 'word') || []
    symbols = _.pluck(taggedWordsGroupedByTag[symbolTag], 'word') || []
    tos = _.pluck(taggedWordsGroupedByTag[toTag], 'word') || []
    interjections = _.pluck(taggedWordsGroupedByTag[interjectionTag], 'word') || []
    baseFormVerbs = _.pluck(taggedWordsGroupedByTag[baseFormVerbTag], 'word') || []
    pastTenseVerbs = _.pluck(taggedWordsGroupedByTag[pastTenseVerbTag], 'word') || []
    presentParticipleAndGerundVerbs = _.pluck(taggedWordsGroupedByTag[presentParticipleAndGerundVerbTag], 'word') || []
    pastParticipleVerbs = _.pluck(taggedWordsGroupedByTag[pastParticipleVerbTag], 'word') || []
    notThirdPersonSingularPresentTenseVerbs = _.pluck(taggedWordsGroupedByTag[notThirdPersonSingularPresentTenseVerbTag], 'word') || []
    thirdPersonSingularPresentTenseVerbs = _.pluck(taggedWordsGroupedByTag[thirdPersonSingularPresentTenseVerbTag], 'word') || []
    whDeterminers = _.pluck(taggedWordsGroupedByTag[whDeterminerTag], 'word') || []
    whPronouns = _.pluck(taggedWordsGroupedByTag[whPronounTag], 'word') || []
    possessiveWHPronouns = _.pluck(taggedWordsGroupedByTag[possessiveWHPronounTag], 'word') || []
    whAdverbs = _.pluck(taggedWordsGroupedByTag[whAdverbTag], 'word') || []

    // All type of nouns together (no proper nouns)
    resultObj.nouns = singolarCommonNounsAndMasses.concat(pluralCommonNouns)

    // All type of verbs together
    resultObj.verbs = modalAuxiliaries.concat(pastTenseVerbs, presentParticipleAndGerundVerbs, pastParticipleVerbs, notThirdPersonSingularPresentTenseVerbs, thirdPersonSingularPresentTenseVerbs)

    // All type of pronouns together
    resultObj.pronouns = personalPronouns.concat(personalPronouns, existentialTheres, whPronouns, possessiveWHPronouns)

    // All type of adjectives together
    resultObj.adjectives = ordinalAdjectivesAndNumerals.concat(comparativeAdjectives, superlativeAdjectives)

    // All type of adverbs together
    resultObj.adverbs = adverbs.concat(comparativeAdverbs, superlativeAdverbs)

    cb(null, 'tag')
  })
}

const countNouns = (cb) => {
  resultObj.nounCount = resultObj.nouns.length
  var differentNouns = _.uniq(resultObj.nouns)
  resultObj.differentNounCount = differentNouns.length
  cb(null, 'countNouns')
}

const countVerbs = (cb) => {
  resultObj.verbCount = resultObj.verbs.length
  var differentVerbs = _.uniq(resultObj.verbs)
  resultObj.differentVerbsCount = differentVerbs.length
  cb(null, 'countVerbs')
}

const countPronouns = (cb) => {
  resultObj.pronounCount = resultObj.pronouns.length
  var differentPronouns = _.uniq(resultObj.pronouns)
  resultObj.differentPronounsCount = differentPronouns.length
  cb(null, 'countPronouns')
}

const countAdjectives = (cb) => {
  resultObj.adjectiveCount = resultObj.adjectives.length
  var differentAdjectives = _.uniq(resultObj.adjectives)
  resultObj.differentAdjectiveCount = differentAdjectives.length
  cb(null, 'countAdjectives')
}

const countAdverbs = (cb) => {
  resultObj.adverbCount = resultObj.adverbs.length
  var differentAdverbs = _.uniq(resultObj.adverbs)
  resultObj.differentAdverbCount = differentAdverbs.length
  cb(null, 'countAdverbs')
}

const getPosTrigrams = (cb) => {
  var wordTags = _.pluck(taggedWordsGLOBAL, 'tag')
  var posTrigrams = {}
  for (var i = 0; i < wordTags.length; i += 3) {
    trigram = {
      posTrigram: wordTags.slice(i, i + 3)
    }
    if (wordTags.slice(i, i + 3).length == 3) {
      if (wordTags.slice(i, i + 3) in posTrigrams) {
        posTrigrams[wordTags.slice(i, i + 3)]++
      }
      else {
        posTrigrams[wordTags.slice(i, i + 3)] = 1
      }
    }
  }

  resultObj.posTrigrams = posTrigrams

  // for (var property in posTrigrams) {
  //   // console.log(posTrigrams[property]);
  //   if (posTrigrams.hasOwnProperty(property)) {
  //       console.log(posTrigrams[property]);
  //   }
  // }

  cb(null, 'getPosTrigrams')
}

const analyze = (text, cb) => {
  async.series([
    async.apply(tag, text),
    (cb) => {
      async.parallel([
        countNouns,
        countVerbs,
        countPronouns,
        countAdjectives,
        countAdverbs,
        getPosTrigrams
      ], cb )
    }
  ],
  (err, result) => {
    cb(resultObj)
  }
  )
}


// EXPORTS
module.exports.analyze = analyze
