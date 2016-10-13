// MODULES
var _ = require('underscore')
var async = require('async')


// LOGIC
// POS Trigram example: 'DT,NN,CC': 3 (the number indicates the repetition of the trigram in the article's text)
const getPosTrigrams = (taggedWords, cb) => {
  var wordTags = _.pluck(taggedWords, 'tag')
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

  cb(posTrigrams)
}


  var numberOfSentencesThatStartWith = {
    coordinatingConjunction: 0,
    determiner: 0,
    subordinatingPrepositionOrConjunction: 0,
    adjective: 0,
    noun: 0,
    pronoun: 0,
    adverb: 0,
    article: 0,
    coordinatingConjunctionRatio: 0,
    determinerRatio: 0,
    subordinatingPrepositionOrConjunctionRatio: 0,
    adjectiveRatio: 0,
    nounRatio: 0,
    pronounRatio: 0,
    adverbRatio: 0,
    articleRatio: 0
  }


var firstWordsTags = {}
var sentences = []
var sentenceCount = 0

const getNumberOfSentencesThatStartWithACoordinatingConjunction = (cb) => {
  var count  = 0
  if (firstWordsTags['CC'] != undefined) {
    count = firstWordsTags['CC']
  }
  numberOfSentencesThatStartWith.coordinatingConjunction = count
  numberOfSentencesThatStartWith.coordinatingConjunctionRatio = count/sentenceCount
  cb(null, 'Get Number Of Sentences That Start With A Coordinating Conjunction')
}

const getNumberOfSentencesThatStartWithADeterminer = (cb) => {
  var count  = 0
  if (firstWordsTags['DT'] != undefined) {
    count = firstWordsTags['DT']
  }
  if (firstWordsTags['WDT'] != undefined) {
    count = count + firstWordsTags['WDT']
  }
  numberOfSentencesThatStartWith.determiner = count
  numberOfSentencesThatStartWith.determinerRatio = count/sentenceCount
  cb(null, 'Get Number Of Sentences That Start With A Determiner')
}

const getNumberOfSentencesThatStartWithASubordinatingPrepositionOrConjunction = (cb) => {
  var count  = 0
  if (firstWordsTags['IN'] != undefined) {
    count = firstWordsTags['IN']
  }
  numberOfSentencesThatStartWith.subordinatingPrepositionOrConjunction = count
  numberOfSentencesThatStartWith.subordinatingPrepositionOrConjunctionRatio = count/sentenceCount
  cb(null, 'Get Number Of Sentences That Start With Subordinating Preposition Or Conjunction')
}

const getNumberOfSentencesThatStartWithAnAdjective = (cb) => {
  var count  = 0
  if (firstWordsTags['JJ'] != undefined) {
    count = firstWordsTags['JJ']
  }
  if (firstWordsTags['JJR'] != undefined) {
    count = count + firstWordsTags['JJR']
  }
  if (firstWordsTags['JJS'] != undefined) {
    count = count + firstWordsTags['JJS']
  }
  numberOfSentencesThatStartWith.adjective = count
  numberOfSentencesThatStartWith.adjectiveRatio = count/sentenceCount
  cb(null, 'Get Number Of Sentences That Start With An Adjective')
}

const getNumberOfSentencesThatStartWithANoun = (cb) => {
  var count  = 0
  if (firstWordsTags['NN'] != undefined) {
    count = firstWordsTags['NN']
  }
  if (firstWordsTags['NNS'] != undefined) {
    count = count + firstWordsTags['NNS']
  }
  if (firstWordsTags['NNP'] != undefined) {
    count = count + firstWordsTags['NNP']
  }
  if (firstWordsTags['NNPS'] != undefined) {
    count = count + firstWordsTags['NNPS']
  }
  numberOfSentencesThatStartWith.noun = count
  numberOfSentencesThatStartWith.nounRatio = count/sentenceCount
  cb(null, 'Get Number Of Sentences That Start With A Noun')
}

