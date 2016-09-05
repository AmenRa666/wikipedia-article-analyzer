// MODULES

var nlp = require('nlp_compromise')
nlp.plugin(require('nlp-syllables'))
var fs = require('fs')
var WordPOS = require('wordpos')

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

  var wordpos = new WordPOS()

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

  // Normalize text (remove all punctation except for dots)
  var normalizedText = nlp.text(expandedText).normal();

  // var text2 = 'shavdfv ()/ [] (ciao) {ciao} [asdasd] ? she\' pretty! .,\/#!$%\^&\*;:{}=\-_`~()\[\] 2 + 5 3+6'
  // text2 = nlp.text(text2).contractions.expand().text()
  // text2 = nlp.text(text2).normal()
  //
  // console.log(text2.replace(/[\.|?|!|{|}|\[|\]]/g, ''));

  // Remove dots, question mark and exclamation mark and brackets
  var noPointsText = normalizedText.replace(/[\.|?|!|{|}|\[|\]]/g, '')

  //  ".,\/#!$%\^&\*;:{}=\-_`~()\[\]

  // Root text (she sold seashells -> she sell seashell)
  var rootText = nlp.text(expandedText).root()

  //     DA USARE ASSOLUTAMENTE !!!!!!!!!!!
  // wordpos.getPOS(rootText, console.log)

  //////////////////////// LENGHT BEGIN END ////////////////////////

  // Character count (white spaces excluded)
  var characterCount = noPointsText.replace(/ /g, '').length

  // Words array
  var words = noPointsText.split(' ')

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
  var complexWordCount = words.filter((word) => {
    return nlp.term(word).syllables().length >= 3
  }).length

  // Dale-Chall complex word count
  var daleChallComplexWordCount = words.filter((word) => {
    return daleChall.indexOf(word.toLowerCase()) == -1
  }).length

  // Long words count
  var longWordCount = words.filter(function (word) {
    return word.length > 6
  }).length

  // words.forEach((word) => {
  //   if (nlp.term(word).syllables().length >= 3) {
  //     complexWordCount++
  //   }
  //   if (daleChall.indexOf(word.toLowerCase()) == -1) {
  //     daleChallComplexWordCount++
  //   }
  //   if (word.length > 6) {
  //     longWordCount++
  //   }
  // })

  // Periods count
  var periodsCount = sentenceCount + (text.match(/:/g) || []).length

  // Automated Readability Index
  var ari = automatedReadability({
    sentence: sentenceCount,
    word: wordCount,
    character: text.replace(/ /g, '').length
  })

  // Coleman-Liau Index
  var cli = colemanLiau({
    sentence: sentenceCount,
    word: wordCount,
    letter: words.length
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
      complexPolysillabicWord: complexWordCount
    });

  // SMOG Grade
  var smog = smogFormula({
    sentence: sentenceCount,
    polysillabicWord: complexWordCount
  });

  // Dale-Chall
  var dc = daleChallFormula({
    word: wordCount,
    sentence: sentenceCount,
    difficultWord: daleChallComplexWordCount
  });

  // Läsbarhets Index
  var lix = (wordCount/periodsCount) + (longWordCount*100/wordCount)

  // console.log('x x x x x x');
  // console.log(dc);
  // console.log(ari);
  // console.log(cli);
  // console.log(fre);
  // console.log(fkgl);
  // console.log(gfi);
  // console.log('x x x x x x');


  // Dale-Chall Readability Index	11
  // Automated Readability Index	22.9
  // Coleman-Liau Index	19.4
  // Flesch Reading Ease Score	25.5
  // Flesch-Kincaid Grade Level	17.7
  // Gunning Fog Index	20.9



  // Linsear Write Formula
  var lwfSimpleWordCount = 0
  var lwfComplexWordCount = 0

  for (var i = 0; i < 99; i++) {
    var word = words[Math.floor(Math.random()*words.length)]
    if (nlp.term(word).syllables().length >= 3) {
      lwfComplexWordCount++
    }
    else {
      lwfSimpleWordCount++
    }
  }

  var lwf = (lwfSimpleWordCount + 3*lwfComplexWordCount)/sentenceCount
  if (lwf > 20) {
    lwf = lwf/2
  }
  else {
    lwf = (lwf-2)/2
  }

  //////////////////////// READABILITY FEATURES END ////////////////////////

  //////////////////////// LEXICAL FEATURES BEGIN ////////////////////////

  // Words per sentence
  var wordsPerSentence = wordCount/sentenceCount

  // Different words per sentence
  var differentWordsPerSentence = words.getUniques().length/sentenceCount

  // Different words ratio
  var differentWordsRatio = words.getUniques().length/wordCount

  // Nouns ratio
  var nounsRatio = 0

  // ASINCRONO
  wordpos.getNouns(rootText, (differentNouns) => {
    differentNouns.forEach((noun) => {
      var regex = new RegExp(noun, 'g');
      var matchCount = (noPointsText.match(regex || [])).length
      nounsRatio = nounsRatio + matchCount/wordCount
    })
    // console.log(nounsRatio);
  });

  // Different nouns ratio
  var differentNounsRatio = 0

  // ASINCRONO
  wordpos.getNouns(rootText, (differentNouns) => {
    differentNounsRatio = differentNouns.length/wordCount
    // console.log(differentNounsRatio);
  });

  // Verbs ratio
  var verbsRatio = 0

  // ASINCRONO
  wordpos.getVerbs(rootText, (differentVerbs) => {
    differentVerbs.forEach((verbs) => {
      var regex = new RegExp(verbs, 'g');
      var matchCount = (noPointsText.match(regex || [])).length
      verbsRatio = verbsRatio + matchCount/wordCount
    })
    // console.log(verbsRatio);
  });

  // Different verbs ratio
  var differentVerbsRatio = 0

  // ASINCRONO
  wordpos.getVerbs(rootText, (differentVerbs) => {
    differentVerbsRatio = differentVerbs.length/wordCount
    // console.log(differentVerbsRatio);
  });

  // Syllables per word
  var syllablesPerWord = syllableCount/wordCount

  // Character per word
  var charactersPerWord = characterCount/wordCount

  //////////////////////// LEXICAL FEATURES END ////////////////////////

  //////////////////////// STYLE FEATURES BEGIN ////////////////////////

  // Largest sentence size (in words)
  var largestSentenceSize = 0
  sentences.forEach((sentence) => {
    // Expand contractions (i'll -> i will)
    var expandedSentence = sentence.contractions.expand().text()
    var sentenceLengthInWords = expandedSentence.split(' ').length
    if (sentenceLengthInWords > largestSentenceSize) {
      largestSentenceSize = sentenceLengthInWords
    }
  })

  // Mean sentence size (in words)
  var meanSentenceSize = wordCount/sentenceCount

  // Large sentence rate
  var largeSentenceCount = 0
  sentences.forEach((sentence) => {
    // Expand contractions (i'll -> i will)
    var expandedSentence = sentence.contractions.expand().text()
    var sentenceLengthInWords = expandedSentence.split(' ').length
    if (sentenceLengthInWords > meanSentenceSize + 10) {
      largeSentenceCount++
    }
  })
  var largeSentenceRate = largeSentenceCount/sentenceCount

  // Short sentence rate
  var shortSentenceCount = 0
  sentences.forEach((sentence) => {
    // Expand contractions (i'll -> i will)
    var expandedSentence = sentence.contractions.expand().text()
    var sentenceLengthInWords = expandedSentence.split(' ').length
    if (sentenceLengthInWords < meanSentenceSize - 5) {
      shortSentenceCount++
    }
  })
  var shortSentenceRate = shortSentenceCount/sentenceCount

  // Nouns per sentence
  var nounsPerSentence = 0
  // ASINCRONO
  wordpos.getNouns(rootText, (differentNouns) => {
    differentNouns.forEach((noun) => {
      var regex = new RegExp(noun, 'g');
      var matchCount = (noPointsText.match(regex || [])).length
      nounsPerSentence = nounsPerSentence + matchCount/sentenceCount
    })
    // console.log(nounsPerSentence);
  });

  // Verbs per sentence
  var verbsPerSentence = 0
  // ASINCRONO
  wordpos.getVerbs(rootText, (differentVerbs) => {
    differentVerbs.forEach((verb) => {
      var regex = new RegExp(verb, 'g');
      var matchCount = (noPointsText.match(regex || [])).length
      verbsPerSentence = verbsPerSentence + matchCount/sentenceCount
    })
    // console.log(verbsPerSentence);
  });

  // Auxiliary verb count
  var auxiliaryVerbs = [
    'do',
    'does',
    'did',
    'have',
    'has',
    'had',
    'having',
    'be',
    'am',
    'are',
    'is',
    'was',
    'were',
    'been',
    'being',
    'shall',
    'will',
    'should',
    'would',
    'can',
    'could',
    'may',
    'might',
    'must'
  ]

  var auxiliaryVerbCount = 0

  // use words and not verbs because of some lack in WordPOS
  words.forEach((word) => {
    for (var i = 0; i < auxiliaryVerbs.length; i++) {
      if(word == auxiliaryVerbs[i]) {
        auxiliaryVerbCount++
        break
      }
    }
  })

  // Question count
  var questionCount = sentences.filter((sentence) => {
    return nlp.sentence(sentence.str).sentence_type() == 'interrogative'
  }).length

  // Exclamation count
  var exclamationCount = sentences.filter((sentence) => {
    return nlp.sentence(sentence.str).sentence_type() == 'exclamative'
  }).length

  // Pronoun count
  var pronounCount = 0

  var pronouns = [
    // Personal pronouns (subject)
   'i',
   'you',
   'he',
   'she',
   'it',
   'we',
   'they',
    // Personal pronouns (object)
   'me',
   'him',
   'her',
   'us',
   'them',
   // There
   'there',
    // Possessive pronouns
   'mine',
   'yours',
   'his',
   'hers',
   'its',
   'ours',
   'theirs',
    // This, that, these and those
   'this',
   'that',
   'these',
   'those',
    // Questions
   'who',
   'whose',
   'what',
   'which',
    // Reflexive pronouns
   'myself',
   'yourself',
   'himself',
   'herself',
   'itself',
   'ourselves',
   'yourselves',
   'themselves',
    // Indefinite pronouns ("no one" is missing)
   'somebody',
   'someone',
   'something',
   'anybody',
   'anyone',
   'anything',
   'nobody',
   'noone',
   'nothing',
   'everybody',
   'everyone',
   'everything'
  ]

  words.forEach((word) => {
    for (var i = 0; i < pronouns.length; i++) {
      if(word == pronouns[i]) {
        pronounCount++
        break
      }
    }
  })

  // Coordinating conjunction count
  var coordinatingConjunctionCount = 0
  var coordinatingConjunctions = [
    'And',
    'but',
    'for',
    'nor',
    'or',
    'so',
    'yet'
  ]
  words.forEach((word) => {
    for (var i = 0; i < coordinatingConjunctions.length; i++) {
      if(word == coordinatingConjunctions[i]) {
        coordinatingConjunctionCount++
        break
      }
    }
  })




  // Number of sentences that start with *

  var sentencesFirstWord = []

  sentences.forEach((sentence) => {
    sentencesFirstWord.push(sentence.str.split(' ')[0].replace(/\W|'+s/g,"").toLowerCase())
  })

  // Number of sentences that start with a pronoun
  var startWithPronoun = 0
  sentencesFirstWord.forEach((word) => {
    for (var i = 0; i < pronouns.length; i++) {
      if (word == pronouns[i]) {
        startWithPronoun++
        break
      }
    }
  })

  // Number of sentences that start with an article
  var startWithArticle = 0

  // Number of sentences that start with a conjunction
  var startWithConjunction = 0

  // Number of sentences that start with a pronoun
  var startWithSubordinatingConjunction = 0

  // Number of sentences that start with a pronoun
  var startWithInterrogativePronoun = 0

  // Number of sentences that start with a pronoun
  var startWithPreposition = 0


  console.log(startWithPronoun);




  //////////////////////// STYLE FEATURES END ////////////////////////







})


