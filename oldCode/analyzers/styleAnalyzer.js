// MODULES

var WordPOS = require('wordpos')
var async = require('async')


// LOGIC

var wordpos = new WordPOS()

var styleFeaturesScores = {
  largestSentenceSize: null,
  meanSentenceSize: null,
  largeSentenceRate: null,
  shortSentenceRate: null,
  nounsPerSentence: null,
  auxiliaryVerbCount: null,
  questionCount: null,
  pronounCount: null,
  passiveVoiceCount: null,
  conjuctionRate: null,
  nominalizationRatio: null,
  prepositionRate: null,
  toBeVerbRate: null,
  numberOfSentencesThatStartWithAPronoun: null,
  numberOfSentencesThatStartWithAnArticle: null,
  numberOfSentencesThatStartWithAConjunction: null,
  numberOfSentencesThatStartWithASubordinatingConjunction: null,
  numberOfSentencesThatStartWithAnInterrogativePronoun: null,
  numberOfSentencesThatStartWithAPreposition: null
}

var state = {
  sentences: null,
  text: null
}

// Return the array of sentences
const getSentences = (text, cb) => {
  state.sentences = text.split('. ')
  cb(null, 'Sentences')
}

// Return largest sentence size (in words)
const getLargestSentenceSize = (sentences, cb) => {
  var largestSentenceSize = 0
  sentences.forEach((sentence) => {
    var sentenceLengthInWords = sentence.split(' ').length
    if (sentenceLengthInWords > largestSentenceSize) {
      largestSentenceSize = sentenceLengthInWords
    }
  })
  styleFeaturesScores.largestSentenceSize = largestSentenceSize
  cb(null, 'Largest Sentence Size')
}

// Return mean sentence size (in words)
const getMeanSentenceSize = (text, sentences, cb) => {
  var meanSentenceSize = text.split(' ').length/sentences.length
  styleFeaturesScores.meanSentenceSize = meanSentenceSize
  cb(null, 'Mean Sentence Size')
}

// Return large sentences rate
const getLargeSentencesRate = (sentences, meanSentenceSize, cb) => {
  var largeSentenceRate = 0
  sentences.forEach((sentence) => {
    sentenceLengthInWords = sentence.split(' ').length
    if (sentenceLengthInWords > (meanSentenceSize + 10)) {
      largeSentenceRate++
    }
  })
  styleFeaturesScores.largeSentenceRate = largeSentenceRate
  cb(null, 'Large Sentence Rate')
}

// Return short sentences rate
const getShortSentencesRate = (sentences, meanSentenceSize, cb) => {
  var shortSentenceRate = 0
  sentences.forEach((sentence) => {
    sentenceLengthInWords = sentence.split(' ').length
    if (sentenceLengthInWords < (meanSentenceSize - 5)) {
      shortSentenceRate++
    }
  })
  styleFeaturesScores.shortSentenceRate = shortSentenceRate
  cb(null, 'Short Sentence Rate')
}

