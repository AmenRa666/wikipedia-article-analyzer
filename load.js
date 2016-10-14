// MODULES
var PythonShell = require('python-shell');
var fs = require('fs')
var xml2js = require('xml2js')
var nlp = require('nlp_compromise')
nlp.plugin(require('nlp-syllables'))
var math = require('mathjs')
var _ = require('underscore')
var async = require('async')
// Readability Modules
var automatedReadability = require('automated-readability')
var colemanLiau = require('coleman-liau')
var flesch = require('flesch')
var fleschKincaid = require('flesch-kincaid')
var gunningFog = require('gunning-fog')
var smogFormula = require('smog-formula');
var daleChallFormula = require('dale-chall-formula')
var daleChall = require('dale-chall');
// POS Tagger
var posTagger = require('./posTagger.js')
// Analizers
var posAnalyzer = require('./analyzers/posAnalyzer.js')
var trigramAnalyzer = require('./analyzers/trigramAnalyzer.js')
var readabilityAnalyzer = require('./analyzers/readabilityAnalyzer.js')
var lengthAnalyzer = require('./analyzers/lengthAnalyzer.js')
var structureAnalyzer = require('./analyzers/structureAnalyzer.js')
var lexicalAnalyzer = require('./analyzers/lexicalAnalyzer.js')
var styleAnalyzer = require('./analyzers/styleAnalyzer.js')
var articleAnalyzer = require('./articleAnalyzer.js')


// LOGIC
var xmlFilename = process.argv[2]
var parser = new xml2js.Parser()

// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log('USAGE: node ' + process.argv[1] + ' \'filename\'')
  process.exit(1)
}

