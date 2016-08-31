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

  text = 'The rule of rhythm in prose is not so intricate. Here, too, we write in groups, or phrases, as I prefer to call them, for the prose phrase is greatly longer and is much more nonchalantly uttered than the group in verse; so that not only is there a greater interval of continuous sound between the pauses, but, for that very reason, word is linked more readily to word by a more summary enunciation. Still, the phrase is the strict analogue of the group, and successive phrases, like successive groups, must differ openly in length and rhythm. The rule of scansion in verse is to suggest no measure but the one in hand; in prose, to suggest no measure at all. Prose must be rhythmical, and it may be as much so as you will; but it must not be metrical. It may be anything, but it must not be verse.'

  // text = 'Existing computer programs that measure readability are based largely upon subroutines which estimate number of syllables, usually by counting vowels. The shortcoming in estimating syllables is that it necessitates keypunching the prose into the computer. There is no need to estimate syllables since word length in letters is a better predictor of readability than word length in syllables. Therefore, a new readability formula was computed that has for its predictors letters per 100 words and sentences per 100 words. Both predictors can be counted by an optical scanning device, and thus the formula makes it economically feasible for an organization such as the U.S. Office of Education to calibrate the readability of all textbooks for the public school system.'
  //
  // text = 'The Australian platypus is seemingly a hybrid of a mammal and reptilian creature.'

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
  var cleanText = text.replace(/\W|'s/g,"")

  // Words array
  var words = text.split(' ')

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
      console.log('x x x x x x x');
      console.log(word);
      console.log('x x x x x x x');
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
      console.log(word);
      daleChallComplexWordCount++
    }
  })

  console.log(daleChallComplexWordCount);




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


  var gfi = gunningFog({
      sentence: sentenceCount,
      word: wordCount,
      complexPolysillabicWord: complexWordsCount
    });

  var smog = smogFormula({
    sentence: sentenceCount,
    polysillabicWord: complexWordsCount
  });

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
