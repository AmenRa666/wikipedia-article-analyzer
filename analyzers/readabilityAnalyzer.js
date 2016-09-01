// MODULES

var async = require('async')

var nlp = require('nlp_compromise')

var syllable = require('syllable')

var automatedReadability = require('automated-readability')
var colemanLiau = require('coleman-liau')
var flesch = require('flesch')
var fleschKincaid = require('flesch-kincaid')
var gunningFog = require('gunning-fog')
var smogFormula = require('smog-formula');
var daleChallFormula = require('dale-chall-formula')

var daleChall = require('dale-chall');


// LOGIC

const analyze = () => {

  // Remove "new line"
  text = text.replace(/\n/g, ' ')

  // Remove dots from acronyms (things like '.5' will remain)
  for (var i = text.length-1; i >= 1; i--) {
    if (text.charAt(i) == '.' &&
        text.charAt(i+1) != '.' &&
        text.charAt(i-1) == ' ') {
    }
    else if (text.charAt(i) == '.' &&
        text.charAt(i-1) != '.' &&
        text.charAt(i-2) == '.') {
      text = text.slice(0, i) + text.slice(i+1);
    }
    else if (text.charAt(i-1) != ' ' &&
        text.charAt(i) == '.' &&
        text.charAt(i+1) != ' ' &&
        i+1 <= text.length-1) {
      text = text.slice(0, i) + text.slice(i+1);
    }
  }

  // Sentence count
  var sentenceCount = text.split('. ').length

  // Remove all non-letter/digit symbols and saxon genitive
  var cleanText = text.replace(/\W|'s/g,"") // RIVEDERE


  // Words array
  var words = text.replace(/\W/g," ").split(' ')

  console.log(words);

  // Word count
  var wordCount = words.length

  // Remove space symbols
  var cleanTextWithoutSpaces = cleanText.replace(/ /g, '')

  // Character count
  var characterCount = cleanTextWithoutSpaces.length

  // Syllable count
  var syllableCount = syllable(cleanText)

  // Complex words count
  var complexWordsCount = 0

  nlp.plugin(require('nlp-syllables'))

  var wordSyllables = []

  words.forEach((word) => {
    wordSyllables = nlp.term(word)
    // console.log(wordSyllables.syllables().length);
    // console.log(syllable(word));
    // console.log('- - - - -');

    if (wordSyllables.syllables().length != syllable(word)) {
      // console.log('x x x x x x x');
      // console.log(word);
      // console.log('x x x x x x x');
    }

    if (syllable(word) >= 3) {
      complexWordsCount++
    }
  })


  var daleChallComplexWordCount = 0

  // console.log(daleChall);

  // Count Dale-Chall complex words
  words.forEach((word) => {
    if (daleChall.indexOf(word.toLowerCase()) == -1) {
      // console.log(word);
      daleChallComplexWordCount++
    }
  })





  // console.log(sentenceCount);
  // console.log(characterCount);
  // console.log(wordCount);
  // console.log(syllableCount);
  // console.log(complexWordsCount);




  // Automated Readability Index
  var ari = automatedReadability({
    sentence: sentenceCount,
    word: wordCount,
    character: characterCount
  })

  // Coleman-Liau Index
  var cli = colemanLiau({
    sentence: sentenceCount,
    word: wordCount,
    character: characterCount
  })

  // Flesch Reading Ease
  var fre = flesch({
    sentence: sentenceCount,
    word: wordCount,
    syllable: syllableCount
  })

  // Flesch-Kincaid Grade Level
  var fkgl = fleschKincaid({
    sentence: sentenceCount,
    word: wordCount,
    syllable: syllableCount
  })

  // Gunning Fog Index
  var gfi = gunningFog({
      sentence: sentenceCount,
      word: wordCount,
      complexPolysillabicWord: complexWordsCount
    });

  // SMOG Grade
  var smog = smogFormula({
    sentence: sentenceCount,
    polysillabicWord: complexWordsCount
  });

  // Dale-Chall
  var dc = daleChallFormula({
    word: wordCount,
    sentence: sentenceCount,
    difficultWord: 0
  });




  // ESEMPIO SBAGLIATO
  // var dc = daleChallFormula({
  //   word: 30,
  //   sentence: 2,
  //   difficultWord: 0
  // });





  // async.parallel([
  //
  // ],
  // (err, results) {
  //   console.log();
  //   cb(null, 'Ok')
  // }
  // )
}


// EXPORTS

module.exports.analyze = analyze
