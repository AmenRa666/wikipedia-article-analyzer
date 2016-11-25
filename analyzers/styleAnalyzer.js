// MODULES
const async = require('async')
const nlp = require('nlp_compromise')
const passive = require('passive-voice');


// LOGIC
let styleFeatures = {
  meanSentenceSize: 0,
  largestSentenceSize: 0,
  shortestSentenceSize: 0,
  largeSentenceRate: 0,
  shortSentenceRate: 0,
  questionCount: 0,
  questionRatio: 0,
  exclamationCount: 0,
  exclamationRatio: 0,
  toBeVerbCount: 0,
  toBeVerbRatio: 0,
  toBeVerbPerSentence: 0,
  toBeVerbRate: 0,
  modalAuxiliaryVerbCount: 0,
  modalAuxiliaryVerbsRatio: 0,
  modalAuxiliaryVerbsPerSentence : 0,
  modalAuxiliaryVerbsRate: 0,
  passiveVoiceCount: 0,
  passiveVoiceRatio: 0,
  passiveVoicePerSentence: 0,
  passiveVoiceRate: 0,
  numberOfSentencesThatStartWithACoordinatingConjunction: 0,
  numberOfSentencesThatStartWithADeterminer: 0,
  numberOfSentencesThatStartWithASubordinatingPrepositionOrConjunction: 0,
  numberOfSentencesThatStartWithAnAdjective: 0,
  numberOfSentencesThatStartWithANoun: 0,
  numberOfSentencesThatStartWithAPronoun: 0,
  numberOfSentencesThatStartWithAnAdverb: 0,
  numberOfSentencesThatStartWithAnArticle: 0,
  numberOfSentencesThatStartWithACoordinatingConjunctionRatio: 0,
  numberOfSentencesThatStartWithADeterminerRatio: 0,
  numberOfSentencesThatStartWithASubordinatingPrepositionOrConjunctionRatio: 0,
  numberOfSentencesThatStartWithAnAdjectiveRatio: 0,
  numberOfSentencesThatStartWithANounRatio: 0,
  numberOfSentencesThatStartWithAPronounRatio: 0,
  numberOfSentencesThatStartWithAnAdverbRatio: 0,
  numberOfSentencesThatStartWithAnArticleRatio: 0
}

let pos = []
let verbs = []
let words = []
let sentences = []
let sentencesTags = []
let wordCount = 0
let sentenceCount = 0
let firstWordsTags = {}

const getMeanSentenceSize = (cb) => {
  styleFeatures.meanSentenceSize = wordCount/sentenceCount
  cb(null, 'Get Mean Sentence Size')
}

const getLargestSentenceSize = (cb) => {
  let largestSentenceSize = 0
  sentences.forEach((sentence) => {
    // Expand contractions (i'll -> i will)
    let expandedSentence = sentence.contractions.expand().text()
    let sentenceLengthInWords = expandedSentence.split(' ').length
    if (sentenceLengthInWords > largestSentenceSize) {
      largestSentenceSize = sentenceLengthInWords
    }
  })
  styleFeatures.largestSentenceSize = largestSentenceSize
  cb(null, 'Get Largest Sentence Size')
}

const getShortestSentenceSize = (cb) => {
  let shortestSentenceSize = sentences[0].str.length
  sentences.forEach((sentence) => {
    // Expand contractions (i'll -> i will)
    let expandedSentence = sentence.contractions.expand().text()
    let sentenceLengthInWords = expandedSentence.split(' ').length
    if (sentenceLengthInWords < shortestSentenceSize) {
      shortestSentenceSize = sentenceLengthInWords
    }
  })
  styleFeatures.shortestSentenceSize = shortestSentenceSize
  cb(null, 'Get Shortest Sentence Size')
}

