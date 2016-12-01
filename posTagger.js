// MODULES
const Tagger = require("node-stanford-postagger/postagger").Tagger
const _ = require('underscore')
const async = require('async')
// docker run -p 9000:9000 cuzzo/stanford-pos-tagger


// LOGIC
// Tagger
const tagger = new Tagger({
  port: "9000",
  host: "192.168.99.100"
  // host: "localhost"
});

// Return Object
let pos = {
  taggedWords: [],
  coordinatingConjunctions: [],
  cardinalNumbers: [],
  determiners: [],
  existentialTheres: [],
  foreignWords: [],
  subordinatingPrepositionsAndConjunctions: [],
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

const tags = ['CC', 'CD', 'DT', 'EX', 'FW', 'IN', 'JJ', 'JJR', 'JJS', 'LS', 'MD', 'NN', 'NNS', 'NNP', 'NNPS', 'PDT', 'POS', 'PRP', 'PRP$', 'RB', 'RBR', 'RBS', 'RP', 'SYM', 'TO', 'UH', 'VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ', 'WDT', 'WP', 'WP$', 'WRB']

// CC conjunction, coordinating
const coordinatingConjunctionTag = 'CC'

// CD numeral, cardinal
const cardinalNumberTag = 'CD'

// DT determiner
const determinerTag = 'DT'

// EX existential there
const existentialThereTag = 'EX'

// FW foreign word
const foreignWordTag = 'FW'

// IN preposition or conjunction, subordinating
const subordinatingPrepositionsAndConjunctionsTag = 'IN'

// JJ adjective or numeral, ordinal
const ordinalAdjectiveAndNumeralTag = 'JJ'

// JJR adjective, comparative
const comparativeAdjectiveTag = 'JJR'

// JJS adjective, superlative
const superlativeAdjectiveTag = 'JJS'

// LS list item marker
const listItemMarkerTag = 'LS'

// MD modal auxiliary
const modalAuxiliaryTag = 'MD'

// NN noun, common, singular or mass
const singolarCommonNounAndMassTag = 'NN'

// NNS noun, common, plural
const pluralCommonNounTag = 'NNS'

// NNP noun, proper, singular
const singularProperNounTag = 'NNP'

// NNPS noun, proper, plural
const pluralProperNounTag = 'NNPS'

// PDT pre-determiner
const preDeterminerTag = 'PDT'

// POS genitive marker
const genitiveMarkerTag = 'POS'

// PRP pronoun, personal
const personalPronounTag = 'PRP'

// PRP$ pronoun, possessive
const possessivePronounTag = 'PRP$'

// RB adverb
const adverbTag = 'RB'

// RBR adverb, comparative
const comparativeAdverbTag = 'RBR'

// RBS adverb, superlative
const superlativeAdverbTag = 'RBS'

// RP particle
const particleTag = 'RP'

// SYM symbol
const symbolTag = 'SYM'

// TO "to" as preposition or infinitive marker
const toTag = 'TO'

// UH interjection
const interjectionTag = 'UH'

// VB verb, base form
const baseFormVerbTag = 'VB'

// VBD verb, past tense
const pastTenseVerbTag = 'VBD'

// VBG verb, present participle or gerund
const presentParticipleAndGerundVerbTag = 'VBG'

// VBN verb, past participle
const pastParticipleVerbTag = 'VBN'

// VBP verb, present tense, not 3rd person singular
const  notThirdPersonSingularPresentTenseVerbTag = 'VBP'

// VBZ verb, present tense, 3rd person singular
const thirdPersonSingularPresentTenseVerbTag = 'VBZ'

// WDT WH-determiner
const whDeterminerTag = 'WDT'

// WP WH-pronoun
const whPronounTag = 'WP'

// WP$ WH-pronoun, possessive
const possessiveWHPronounTag = 'WP$'

// WRB Wh-adverb
const whAdverbTag = 'WRB'

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const groupBytag = (cb) => {
  let taggedWordsGroupedByTag = _.groupBy(pos.taggedWords, 'tag')

  pos.coordinatingConjunctions = _.pluck(taggedWordsGroupedByTag[coordinatingConjunctionTag], 'word') || []
  pos.cardinalNumbers = _.pluck(taggedWordsGroupedByTag[cardinalNumberTag], 'word') || []
  pos.determiners = _.pluck(taggedWordsGroupedByTag[determinerTag], 'word') || []
  pos.existentialTheres = _.pluck(taggedWordsGroupedByTag[existentialThereTag], 'word') || []
  pos.foreignWords = _.pluck(taggedWordsGroupedByTag[foreignWordTag], 'word') || []
  pos.subordinatingPrepositionsAndConjunctions = _.pluck(taggedWordsGroupedByTag[subordinatingPrepositionsAndConjunctionsTag], 'word') || []
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
  cb()
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

let taggedSentences = []
let sentencesTags = []

const tagSentence = (sentence, cb) => {

  tagger.tag(sentence, function(err, resp) {
    if (err) {
      console.log(err);
    }
    else {
      resp = resp.join(' ')
      let taggedWords = resp.split(' ')
      let sentenceTags = []
      let taggedSentence = []
      taggedWords.forEach((taggedWord) => {
        // Array with two element, word and tag
        taggedWord = taggedWord.split('_')
        // If the tag is not in the 'tags' array the element will be discarded
        if (_.indexOf(tags, taggedWord[1]) != -1) {
          taggedWord = {
            word: taggedWord[0],
            tag: taggedWord[1]
          }
          taggedSentence.push(taggedWord)
          sentenceTags.push(taggedWord.tag)
        }
      })
      taggedSentences.push(taggedSentence)
      sentencesTags.push(sentenceTags)
    }
    cb(null, 'Tag Sentence')
  })
}

const tagSentences = (sentences, cb) => {
  let _sentences = []

  taggedSentences = []
  sentencesTags = []

  pos.taggedWords = []
  pos.coordinatingConjunctions = []
  pos.cardinalNumbers = []
  pos.determiners = []
  pos.existentialTheres = []
  pos.foreignWords = []
  pos.subordinatingPrepositionsAndConjunctions = []
  pos.ordinalAdjectivesAndNumerals = []
  pos.comparativeAdjectives = []
  pos.superlativeAdjectives = []
  pos.listItemMarkers = []
  pos.modalAuxiliaries = []
  pos.singolarCommonNounsAndMasses = []
  pos.pluralCommonNouns = []
  pos.singularProperNouns = []
  pos.pluralProperNouns = []
  pos.preDeterminers = []
  pos.genitiveMarkers = []
  pos.personalPronouns = []
  pos.possessivePronouns = []
  pos.adverbs = []
  pos.comparativeAdverbs = []
  pos.superlativeAdverbs = []
  pos.particles = []
  pos.symbols = []
  pos.tos = []
  pos.interjections = []
  pos.baseFormVerbs = []
  pos.pastTenseVerbs = []
  pos.presentParticipleAndGerundVerbs = []
  pos.pastParticipleVerbs = []
  pos.notThirdPersonSingularPresentTenseVerbs = []
  pos.thirdPersonSingularPresentTenseVerbs = []
  pos.whDeterminers = []
  pos.whPronouns = []
  pos.possessiveWHPronouns = []
  pos.whAdverbs = []

  sentences.forEach((sentence) => {
    _sentences.push(sentence.str)
  })
  async.eachSeries(
    _sentences,
    tagSentence,
    (err, results) => {
      pos.taggedWords = _.flatten(taggedSentences)
      groupBytag(() => {
        cb(pos, sentencesTags)
      })
    }
  )
}

// EXPORTS
module.exports.tag = tagSentences