// Return nouns per sentence rate
const getNounsPerSentence = (text, sentences, cb) => {
  var lowerCaseCleanText = text.replace(/[".,\/#!$%\^&\*;:{}=\-_`~()\[\]]|'s/g,"").toLowerCase()
  var nounsCount = 0
  wordpos.getNouns(lowerCaseCleanText, (differentNouns) => {
    differentNouns.forEach((noun) => {
      var regex = new RegExp(noun, 'g');
      var matchCount = (lowerCaseCleanText.match(regex)).length
      nounsCount = nounsCount + matchCount
    })
    styleFeaturesScores.nounsPerSentence = nounsCount/sentences.length
    cb(null, 'Nouns Per Sentence')
  })
}

// Return the number of question mark in the text
const getQuestionCount = (text, cb) => {
  styleFeaturesScores.questionCount = (text.match(/\?/g) || []).length
  cb(null, 'Question Count')
}

// Return the number of pronouns
const getPronounCount = (text, cb) => {
  var pronounCount = 0
  var lowerCaseCleanText = text.replace(/[".,\/#!$%\^&\*;:{}=\-_`~()\[\]]|'s/g,"").toLowerCase()
  var lowerCaseCleanTextWords = lowerCaseCleanText.split(" ")

  // Missing pronouns are counted in other pronoun-classes yet
  lowerCaseCleanTextWords.forEach((word) => {
    // Personal pronouns (subject)
    if (word === 'i' || word === 'you' || word === 'he' || word === 'she' || word === 'it' || word === 'we' || word === 'they') {
      pronounCount++
    }
    // Personal pronouns (object)
    if (word === 'me' || word === 'him' || word === 'her' || word === 'us' || word === 'them') {
      pronounCount++
    }

    if (word === 'there') {
      pronounCount++
    }

    // Possessive pronouns
    if (word === 'mine' || word === 'yours' || word === 'his' || word === 'hers' || word === 'its' || word === 'ours' || word === 'theirs') {
      pronounCount++
    }

    // This, that, these and those
    if (word === 'this' || word === 'that' || word === 'these' || word === 'those') {
      pronounCount++
    }

    // Questions
    if (word === 'who' || word === 'whose' || word === 'what' || word === 'which') {
      pronounCount++
    }

    // Reflexive pronouns
    if (word === 'myself' || word === 'yourself' || word === 'himself' || word === 'herself' || word === 'itself' || word === 'ourselves' || word === 'yourselves' || word === 'themselves') {
      pronounCount++
    }

    // Indefinite pronouns ("no one" is missing)
    if (word === 'somebody' || word === 'someone' || word === 'something' || word === 'anybody' || word === 'anyone' || word === 'anything' || word === 'nobody' || word === 'noone' || word === 'nothing' || word === 'everybody' || word === 'everyone' || word === 'everything') {
      pronounCount++
    }
  })
  styleFeaturesScores.pronounCount = pronounCount
  cb(null, 'Pronoun Count')
}

// Call to all the functions above
const analyze = (text, callback) => {

  styleFeaturesScores.largestSentenceSize = null
  styleFeaturesScores.meanSentenceSize = null
  styleFeaturesScores.largeSentenceRate = null
  styleFeaturesScores.shortSentenceRate = null
  styleFeaturesScores.nounsPerSentence = null
  styleFeaturesScores.auxiliaryVerbCount = null
  styleFeaturesScores.questionCount = null
  styleFeaturesScores.pronounCount = null
  styleFeaturesScores.passiveVoiceCount = null
  styleFeaturesScores.conjuctionRate = null
  styleFeaturesScores.nominalizationRatio = null
  styleFeaturesScores.prepositionRate = null
  styleFeaturesScores.toBeVerbRate = null
  styleFeaturesScores.numberOfSentencesThatStartWithAPronoun = null
  styleFeaturesScores.numberOfSentencesThatStartWithAnArticle = null
  styleFeaturesScores.numberOfSentencesThatStartWithAConjunction = null
  styleFeaturesScores.numberOfSentencesThatStartWithASubordinatingConjunction = null
  styleFeaturesScores.numberOfSentencesThatStartWithAnInterrogativePronoun = null
  styleFeaturesScores.numberOfSentencesThatStartWithAPreposition = null

  state.sentences = null
  state.text = text.replace(/\n/g, ' ')

  async.series([

    (callback) => {
      async.parallel([
        async.apply(getSentences, state.text),
        async.apply(getQuestionCount, state.text),
        async.apply(getPronounCount, state.text)
        ],
        function(err, results) {
          callback(null, 'Ok')
        }
      )
    },
    (callback) => {
      async.parallel([
        async.apply(getLargestSentenceSize, state.sentences),
        async.apply(getMeanSentenceSize, state.text, state.sentences),
        async.apply(getNounsPerSentence, state.text, state.sentences)
        ],
        function(err, results) {
          callback(null, 'Ok')
        }
      )
    },
    (callback) => {
      async.parallel([
        async.apply(getLargeSentencesRate, state.sentences, styleFeaturesScores.meanSentenceSize),
        async.apply(getShortSentencesRate, state.sentences, styleFeaturesScores.meanSentenceSize)
        ],
        function(err, results) {
          callback(null, 'Ok')
        }
      )
    }





    // async.apply(getSentences, text),
    // async.parallel([
    //   async.apply(getLargestSentenceSize, state.sentences)
    //
    //
    // ],
    // // optional callback
    // function(err, results) {
    //   callback(null, 'ok')
    // })






  ],
    // optional callback
  function(err, results) {
    console.log(styleFeaturesScores);
    console.log(results);
  })

}


// EXPORTS

module.exports.analyze = analyze