const getLargeSentenceRate = (cb) => {
  let largeSentenceCount = 0
  sentences.forEach((sentence) => {
    // Expand contractions (i'll -> i will)
    let expandedSentence = nlp.text(sentence.str.toLowerCase()).contractions.expand().text()
    let sentenceLengthInWords = expandedSentence.split(' ').length
    if (sentenceLengthInWords > styleFeatures.meanSentenceSize + 10) {
      largeSentenceCount++
    }
  })
  styleFeatures.largeSentenceRate = largeSentenceCount/sentenceCount
  cb(null, 'Get Large Sentence Rate')
}

const getShortSentenceRate = (cb) => {
  let shortSentenceCount = 0
  sentences.forEach((sentence) => {
    // Expand contractions (i'll -> i will)
    let expandedSentence = nlp.text(sentence.str.toLowerCase()).contractions.expand().text()
    let sentenceLengthInWords = expandedSentence.split(' ').length
    if (sentenceLengthInWords < styleFeatures.meanSentenceSize - 5) {
      shortSentenceCount++
    }
  })
  styleFeatures.shortSentenceRate = shortSentenceCount/sentenceCount
  cb(null, 'Get Large Sentence Rate')
}

const countQuestions = (cb) => {
  let questionCount = 0
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
  let exclamationCount = 0
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

const getToBeVerbFeatures = (cb) => {
  let count = 0
  words.forEach((word) => {
    if (word == 'am' || word == 'are' || word == 'is' || word == 'was' || word == 'were' || word == 'been' || word == 'being') {
      count++
    }
  })
  styleFeatures.toBeVerbCount = count
  styleFeatures.toBeVerbRatio = count/verbs.length
  styleFeatures.toBeVerbPerSentence = count/sentenceCount
  styleFeatures.toBeVerbRate = count/wordCount
  cb(null, 'Count To Be Verb')
}

const getPassiveVoiceFeatures = (cb) => {
  let passiveVoiceCount = 0
  sentences.forEach((sentence) => {
    passiveVoiceCount = passiveVoiceCount + passive(sentence.str).length
  })
  styleFeatures.passiveVoiceCount = passiveVoiceCount
  styleFeatures.passiveVoiceRatio = passiveVoiceCount/verbs.length
  styleFeatures.passiveVoicePerSentence = passiveVoiceCount/sentenceCount
  styleFeatures.passiveVoiceRate = passiveVoiceCount/wordCount
  cb(null, 'Get Passive Voice Features')
}

const getModalAuxiliaryFeatures = (cb) => {
  let modalAuxiliaryVerbCount = pos.modalAuxiliaries.length
  styleFeatures.modalAuxiliaryVerbCount = modalAuxiliaryVerbCount
  styleFeatures.modalAuxiliaryVerbsRatio = modalAuxiliaryVerbCount/verbs.length
  styleFeatures.modalAuxiliaryVerbsPerSentence = modalAuxiliaryVerbCount/sentenceCount
  styleFeatures.modalAuxiliaryVerbsRate = modalAuxiliaryVerbCount/wordCount
  cb(null, 'Get Modal Auxiliaries Features')
}

////////////////////////////////////////////////////////////////////////////////
///////////////////// NUMBER OF SENTENCES THAT START WITH //////////////////////
////////////////////////////////////////////////////////////////////////////////

const getNumberOfSentencesThatStartWithACoordinatingConjunction = (cb) => {
  let count  = 0
  if (firstWordsTags['CC'] != undefined) {
    count = firstWordsTags['CC']
  }
  styleFeatures.numberOfSentencesThatStartWithACoordinatingConjunction = count
  styleFeatures.numberOfSentencesThatStartWithACoordinatingConjunctionRatio = count/sentenceCount
  cb(null, 'Get Number Of Sentences That Start With A Coordinating Conjunction')
}

const getNumberOfSentencesThatStartWithADeterminer = (cb) => {
  let count  = 0
  if (firstWordsTags['DT'] != undefined) {
    count = firstWordsTags['DT']
  }
  if (firstWordsTags['WDT'] != undefined) {
    count = count + firstWordsTags['WDT']
  }
  styleFeatures.numberOfSentencesThatStartWithADeterminer = count
  styleFeatures.numberOfSentencesThatStartWithADeterminerRatio = count/sentenceCount
  cb(null, 'Get Number Of Sentences That Start With A Determiner')
}

const getNumberOfSentencesThatStartWithASubordinatingPrepositionOrConjunction = (cb) => {
  let count  = 0
  if (firstWordsTags['IN'] != undefined) {
    count = firstWordsTags['IN']
  }
  styleFeatures.numberOfSentencesThatStartWithASubordinatingPrepositionOrConjunction = count
  styleFeatures.numberOfSentencesThatStartWithASubordinatingPrepositionOrConjunctionRatio = count/sentenceCount
  cb(null, 'Get Number Of Sentences That Start With Subordinating Preposition Or Conjunction')
}

const getNumberOfSentencesThatStartWithAnAdjective = (cb) => {
  let count  = 0
  if (firstWordsTags['JJ'] != undefined) {
    count = firstWordsTags['JJ']
  }
  if (firstWordsTags['JJR'] != undefined) {
    count = count + firstWordsTags['JJR']
  }
  if (firstWordsTags['JJS'] != undefined) {
    count = count + firstWordsTags['JJS']
  }
  styleFeatures.numberOfSentencesThatStartWithAnAdjective = count
  styleFeatures.numberOfSentencesThatStartWithAnAdjectiveRatio = count/sentenceCount
  cb(null, 'Get Number Of Sentences That Start With An Adjective')
}

const getNumberOfSentencesThatStartWithANoun = (cb) => {
  let count  = 0
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
  styleFeatures.numberOfSentencesThatStartWithANoun = count
  styleFeatures.numberOfSentencesThatStartWithANounRatio = count/sentenceCount
  cb(null, 'Get Number Of Sentences That Start With A Noun')
}

const getNumberOfSentencesThatStartWithAPronoun = (cb) => {
  let count  = 0
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
  if (firstWordsTags['WP$'] != undefined) {
    count = count + firstWordsTags['WP$']
  }
  styleFeatures.numberOfSentencesThatStartWithAPronoun = count
  styleFeatures.numberOfSentencesThatStartWithAPronounRatio = count/sentenceCount
  cb(null, 'Get Number Of Sentences That Start With A Pronoun')
}

const getNumberOfSentencesThatStartWithAnAdverb = (cb) => {
  let count  = 0
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
  styleFeatures.numberOfSentencesThatStartWithAnAdverb = count
  styleFeatures.numberOfSentencesThatStartWithAnAdverbRatio = count/sentenceCount
  cb(null, 'Get Number Of Sentences That Start With An Adverb')
}

const getNumberOfSentencesThatStartWithAnArticle = (cb) => {
  let count = 0
  sentences.forEach((sentence) => {
    sentence = sentence.str.split(' ')
    if (sentence[0] == 'The' || sentence[0] == 'the' || sentence[0] == 'A' || sentence[0] == 'a' || sentence[0] == 'An' || sentence[0] == 'an') {
      count++
    }
  })
  styleFeatures.numberOfSentencesThatStartWithAnArticle = count
  styleFeatures.numberOfSentencesThatStartWithAnArticleRatio = count/sentenceCount
  cb(null, 'Get Number Of Sentences That Start With An Article')
}

const getNumberOfSentencesThatStartWith = (cb) => {
  let sentecesFirstTag = []
  sentencesTags.forEach((sentenceTags) => {
    sentecesFirstTag.push(sentenceTags[0])
  })
  sentecesFirstTag.map((a) => {
    if (a in firstWordsTags) {
      firstWordsTags[a] ++;
    }
    else {
      firstWordsTags[a] = 1;
    }
  })

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
    cb(null, 'Get Number Of Sentences That Start With')
  })
}