// Read the file and print its contents.
fs.readFile(xmlFilename, 'utf8', function(err, xmlArticle) {
  if (err) throw err

  console.log('- - - - - - - - - - - - - - - - - - - -')
  console.log('XML LOADED: ' + xmlFilename)
  console.log('- - - - - - - - - - - - - - - - - - - -')

  // Remove subsubsection titles and similar
  var subsubsectionRegex = /====(.+?)====/g
  xmlArticle = xmlArticle.replace(subsubsectionRegex, '') || []

  var options = {
    args: ['-o', 'tmp', '--sections', '-q', xmlFilename]
  };

  // Run Python script
  PythonShell.run('WikiExtractor.py', options, function (err, results) {
    if (err) throw err

    // Load extracted article
    fs.readFile('tmp/AA/wiki_00', 'utf8', function(err, extractedArticle) {
      // Now we have the xml file and the clean article

      // Parse XML file
      parser.parseString(xmlArticle, function (err, result) {

        var articleTextFromXML = result.mediawiki.page[0].revision[0].text[0]._

        var sectionsRegex = /==(.+?)==/g
        var rawSections = articleTextFromXML.match(sectionsRegex) || []

        // Section titles with extra sections
        var sectionTitlesXML = rawSections.filter((element) => {
          return element.charAt(2) != '='
        })
        sectionTitlesXML = sectionTitlesXML.map(function(sectionTitle) {
          sectionTitle = sectionTitle.substring(2)
          sectionTitle = sectionTitle.substring(0, sectionTitle.length - 2)
          return sectionTitle.trim()
        })

        // Subsection titles
        var subsectionTitlesXML = rawSections.filter((element) => {
          return element.charAt(2) == '=' && element.charAt(3) != '='
        })
        subsectionTitlesXML = subsectionTitlesXML.map(function(subsectionTitle) {
          subsectionTitle = subsectionTitle.substring(3)
          subsectionTitle = subsectionTitle.substring(0, subsectionTitle.length - 2)
          return subsectionTitle.trim()
        })

        // Delete surraunding tags (<doc> ...text... <\doc>)
        var textWithTitleAndSectionTitles = extractedArticle.substring(extractedArticle.indexOf(">") + 1, extractedArticle.length - 7).trim()

        // ID
        var id = extractedArticle.split('\"')[1]
        console.log('ID: ' + id);

        // Article title
        var title = textWithTitleAndSectionTitles.substring(0, textWithTitleAndSectionTitles.indexOf("\n"))
        console.log('Title: ' + title);
        console.log('- - - - - - - - - - - - - - - - - - - -')

        // Delete the title
        var textWithSectionTitles = textWithTitleAndSectionTitles.substring(textWithTitleAndSectionTitles.indexOf("\n")).trim()

        // Subsection indexes
        var subsectionIndexes = []
        subsectionTitlesXML.forEach((subsectionTitle) => {
          var index = textWithSectionTitles.search(subsectionTitle + '.')
          if (index > -1) {
            subsectionIndexes.push(index)
            textWithSectionTitles = textWithSectionTitles.replace(subsectionTitle + '.', '')
          }
        })

        // Initialized with element 0 because it's the index of the abstract
        var sectionIndexes = [0]

        sectionTitlesXML.forEach((sectionTitle) => {
          var index = textWithSectionTitles.search(sectionTitle + '.')
          if (index > -1) {
            sectionIndexes.push(index)
            textWithSectionTitles = textWithSectionTitles.replace(sectionTitle + '.', '')
          }
        })

        sectionIndexes.sort((a, b) => {
          return a - b
        })

        var sections = []
        var abstract = ''

        // Get abstract and sections
        for (var i = 0; i < sectionIndexes.length; i++) {
          if (i == 0) {
            abstract = textWithSectionTitles.substring(sectionIndexes[i], sectionIndexes[i+1]).trim()
            // Put abstract in sections array
            sections.push(textWithSectionTitles.substring(sectionIndexes[i], sectionIndexes[i+1]).trim())
          }
          else if (i == sectionIndexes.length - 1) {
            sections.push(textWithSectionTitles.substring(sectionIndexes[i]).trim())
          }
          else {
            sections.push(textWithSectionTitles.substring(sectionIndexes[i], sectionIndexes[i+1]).trim())
          }
        }

        // Section titles have been removed
        var text = textWithSectionTitles.replace(/\r?\n|\r/g, ' ')

        ////////////// PREPROCESSING ////////////

        // Extract sentences
        var sentences = nlp.text(text).sentences

        // Expand contractions
        var expandedText = nlp.text(text.toLowerCase()).contractions.expand().text()

        // Normalize text (remove all punctation, except for dots, and 'new line')
        var normalizedText = nlp.text(expandedText).normal();

        // Remove dots, question marks, exclamation marks and brackets
        var noPointsText = normalizedText.replace(/[\.|?|!|{|}|\[|\]]/g, '')

        // Text composed only by letters and numbers (no white spaces)
        var onlyLettersAndNumbersText = noPointsText.replace(/ /g, '')

        // Words array
        words = noPointsText.split(' ')

        // Root text (she sold seashells -> she sell seashell)
        var rootText = nlp.text(expandedText).root()

        ////////////////////////////////////////////////////////////////////////
        /////////////////////////// LENGHT FEATURES ////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        // // Character count (letters and numbers)
        // var characterCount = articleJSON.onlyLettersAndNumbersText.length
        //
        // // Count words
        // var wordCount = articleJSON.words.length
        //
        // // Count syllable
        // var syllableCount = 0
        // words.forEach((word) => {
        //   syllableCount = syllableCount + nlp.term(word).syllables().length
        // })
        //
        // // Sentence count
        // var sentenceCount = articleJSON.sentences.length
        //
        // var lengthFeatures = {
        //   characterCount: characterCount,
        //   wordCount: wordCount,
        //   syllableCount: syllableCount,
        //   sentenceCount: sentenceCount
        // }
        //
        // articleJSON.features.lengthFeatures = lengthFeatures

        ////////////////////////////////////////////////////////////////////////
        //////////////////////////// STYLE FEATURES ////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        // // Largest sentence size (in words)
        // var largestSentenceSize = 0
        // articleJSON.sentences.forEach((sentence) => {
        //   // Expand contractions (i'll -> i will)
        //   var expandedSentence = nlp.text(sentence.str.toLowerCase()).contractions.expand().text()
        //   var sentenceLengthInWords = expandedSentence.split(' ').length
        //   if (sentenceLengthInWords > largestSentenceSize) {
        //     largestSentenceSize = sentenceLengthInWords
        //   }
        // })
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        // // Mean sentence size (in words)
        // var meanSentenceSize = articleJSON.features.lengthFeatures.wordCount/articleJSON.features.lengthFeatures.sentenceCount
        //
        // // Large sentence rate
        // var largeSentenceCount = 0
        // articleJSON.sentences.forEach((sentence) => {
        //   // Expand contractions (i'll -> i will)
        //   var expandedSentence = nlp.text(sentence.str.toLowerCase()).contractions.expand().text()
        //   var sentenceLengthInWords = expandedSentence.split(' ').length
        //   if (sentenceLengthInWords > meanSentenceSize + 10) {
        //     largeSentenceCount++
        //   }
        // })
        // var largeSentenceRate = largeSentenceCount/articleJSON.features.lengthFeatures.sentenceCount
        //
        // // Short sentence rate
        // var shortSentenceCount = 0
        // articleJSON.sentences.forEach((sentence) => {
        //   // Expand contractions (i'll -> i will)
        //   var expandedSentence = nlp.text(sentence.str.toLowerCase()).contractions.expand().text()
        //   var sentenceLengthInWords = expandedSentence.split(' ').length
        //   if (sentenceLengthInWords < meanSentenceSize - 5) {
        //     shortSentenceCount++
        //   }
        // })
        // var shortSentenceRate = shortSentenceCount/articleJSON.features.lengthFeatures.sentenceCount

        // // Nouns per sentence
        // var nounsPerSentence = 0
        // // ASINCRONO
        // wordpos.getNouns(rootText, (differentNouns) => {
        //   differentNouns.forEach((noun) => {
        //     var regex = new RegExp(noun, 'g');
        //     var matchCount = (noPointsText.match(regex || [])).length
        //     nounsPerSentence = nounsPerSentence + matchCount/articleJSON.features.lengthFeatures.sentenceCount
        //   })
        //   console.log(nounsPerSentence);
        // });
        //
        // // Verbs per sentence
        // var verbsPerSentence = 0
        // // ASINCRONO
        // wordpos.getVerbs(rootText, (differentVerbs) => {
        //   differentVerbs.forEach((verb) => {
        //     var regex = new RegExp(verb, 'g');
        //     var matchCount = (noPointsText.match(regex || [])).length
        //     verbsPerSentence = verbsPerSentence + matchCount/articleJSON.features.lengthFeatures.sentenceCount
        //   })
        // });

        // var styleFeatures = {
        //   largestSentenceSize: largestSentenceSize,
        //   meanSentenceSize: meanSentenceSize,
        //   largeSentenceRate: largeSentenceRate,
        //   shortSentenceCount: shortSentenceCount
        // }
        //
        // articleJSON.features.styleFeatures = styleFeatures



        // posTagger.tag(articleJSON.plainText, (pos) => {
        //   posAnalyzer.getPosTrigrams(pos.taggedWords, (posTrigrams) => {
        //     console.log(posTrigrams);
        //   })
        // })



        // posTagger.getFirstWordTags(sentences, (results) =>{
        //   posAnalyzer.getNumberOfSentencesThatStartWith(results, articleJSON.sentences, articleJSON.features.lengthFeatures.sentenceCount, (numberOfSentencesThatStartWith) => {
        //     console.log(numberOfSentencesThatStartWith);
        //   })
        // })






        articleAnalyzer.analyze(articleTextFromXML, id, title, textWithSectionTitles, subsectionIndexes, abstract, sections, text, sentences, onlyLettersAndNumbersText, words, (articleJSON) => {
          console.log(JSON.stringify(articleJSON.features, null, 2));
        })

      })
    })
  })
})








