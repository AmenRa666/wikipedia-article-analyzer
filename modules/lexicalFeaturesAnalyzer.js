// MODULES

var syllable = require('syllable')
var WordPOS = require('wordpos')
var async = require('async')

// LOGIC

var wordpos = new WordPOS()

var lexicalFeaturesScores = {
  wordsPerSentence: null,
  differentWordsPerSentence: null,
  differentWordsRatio: null,
  nounsRatio: null,
  differentNounsRatio: null,
  verbsRatio: null,
  differentVerbsRatio: null,
  copulasPerSentence: null,
  syllablesPerWord: null,
  charactersPerWord: null
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

// Returns words per sentence
const getWordsPerSentence = (text, sentences, cb) => {
  var wordCount = text.split(' ').length
  lexicalFeaturesScores.wordsPerSentence = wordCount/sentences.length
  cb(null, 'Words Per Sentence')
}

// Returns different words per sentence
const getDifferentWordsPerSentence = (text, sentences, cb) => {
  // Amount of different words in every sentence
  var differentWordsInSentences = 0

  sentences.forEach((sentence) => {
    var lowerCaseCleanSentence = sentence.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase()
    // Two words connected by a dash symbol (-) are considered one only word so they aren't splitted in two
    var words = sentence.split(" ")
    var cleanWords = []
    words.forEach((word) => {
      // Dash symbol (-) will not be removed not removed
      var cleanWord = word.replace(/[".,\/#!$%\^&\*;:{}=\\_`~()]|'s/g,"").toLowerCase()
      cleanWords.push(cleanWord)
    })
    differentWordsInSentences = differentWordsInSentences + cleanWords.getUnique().length
  })

  lexicalFeaturesScores.differentWordsPerSentence = differentWordsInSentences/sentences.length
  cb(null, 'Different Words Per Sentence')
}

// Returns the percentage of different words in the text
const getDifferentWordsRatio = (text, cb) => {
  var lowerCaseCleanText = text.replace(/[".,\/#!$%\^&\*;:{}=\-_`~()\[\]]|'s/g,"").toLowerCase()
  var words = lowerCaseCleanText.split(' ')
  var differentWords = words.getUnique()
  lexicalFeaturesScores.differentWordsRatio = differentWords.length/words.length
  cb(null, 'Different Words Ratio')
}

// Returns the percentage of nouns in the text
const getNounsRatio = (text, cb) => {
  var lowerCaseCleanText = text.replace(/[".,\/#!$%\^&\*;:{}=\-_`~()\[\]]|'s/g,"").toLowerCase()
  var words = lowerCaseCleanText.split(' ')
  var nounsCount = 0
  wordpos.getNouns(lowerCaseCleanText, (differentNouns) => {
    differentNouns.forEach((noun) => {
      var regex = new RegExp(noun, 'g');
      var matchCount = (lowerCaseCleanText.match(regex)).length
      nounsCount = nounsCount + matchCount
    })
    lexicalFeaturesScores.nounsRatio = nounsCount/words.length
    cb(null, 'Nouns Ratio')
  })
}

// Returns the percentage of different nouns in the text
const getDifferentNounsRatio = (text, cb) => {
  var lowerCaseCleanText = text.replace(/[".,\/#!$%\^&\*;:{}=\-_`~()\[\]]|'s/g,"").toLowerCase()
  var words = lowerCaseCleanText.split(' ')
  wordpos.getNouns(lowerCaseCleanText, (differentNouns) => {
    lexicalFeaturesScores.differentNounsRatio = differentNouns.length/words.length
    cb(null, 'Nouns Ratio')
  })
}

// Returns the percentage of verbs in the text
const getVerbsRatio = (text, cb) => {
  var lowerCaseCleanText = text.replace(/[".,\/#!$%\^&\*;:{}=\-_`~()\[\]]|'s/g,"").toLowerCase()
  var words = lowerCaseCleanText.split(' ')
  var verbsCount = 0
  wordpos.getVerbs(lowerCaseCleanText, (differentVerbs) => {
    differentVerbs.forEach((verb) => {
      var regex = new RegExp(verb, 'g');
      var matchCount = (lowerCaseCleanText.match(regex)).length
      verbsCount = verbsCount + matchCount
    })
    lexicalFeaturesScores.verbsRatio = verbsCount/words.length
    cb(null, 'Nouns Ratio')
  })
}

// Returns the percentage of different verbs in the text
const getDifferentVerbsRatio = (text, cb) => {
  var lowerCaseCleanText = text.replace(/[".,\/#!$%\^&\*;:{}=\-_`~()\[\]]|'s/g,"").toLowerCase()
  var words = lowerCaseCleanText.split(' ')
  wordpos.getVerbs(lowerCaseCleanText, (differentVerbs) => {
    lexicalFeaturesScores.differentVerbsRatio = differentVerbs.length/words.length
    cb(null, 'Different Nouns Ratio')
  })
}

// Returns sillables per word
const getSyllablesPerWord = (text, cb) => {
  var lowerCaseCleanText = text.replace(/[".,\/#!$%\^&\*;:{}=\-_`~()\[\]]|'s/g,'').toLowerCase()
  var words = lowerCaseCleanText.split(' ')
  var syllablesCount = 0
  words.forEach((word) => {
    syllablesCount = syllablesCount + syllable(word)
  })
  lexicalFeaturesScores.syllablesPerWord = syllablesCount/words.length
  cb(null, 'Syllables Per Word')
}

// Returns characters per word
const getCharactersPerWord = (text, cb) => {
  var lowerCaseCleanText = text.replace(/[".,\/#!$%\^&\*;:{}=\-_`~()\[\]]|'s/g,'').toLowerCase()
  var words = lowerCaseCleanText.split(' ')
  // Remove white spaces so the text become a string composed of each character from words
  var characters = lowerCaseCleanText.replace(/ /g,'')
  lexicalFeaturesScores.charactersPerWord = characters.length/words.length
  cb(null, 'Syllables Per Word')
}

// Call to all the functions above
const analyze = (text, cb) => {

  lexicalFeaturesScores.wordsPerSentence = null
  lexicalFeaturesScores.differentWordsPerSentence = null
  lexicalFeaturesScores.differentWordsRatio = null
  lexicalFeaturesScores.nounsRatio = null
  lexicalFeaturesScores.differentNounsRatio = null
  lexicalFeaturesScores.verbsRatio = null
  lexicalFeaturesScores.differentVerbsRatio = null
  lexicalFeaturesScores.copulasPerSentence = null
  lexicalFeaturesScores.syllablesPerWord = null
  lexicalFeaturesScores.charactersPerWord = null

  state.sentences = null
  state.text = text.replace(/\n/g, ' ')


  async.series([
    async.apply(getSentences, state.text),
    async.apply(getDifferentWordsRatio, state.text),
    async.apply(getNounsRatio, state.text),
    async.apply(getDifferentNounsRatio, state.text),
    async.apply(getVerbsRatio, state.text),
    async.apply(getDifferentVerbsRatio, state.text),
    async.apply(getSyllablesPerWord, state.text),
    async.apply(getCharactersPerWord, state.text),
    (cb) => {
      async.parallel([
        async.apply(getWordsPerSentence, state.text, state.sentences),
        async.apply(getDifferentWordsPerSentence, state.text, state.sentences)
      ],
      function(err, results) {
        cb(null, 'Ok')
      }
    )
    }
  ],
  function(err, results) {
    console.log(lexicalFeaturesScores);
  })

}

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}

// EXPORTS

module.exports.analyze = analyze