const analyze = (_pos, _words, _sentences, _wordCount, _sentenceCount, _sentencesTags, cb) => {
  pos = _pos
  words = _words
  sentences = _sentences
  wordCount = _wordCount
  sentenceCount = _sentenceCount
  sentencesTags = _sentencesTags

  firstWordsTags = {}

  verbs = pos.modalAuxiliaries.concat(pos.pastTenseVerbs, pos.notThirdPersonSingularPresentTenseVerbs, pos.thirdPersonSingularPresentTenseVerbs)

  styleFeatures.meanSentenceSize = 0
  styleFeatures.largestSentenceSize = 0
  styleFeatures.shortestSentenceSize = 0
  styleFeatures.largeSentenceRate = 0
  styleFeatures.shortSentenceRate = 0
  styleFeatures.questionCount = 0
  styleFeatures.questionRatio = 0
  styleFeatures.exclamationCount = 0
  styleFeatures.exclamationRatio = 0
  styleFeatures.toBeVerbCount = 0
  styleFeatures.toBeVerbRatio = 0
  styleFeatures.toBeVerbPerSentence = 0
  styleFeatures.toBeVerbRate = 0
  styleFeatures.modalAuxiliaryVerbCount = 0
  styleFeatures.modalAuxiliaryVerbsRatio = 0
  styleFeatures.modalAuxiliaryVerbsPerSentence = 0
  styleFeatures.modalAuxiliaryVerbsRate = 0
  styleFeatures.passiveVoiceCount = 0
  styleFeatures.passiveVoiceRatio = 0
  styleFeatures.passiveVoicePerSentence = 0
  styleFeatures.passiveVoiceRate = 0
  styleFeatures.numberOfSentencesThatStartWithACoordinatingConjunction = 0
  styleFeatures.numberOfSentencesThatStartWithADeterminer = 0
  styleFeatures.numberOfSentencesThatStartWithASubordinatingPrepositionOrConjunction = 0
  styleFeatures.numberOfSentencesThatStartWithAnAdjective = 0
  styleFeatures.numberOfSentencesThatStartWithANoun = 0
  styleFeatures.numberOfSentencesThatStartWithAPronoun = 0
  styleFeatures.numberOfSentencesThatStartWithAnAdverb = 0
  styleFeatures.numberOfSentencesThatStartWithAnArticle = 0
  styleFeatures.numberOfSentencesThatStartWithACoordinatingConjunctionRatio = 0
  styleFeatures.numberOfSentencesThatStartWithADeterminerRatio = 0
  styleFeatures.numberOfSentencesThatStartWithASubordinatingPrepositionOrConjunctionRatio = 0
  styleFeatures.numberOfSentencesThatStartWithAnAdjectiveRatio = 0
  styleFeatures.numberOfSentencesThatStartWithANounRatio = 0
  styleFeatures.numberOfSentencesThatStartWithAPronounRatio = 0
  styleFeatures.numberOfSentencesThatStartWithAnAdverbRatio = 0
  styleFeatures.numberOfSentencesThatStartWithAnArticleRatio = 0

  async.parallel([
    getModalAuxiliaryFeatures,
    getNumberOfSentencesThatStartWith,
    getPassiveVoiceFeatures,
    getToBeVerbFeatures,
    (cb) => {
      async.series([
        getMeanSentenceSize,
        (cb) => {
          async.parallel([
            getLargeSentenceRate,
            getShortSentenceRate
          ], cb)
        }
      ], cb)
    },

    getLargestSentenceSize,
    getShortestSentenceSize,

    (cb) => {
      async.series([
        countQuestions,
        getQuestionRatio
      ], cb)
    },

    (cb) => {
      async.series([
        countExclamations,
        getExclamationRatio
      ], cb)
    },

  ], (err, result) => {
    cb(styleFeatures)
  })

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
