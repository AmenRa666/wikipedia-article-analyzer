// MODULES
var Tagger = require("node-stanford-postagger/postagger").Tagger
var _ = require('underscore')

// LOGIC

// Tagger
var tagger = new Tagger({
  port: "9000",
  host: "localhost"
});

// Return Object
var pos = {
  taggedWords: [],
  coordinatingConjunctions: [],
  cardinalNumbers: [],
  determiners: [],
  existentialTheres: [],
  foreignWords: [],
  subordinatingPrepositionAndConjunctions: [],
  ordinalAdjectivesAndNumerals: [],
  comparativeAdjectives: [],
  superlativeAdjectives: [],
  listItemMarkers: [],
  modalAuxiliaries: [],
  singolarCommonNounsAndMasses: [],
  pluralCommonNouns: [],
  singularProperNouns: [],
  pluralProperNouns: [],
  preDeterminers: [],
  genitiveMarkers: [],
  personalPronouns: [],
  possessivePronouns: [],
  adverbs: [],
  comparativeAdverbs: [],
  superlativeAdverbs: [],
  particles: [],
  symbols: [],
  tos: [],
  interjections: [],
  baseFormVerbs: [],
  pastTenseVerbs: [],
  presentParticipleAndGerundVerbs: [],
  pastParticipleVerbs: [],
  notThirdPersonSingularPresentTenseVerbs: [],
  thirdPersonSingularPresentTenseVerbs: [],
  whDeterminers: [],
  whPronouns: [],
  possessiveWHPronouns: [],
  whAdverbs: []
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// TAGS /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// TAGS
// read at http://www.comp.leeds.ac.uk/amalgam/tagsets/upenn.html
// for en extensive explaination

var tags = ['CC', 'CD', 'DT', 'EX', 'FW', 'IN', 'JJ', 'JJR', 'JJS', 'LS', 'MD', 'NN', 'NNS', 'NNP', 'NNPS', 'PDT', 'POS', 'PRP', 'PRP$', 'RB', 'RBR', 'RBS', 'RP', 'SYM', 'TO', 'UH', 'VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ', 'WDT', 'WP', 'WP$', 'WRB']

// CC conjunction, coordinating
var coordinatingConjunctionTag = 'CC'

// CD numeral, cardinal
var cardinalNumberTag = 'CD'

// DT determiner
var determinerTag = 'DT'

// EX existential there
var existentialThereTag = 'EX'

// FW foreign word
var foreignWordTag = 'FW'

// IN preposition or conjunction, subordinating
var subordinatingPrepositionAndConjunctionCTag = 'IN'

// JJ adjective or numeral, ordinal
var ordinalAdjectiveAndNumeralTag = 'JJ'

// JJR adjective, comparative
var comparativeAdjectiveTag = 'JJR'

// JJS adjective, superlative
var superlativeAdjectiveTag = 'JJS'

// LS list item marker
var listItemMarkerTag = 'LS'

// MD modal auxiliary
var modalAuxiliaryTag = 'MD'

// NN noun, common, singular or mass
var singolarCommonNounAndMassTag = 'NN'

// NNS noun, common, plural
var pluralCommonNounTag = 'NNS'

// NNP noun, proper, singular
var singularProperNounTag = 'NNP'

// NNPS noun, proper, plural
var pluralProperNounTag = 'NNPS'

// PDT pre-determiner
var preDeterminerTag = 'PDT'

// POS genitive marker
var genitiveMarkerTag = 'POS'

// PRP pronoun, personal
var personalPronounTag = 'PRP'

// PRP$ pronoun, possessive
var possessivePronounTag = 'PRP$'

// RB adverb
var adverbTag = 'RB'

// RBR adverb, comparative
var comparativeAdverbTag = 'RBR'

// RBS adverb, superlative
var superlativeAdverbTag = 'RBS'

// RP particle
var particleTag = 'RP'

// SYM symbol
var symbolTag = 'SYM'

// TO "to" as preposition or infinitive marker
var toTag = 'TO'

// UH interjection
var interjectionTag = 'UH'

// VB verb, base form
var baseFormVerbTag = 'VB'

// VBD verb, past tense
var pastTenseVerbTag = 'VBD'

// VBG verb, present participle or gerund
var presentParticipleAndGerundVerbTag = 'VBG'

// VBN verb, past participle
var pastParticipleVerbTag = 'VBN'

// VBP verb, present tense, not 3rd person singular
var  notThirdPersonSingularPresentTenseVerbTag = 'VBP'

// VBZ verb, present tense, 3rd person singular
var thirdPersonSingularPresentTenseVerbTag = 'VBZ'

// WDT WH-determiner
var whDeterminerTag = 'WDT'

// WP WH-pronoun
var whPronounTag = 'WP'

// WP$ WH-pronoun, possessive
var possessiveWHPronounTag = 'WP$'

// WRB Wh-adverb
var whAdverbTag = 'WRB'

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

    pos.taggedWords = _taggedWords

    var taggedWordsGroupedByTag = _.groupBy(_taggedWords, 'tag')

    pos.coordinatingConjunctions = _.pluck(taggedWordsGroupedByTag[coordinatingConjunctionTag], 'word') || []
    pos.cardinalNumbers = _.pluck(taggedWordsGroupedByTag[cardinalNumberTag], 'word') || []
    pos.determiners = _.pluck(taggedWordsGroupedByTag[determinerTag], 'word') || []
    pos.existentialTheres = _.pluck(taggedWordsGroupedByTag[existentialThereTag], 'word') || []
    pos.foreignWords = _.pluck(taggedWordsGroupedByTag[foreignWordTag], 'word') || []
    pos.subordinatingPrepositionAndConjunctions = _.pluck(taggedWordsGroupedByTag[subordinatingPrepositionAndConjunctionCTag], 'word') || []
    pos.ordinalAdjectivesAndNumerals = _.pluck(taggedWordsGroupedByTag[ordinalAdjectiveAndNumeralTag], 'word') || []
    pos.comparativeAdjectives = _.pluck(taggedWordsGroupedByTag[superlativeAdjectiveTag], 'word') || []
    pos.superlativeAdjectives = _.pluck(taggedWordsGroupedByTag[superlativeAdjectiveTag], 'word') || []
    pos.listItemMarkers = _.pluck(taggedWordsGroupedByTag[listItemMarkerTag], 'word') || []
    pos.modalAuxiliaries = _.pluck(taggedWordsGroupedByTag[modalAuxiliaryTag], 'word') || []
    pos.singolarCommonNounsAndMasses = _.pluck(taggedWordsGroupedByTag[singolarCommonNounAndMassTag], 'word') || []
    pos.pluralCommonNouns = _.pluck(taggedWordsGroupedByTag[pluralCommonNounTag], 'word') || []
    pos.singularProperNouns = _.pluck(taggedWordsGroupedByTag[singularProperNounTag], 'word') || []
    pos.pluralProperNouns = _.pluck(taggedWordsGroupedByTag[pluralProperNounTag], 'word') || []
    pos.preDeterminers = _.pluck(taggedWordsGroupedByTag[preDeterminerTag], 'word') || []
    pos.genitiveMarkers = _.pluck(taggedWordsGroupedByTag[genitiveMarkerTag], 'word') || []
    pos.personalPronouns = _.pluck(taggedWordsGroupedByTag[personalPronounTag], 'word') || []
    pos.possessivePronouns = _.pluck(taggedWordsGroupedByTag[possessivePronounTag], 'word') || []
    pos.adverbs = _.pluck(taggedWordsGroupedByTag[adverbTag], 'word') || []
    pos.comparativeAdverbs = _.pluck(taggedWordsGroupedByTag[comparativeAdverbTag], 'word') || []
    pos.superlativeAdverbs = _.pluck(taggedWordsGroupedByTag[superlativeAdverbTag], 'word') || []
    pos.particles = _.pluck(taggedWordsGroupedByTag[particleTag], 'word') || []
    pos.symbols = _.pluck(taggedWordsGroupedByTag[symbolTag], 'word') || []
    pos.tos = _.pluck(taggedWordsGroupedByTag[toTag], 'word') || []
    pos.interjections = _.pluck(taggedWordsGroupedByTag[interjectionTag], 'word') || []
    pos.baseFormVerbs = _.pluck(taggedWordsGroupedByTag[baseFormVerbTag], 'word') || []
    pos.pastTenseVerbs = _.pluck(taggedWordsGroupedByTag[pastTenseVerbTag], 'word') || []
    pos.presentParticipleAndGerundVerbs = _.pluck(taggedWordsGroupedByTag[presentParticipleAndGerundVerbTag], 'word') || []
    pos.pastParticipleVerbs = _.pluck(taggedWordsGroupedByTag[pastParticipleVerbTag], 'word') || []
    pos.notThirdPersonSingularPresentTenseVerbs = _.pluck(taggedWordsGroupedByTag[notThirdPersonSingularPresentTenseVerbTag], 'word') || []
    pos.thirdPersonSingularPresentTenseVerbs = _.pluck(taggedWordsGroupedByTag[thirdPersonSingularPresentTenseVerbTag], 'word') || []
    pos.whDeterminers = _.pluck(taggedWordsGroupedByTag[whDeterminerTag], 'word') || []
    pos.whPronouns = _.pluck(taggedWordsGroupedByTag[whPronounTag], 'word') || []
    pos.possessiveWHPronouns = _.pluck(taggedWordsGroupedByTag[possessiveWHPronounTag], 'word') || []
    pos.whAdverbs = _.pluck(taggedWordsGroupedByTag[whAdverbTag], 'word') || []

    // // All type of nouns together (no proper nouns)
    // var _nouns = singolarCommonNounsAndMasses.concat(pluralCommonNouns)
    //
    // // All type of verbs together
    // var _verbs = modalAuxiliaries.concat(pastTenseVerbs, presentParticipleAndGerundVerbs, pastParticipleVerbs, notThirdPersonSingularPresentTenseVerbs, thirdPersonSingularPresentTenseVerbs)
    //
    // // All type of pronouns together
    // var _pronouns = personalPronouns.concat(personalPronouns, existentialTheres, whPronouns, possessiveWHPronouns)
    //
    // // All type of adjectives together
    // var _adjectives = ordinalAdjectivesAndNumerals.concat(comparativeAdjectives, superlativeAdjectives)
    //
    // // All type of adverbs together
    // var _adverbs = adverbs.concat(comparativeAdverbs, superlativeAdverbs)

    cb(pos)
  })
}

// EXPORTS
module.exports.tag = tag