// 3. Large sentence rate: percentuale di frasi la cui lunghezza è superiore
// di 10 parole alla lunghezza media delle frasi dell’articolo;
// 4. Short sentence rate: percentuale di frasi la cui lunghezza è più corta di 5 parole rispetto alla lunghezza media delle frasi dell’articolo.
// 5. Nouns per sentence: numero medio di sostantivi per frase; (NUO- VA)
// 6. Auxiliary verb count: numero di verbi ausiliari presenti nel conte- nuto dell’articolo;
// 7. Question count: numero di domande presenti nel contenuto dell’ar- ticolo;
// 8. Pronoun count: numero di pronomi presenti nel contenuto dell’arti- colo;
// 9. Passive voice count: numero di voci passive presenti nel contenuto dell’articolo;
// 10. Conjunction rate: numero medio di congiunzioni presenti nel conte- nuto dell’articolo;
// 11. Nominalization ratio: rapporto tra il numero di nominalizzazioni e il numero totale di parole che compongono il contenuto dell’articolo;
// 12. Preposition rate: rapporto tra il numero di preposizioni e il numero totale di parole che compongono il contenuto dell’articolo;
// 13. “To be” verb rate: rapporto tra il numero di voci del verbo essere e il numero totale di parole che compongono il contenuto dell’articolo;
// 14. Number of sentences that start with a pronoun: numero totale di frasi che iniziano con un pronome;
// 15. Number of sentences that start with an article: numero totale di frasi che iniziano con un articolo;
// 16. Number of sentences that start with a conjunction: numero totale di frasi che iniziano con una congiunzione;
// 17. Number of sentences that start with a subordinating con- junction: numero totale di frasi che iniziano con una congiunzione subordinante;
// 18. Number of sentences that start with an interrogative pronoun: numero totale di frasi che iniziano con un pronome interrogativo;
// 19. Number of sentences that start with a preposition: numero totale di frasi che iniziano con una preposizione;


Array.prototype.getUniques = function(){
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
