// MODULES

var nlp = require('nlp_compromise')
nlp.plugin(require('nlp-syllables'))
var fs = require('fs')

// Readability Modules
var automatedReadability = require('automated-readability')
var colemanLiau = require('coleman-liau')
var flesch = require('flesch')
var fleschKincaid = require('flesch-kincaid')
var gunningFog = require('gunning-fog')
var smogFormula = require('smog-formula');
var daleChallFormula = require('dale-chall-formula')
var daleChall = require('dale-chall');


// LOGIC

var filename = process.argv[2]

// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log('USAGE: node ' + process.argv[1] + ' \'filename\'')
  process.exit(1)
}

// Read the file and print its contents.
fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err

  console.log('- - - - - - - - - - - - - - - - - - - -')
  console.log('FILE LOADED: ' + filename)
  console.log('- - - - - - - - - - - - - - - - - - - -')

  // Delete all characters before the title
  var text = data.substring(data.indexOf(">") + 2)

  // ID
  var id = data.split('\"')[1]
  console.log('ID: ' + id);

  // Title
  var title = text.substring(0, text.indexOf("\n"))
  console.log('Title: ' + title);

  // Delete the title
  text = text.substring(text.indexOf("\n") + 2)
  // Delete the closing 'doc' tag
  text = text.substring(0, text.indexOf("</doc>") - 3)

  console.log('- - - - - - - - - - - - - - - - - - - -')

  // Remove "new line"
  text = text.replace(/\n/g, ' ')

  // Remove dots from acronyms (things like '.5' will remain)
  // for (var i = text.length-1; i >= 1; i--) {
  //   if (text.charAt(i) == '.' &&
  //       text.charAt(i+1) != '.' &&
  //       text.charAt(i-1) == ' ') {
  //   }
  //   else if (text.charAt(i) == '.' &&
  //       text.charAt(i-1) != '.' &&
  //       text.charAt(i-2) == '.') {
  //     text = text.slice(0, i) + text.slice(i+1);
  //   }
  //   else if (text.charAt(i-1) != ' ' &&
  //       text.charAt(i) == '.' &&
  //       text.charAt(i+1) != ' ' &&
  //       i+1 <= text.length-1) {
  //     text = text.slice(0, i) + text.slice(i+1);
  //   }
  // }

  // Extract sentences
  var sentences = nlp.text(text).sentences

  // Sentence count
  var sentenceCount = sentences.length

  // Expand contractions
  var expandedText = nlp.text(text).contractions.expand().text()

  // Count questions
  var questionCount = sentences.filter((sentence) => {
    return nlp.sentence(sentence.str).sentence_type() == 'interrogative'
  }).length

  // Count questions
  var exclamationCount = sentences.filter((sentence) => {
    return nlp.sentence(sentence.str).sentence_type() == 'exclamative'
  }).length

  // Normalize text (remove all punctation except for dots)
  var normalizedText = nlp.text(expandedText).normal();

  // Remove dots, question mark and exclamation mark
  var noPontsText = normalizedText.replace(/[\.|?|!]/g, '')

  // Remove white spaces (white spaces excluded)
  var characterCount = noPontsText.replace(/ /g, '').length

  // Words array
  var words = noPontsText.split(' ')

  // Count words
  var wordCount = words.length

  // Count syllable
  var syllableCount = 0
  words.forEach((word) => {
    syllableCount = syllableCount + nlp.term(word).syllables().length
  })

  //////////////////////// LENGHT FEATURES END ////////////////////////

  //////////////////////// READABILITY FEATURES BEGIN ////////////////////////

  // Complex words count
  var complexWordsCount = words.filter((word) => {
    return nlp.term(word).syllables().length >= 3
  }).length

  // Dale-Chall complex word count
  var daleChallComplexWordCount = words.filter((word) => {
    return daleChall.indexOf(word.toLowerCase()) == -1
  }).length

  // Long words count
  var longWordsCount = words.filter(function (word) {
    return word.length > 6
  }).length

  // words.forEach((word) => {
  //   if (nlp.term(word).syllables().length >= 3) {
  //     complexWordsCount++
  //   }
  //   if (daleChall.indexOf(word.toLowerCase()) == -1) {
  //     daleChallComplexWordCount++
  //   }
  //   if (word.length > 6) {
  //     longWordsCount++
  //   }
  // })

  // Periods count
  var periodsCount = sentenceCount + (text.match(/:/g) || []).length

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
    letter: characterCount
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
    difficultWord: daleChallComplexWordCount
  });

  // Läsbarhets Index
  var lix = (wordCount/periodsCount) + (longWordsCount*100/wordCount)

  // Linsear Write Formula
  var lwfSimpleWordsCount = 0
  var lwfComplexWordsCount = 0

  for (var i = 0; i < 99; i++) {
    var word = words[Math.floor(Math.random()*words.length)]
    if (nlp.term(word).syllables().length >= 3) {
      lwfComplexWordsCount++
    }
    else {
      lwfSimpleWordsCount++
    }
  }

  var lwf = (lwfSimpleWordsCount + 3*lwfComplexWordsCount)/sentenceCount
  if (lwf > 20) {
    lwf = lwf/2
  }
  else {
    lwf = (lwf-2)/2
  }

  //////////////////////// READABILITY FEATURES END ////////////////////////

  //////////////////////// LEXICAL FEATURES BEGIN ////////////////////////

  

  //////////////////////// LEXICAL FEATURES END ////////////////////////


})