Array.prototype.min = function() {
  return Math.min.apply(null, this);
};
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};




// // LENGTH ANALYZER
// lengthAnalyzer.analyze(articleJSON.words, articleJSON.sentences, (result) => {
//   articleJSON.features.lengthFeatures = result
// })

// STRUCTURE ANALYZER
// structureAnalyzer.analyze(
//   articleJSON.sections,
//   articleJSON.subsectionIndexes,
//   articleJSON.features.lengthFeatures.characterCount,
//   articleJSON.features.lengthFeatures.wordCount,
//   articleJSON.features.lengthFeatures.sentenceCount,
//   articleJSON.textFromXML,
//   (result) => {
//     articleJSON.features.structureFeatures = result
//   }
// )

// READABILITY ANALYZER
// readabilityAnalyzer.analyze(
//   articleJSON.features.lengthFeatures.characterCount,
//   articleJSON.features.lengthFeatures.wordCount,
//   articleJSON.features.lengthFeatures.sentenceCount,
//   articleJSON.features.lengthFeatures.syllableCount,
//   articleJSON.words,
//   articleJSON.text,
//   (result) => {
//     articleJSON.features.readabilityFeatures = result
//   }
// )


// POS ANALYZER
// posAnalyzer.analyze(articleJSON.plainText, (result) => {
//   console.log(result.posTrigrams);
// })

// TRIGRAM ANALYZER
// Print sorted (desc) trigrams
// trigramAnalyzer.getPosTrigrams(articleJSON.plainText, (results) => {
//   // var sortable = _.toArray(results)
//   var sortedTrigrams = []
//   for (var result in results)
//     sortedTrigrams.push([result, results[result]])
//   sortedTrigrams.sort(
//     (a, b) => {
//       return b[1] - a[1]
//     }
//   )
//   console.log(sortedTrigrams)
// })
