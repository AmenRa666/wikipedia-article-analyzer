// MODULES

var xml2js = require('xml2js')
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
var xml = process.argv[3]

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
  text = text.substring(0, text.indexOf("</doc>"))

  var wordpos = new WordPOS()

  var orginalText = text

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

  console.log(sentenceCount);

  // Expand contractions
  var expandedText = nlp.text(text).contractions.expand().text()

  // Normalize text (remove all punctation except for dots)
  var normalizedText = nlp.text(expandedText).normal();

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
  });

  // Different nouns ratio
  var differentNounsRatio = 0

  // ASINCRONO
  wordpos.getNouns(rootText, (differentNouns) => {
    differentNounsRatio = differentNouns.length/wordCount
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
  });

  // Different verbs ratio
  var differentVerbsRatio = 0

  // ASINCRONO
  wordpos.getVerbs(rootText, (differentVerbs) => {
    differentVerbsRatio = differentVerbs.length/wordCount
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

  //////////////////////// STYLE FEATURES END ////////////////////////












  //////////////////////// STRUCTURE FEATURES BEGIN ////////////////////////

  var parser = new xml2js.Parser()

  // Read the file and print its contents.
  fs.readFile(xml, 'utf8', function(err, data) {
    if (err) throw err

    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('XML LOADED: ' + xml)
    console.log('- - - - - - - - - - - - - - - - - - - -')

    parser.parseString(data, function (err, result) {
      // console.dir(result)
      console.log('Done')

      var articleTextFromXML = result.mediawiki.page[0].revision[0].text[0]._

      var sectionsRegex = /==(.+?)==/g
      var rawSections = articleTextFromXML.match(sectionsRegex) || []

      // Section count
      var sectionTitles = rawSections.filter((element) => {
        return element.charAt(2) != '='
      })
      // +1 because of introduction/abstract
      var sectionCount = sectionTitles.length + 1

      // Subsection count
      var subsectionTitles = rawSections.filter((element) => {
        return element.charAt(2) == '=' && element.charAt(3) != '='
      })
      var subsectionCount = subsectionTitles.length

      // Pragraph count (+1 because of the last paragraph)
      var paragraphCount = orginalText.split('.\n').length + 1

      // Citation count
      var citationsRegex = /&lt;ref|{{sfn\|/g
      var citationCount = (articleTextFromXML.toLowerCase().match(citationsRegex) || []).length

      // Citation count per text length (number of sentences)
      var citationCountPerTextLength = citationCount/sentenceCount

      // Citation count per section
      var citationCountPerSection = citationCount/sectionCount

      // External links count
      var webURLRegex = /\|url=|\| url=|url =| url =|\[http/g
      var externalLinksCount = (articleTextFromXML.toLowerCase().match(webURLRegex) || []).length

      // External links per text length (number of sentences)
      var externalLinksPerTextLength = externalLinksCount/sentenceCount

      // External links per text length (number of sentences)
      var externalLinksPerSection = externalLinksCount/sectionCount

      // Image count
      var imageRegex = /\[\[file:|\[\[image:/g
      var imageCount = (articleTextFromXML.toLowerCase().match(imageRegex) || []).length

      // Image per section
      var imagePerSection = imageCount/sectionCount

      // Image per text length (number of sentence)
      var imagePerTextLength = imageCount/sentenceCount

    //
    //   // var sectionCount = (articleTextFromXML.match(/=+=/g || []).length
    //
    //   // console.log(sectionCount);
    //
    // var str1 = '==caaaaa aandy== ===caaaaaaandy=== ==caaaaaaandy=='
    // var str2 = '===caaaaaaandy==='
    // // var regex = /==.+==/g
    // // var match = (str1.match(regex) || []).length
    // // console.log(regex.test(str1))
    // // console.log(regex.test(str2))
    // // console.log(match);
    // const regex = /==(.+?)==/g
    // const res = articleTextFromXML.match(regex) || []
    // console.log(rawSections)
    })
  })

  //////////////////////// STRUCTURE FEATURES END ////////////////////////

})



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