const getNumberOfSentencesThatStartWithAPronoun = (cb) => {
  var count  = 0
  if (firstWordsTags['PRP'] != undefined) {
    count = firstWordsTags['PRP']
  }
  if (firstWordsTags['PRP$'] != undefined) {
    count = count + firstWordsTags['PRP$']
  }
  if (firstWordsTags['EX'] != undefined) {
    count = count + firstWordsTags['EX']
  }
  if (firstWordsTags['WP'] != undefined) {
    count = count + firstWordsTags['WP']
  }
  if (firstWordsTags['WP'] != undefined) {
    count = count + firstWordsTags['WP$']
  }
  numberOfSentencesThatStartWith.pronoun = count
  numberOfSentencesThatStartWith.pronounRatio = count/sentenceCount
  cb(null, 'Get Number Of Sentences That Start With A Pronoun')
}

const getNumberOfSentencesThatStartWithAnAdverb = (cb) => {
  var count  = 0
  if (firstWordsTags['RB'] != undefined) {
    count = firstWordsTags['RB']
  }
  if (firstWordsTags['RBR'] != undefined) {
    count = count + firstWordsTags['RBR']
  }
  if (firstWordsTags['RBS'] != undefined) {
    count = count + firstWordsTags['RBS']
  }
  if (firstWordsTags['WRB'] != undefined) {
    count = count + firstWordsTags['WRB']
  }
  numberOfSentencesThatStartWith.adverb = count
  numberOfSentencesThatStartWith.adverbRatio = count/sentenceCount
  cb(null, 'Get Number Of Sentences That Start With An Adverb')
}

const getNumberOfSentencesThatStartWithAnArticle = (cb) => {
  var count = 0
  sentences.forEach((sentence) => {
    sentence = sentence.str.split(' ')
    if (sentence[0] == 'The' || sentence[0] == 'the' || sentence[0] == 'A' || sentence[0] == 'a' || sentence[0] == 'An' || sentence[0] == 'an') {
      count++
    }
  })
  numberOfSentencesThatStartWith.article = count
  numberOfSentencesThatStartWith.articleRatio = count/sentenceCount
  cb(null, 'Get Number Of Sentences That Start With An Article')
}

const getNumberOfSentencesThatStartWith = (_firstWordsTags, _sentences, _sentenceCount, cb) => {
  firstWordsTags = _firstWordsTags
  sentences = _sentences
  sentenceCount = _sentenceCount
  async.parallel([
    getNumberOfSentencesThatStartWithACoordinatingConjunction,
    getNumberOfSentencesThatStartWithADeterminer,
    getNumberOfSentencesThatStartWithASubordinatingPrepositionOrConjunction,
    getNumberOfSentencesThatStartWithAnAdjective,
    getNumberOfSentencesThatStartWithANoun,
    getNumberOfSentencesThatStartWithAPronoun,
    getNumberOfSentencesThatStartWithAnAdverb,
    getNumberOfSentencesThatStartWithAnArticle,
  ], (err, result) => {
    cb(numberOfSentencesThatStartWith)
  })
}






var wordCount = 0
var sentenceCount = 0
var verbs = []
var modalAuxiliariesStatistics = {
  modalAuxiliaryVerbCount: 0,
  modalAuxiliaryVerbsRatio: 0,
  modalAuxiliaryVerbsPerSentence :0,
  modalAuxiliaryVerbsRate: 0
}

const countModalAuxiliaries = (pos, _wordCount, _sentenceCount, cb) => {
  wordCount = _wordCount
  sentenceCount = _sentenceCount

  // All type of verbs together
  verbs = pos.modalAuxiliaries.concat(pos.pastTenseVerbs, pos.presentParticipleAndGerundVerbs, pos.pastParticipleVerbs, pos.notThirdPersonSingularPresentTenseVerbs, pos.thirdPersonSingularPresentTenseVerbs)

  var modalAuxiliaryVerbCount = pos.modalAuxiliaries.length

  modalAuxiliariesStatistics.modalAuxiliaryVerbCount = modalAuxiliaryVerbCount
  modalAuxiliariesStatistics.modalAuxiliaryVerbsRatio = modalAuxiliaryVerbCount/verbs.length
  modalAuxiliariesStatistics.modalAuxiliaryVerbsPerSentence = modalAuxiliaryVerbCount/sentenceCount
  modalAuxiliariesStatistics.modalAuxiliaryVerbsRate = modalAuxiliaryVerbCount/wordCount

  cb(modalAuxiliariesStatistics)
}


// EXPORTS
module.exports.getPosTrigrams = getPosTrigrams
module.exports.getNumberOfSentencesThatStartWith = getNumberOfSentencesThatStartWith
module.exports.countModalAuxiliaries = countModalAuxiliaries
