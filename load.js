// Modules
var PythonShell = require('python-shell');
var fs = require('fs')
var xml2js = require('xml2js')
var nlp = require('nlp_compromise')
nlp.plugin(require('nlp-syllables'))
var WordPOS = require('wordpos')
var math = require('mathjs')
var natural = require('natural')
var _ = require('underscore')
// Readability Modules
var automatedReadability = require('automated-readability')
var colemanLiau = require('coleman-liau')
var flesch = require('flesch')
var fleschKincaid = require('flesch-kincaid')
var gunningFog = require('gunning-fog')
var smogFormula = require('smog-formula');
var daleChallFormula = require('dale-chall-formula')
var daleChall = require('dale-chall');
// Analizers
var posAnalyzer = require('./analyzers/posAnalyzer.js')
var trigramAnalyzer = require('./analyzers/trigramAnalyzer.js')


// Logic
var xmlFilename = process.argv[2]
var parser = new xml2js.Parser()
var wordpos = new WordPOS()


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

        var articleJSON = {
          id: id,
          title: title,
          abstract: '',
          text: textWithSectionTitles,
          textFromXML: articleTextFromXML,
          plainText: '',
          onlyLettersAndNumbersText: '',
          words: [],
          sections: [],
          sentences: [],
          features: {
            lengthFeatures: {},
            structureFeatures : {},
            styleFeatures: {},
            readabilityFeatures: {}
          }
        }

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

        // Log abstract and sections
        // for (var i = 0; i < sectionIndexes.length; i++) {
        //   if (i == sectionIndexes.length - 1) {
        //     console.log(textWithSectionTitles.substring(sectionIndexes[i]).trim());
        //     console.log('- - - - - - - - - - - - - - - - - - - -')
        //   }
        //   else {
        //     console.log(textWithSectionTitles.substring(sectionIndexes[i], sectionIndexes[i+1]).trim());
        //     console.log('- - - - - - - - - - - - - - - - - - - -')
        //   }
        // }

        // Get abstract and sections
        for (var i = 0; i < sectionIndexes.length; i++) {
          if (i == 0) {
            articleJSON.abstract = textWithSectionTitles.substring(sectionIndexes[i], sectionIndexes[i+1]).trim()
            // Put abstract in sections array
            articleJSON.sections.push(textWithSectionTitles.substring(sectionIndexes[i], sectionIndexes[i+1]).trim())
          }
          else if (i == sectionIndexes.length - 1) {
            articleJSON.sections.push(textWithSectionTitles.substring(sectionIndexes[i]).trim())
          }
          else {
            articleJSON.sections.push(textWithSectionTitles.substring(sectionIndexes[i], sectionIndexes[i+1]).trim())
          }
        }

        // Section titles have been removed
        var text = textWithSectionTitles.replace(/\r?\n|\r/g, ' ')
        articleJSON.plainText = text

        ////////////// PREPROCESSING ////////////

        // Extract sentences
        var sentences = nlp.text(text).sentences
        articleJSON.sentences = sentences

        // Expand contractions
        var expandedText = nlp.text(text).contractions.expand().text()

        // Normalize text (remove all punctation, except for dots, and 'new line')
        var normalizedText = nlp.text(expandedText).normal();

        // Remove dots, question marks, exclamation marks and brackets
        var noPointsText = normalizedText.replace(/[\.|?|!|{|}|\[|\]]/g, '')

        // Text composed only by letters and numbers (no white spaces)
        var onlyLettersAndNumbersText = noPointsText.replace(/ /g, '')
        articleJSON.onlyLettersAndNumbersText = onlyLettersAndNumbersText

        // Words array
        var words = noPointsText.split(' ')
        articleJSON.words = words

        // Root text (she sold seashells -> she sell seashell)
        var rootText = nlp.text(expandedText).root()

        ////////////////////////////////////////////////////////////////////////
        /////////////////////////// LENGHT FEATURES ////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        // Character count (letters and numbers)
        var characterCount = articleJSON.onlyLettersAndNumbersText.length

        // Count words
        var wordCount = articleJSON.words.length

        // Count syllable
        var syllableCount = 0
        words.forEach((word) => {
          syllableCount = syllableCount + nlp.term(word).syllables().length
        })

        // Sentence count
        var sentenceCount = articleJSON.sentences.length

        var lengthFeatures = {
          characterCount: characterCount,
          wordCount: wordCount,
          syllableCount: syllableCount,
          sentenceCount: sentenceCount
        }

        articleJSON.features.lengthFeatures = lengthFeatures

        ////////////////////////////////////////////////////////////////////////
        ////////////////////////// STRUCTURE FEATURES //////////////////////////
        ////////////////////////////////////////////////////////////////////////

        // Section count (abstract included)
        var sectionCount = articleJSON.sections.length

        // Subsection count
        var subsectionCount = subsectionIndexes.length

        // Paragraph count
        var paragraphCount = 0
        articleJSON.sections.forEach((section) => {
          paragraphCount = paragraphCount + section.split('.\n').length
        })

        // Mean section size (in characters (letters and numbers))
        var meanSectionSize = articleJSON.features.lengthFeatures.characterCount/sectionCount

        // Mean paragraph count (in words)
        var meanParagraphSize = articleJSON.features.lengthFeatures.wordCount/paragraphCount

        // Section sizes
        var sectionSizes = []
        articleJSON.sections.forEach((section) => {
          // Expand contractions
          var expandedSectionText = nlp.text(section).contractions.expand().text()
          // Normalize text (remove all punctation, except for dots, and 'new line')
          var normalizedSectionText = nlp.text(expandedSectionText).normal();
          // Remove dots, question marks, exclamation marks and brackets
          var noPointsSectionText = normalizedSectionText.replace(/[\.|?|!|{|}|\[|\]]/g, '')
          var sectionSize = noPointsSectionText.replace(/ /g, '').length
          sectionSizes.push(sectionSize)
        })

        // Size of the largest section (in characters (letters and numbers))
        var largestSectionSize = sectionSizes.max()

        // Size of the shortest section (in characters (letters and numbers))
        var shortestSectionSize = sectionSizes.min()

        // Largest-Shortest section ratio
        var largestShortestSectionRatio = largestSectionSize/shortestSectionSize

        // Standard deviation of the section size
        var sectionSizeStandardDeviation = math.std(sectionSizes)

        // Mean of subsections per section
        var meanOfSubsectionsPerSection = subsectionCount/sectionCount

        // Abstract size (in characters (letters and numbers))
        var abstractSize = sectionSizes[0]

        // Abstract size-ArtcileLength ratio
        var abstractSizeArtcileLengthRatio = abstractSize/articleJSON.features.lengthFeatures.characterCount

        // Citation count
        var citationsRegex = /<ref|&lt;ref|{{sfn\|/g
        var citationCount = (articleJSON.textFromXML.toLowerCase().match(citationsRegex) || []).length

        // Citation count per text length (number of sentences)
        var citationCountPerTextLength = citationCount/articleJSON.features.lengthFeatures.sentenceCount

        // Citation count per section
        var citationCountPerSection = citationCount/sectionCount

        // External links count
        var webURLRegex = /\|url=|\| url=|url =| url =|\[http/g
        var externalLinksCount = (articleJSON.textFromXML.toLowerCase().match(webURLRegex) || []).length

        // External links per text length (number of sentences)
        var externalLinksPerTextLength = externalLinksCount/articleJSON.features.lengthFeatures.sentenceCount

        // External links per text length (number of sentences)
        var externalLinksPerSection = externalLinksCount/sectionCount

        // Image count (It's not perfect because of Wikipedia syntax)
        var imageRegex = /\[\[file:|\[\[image:/g
        var imageCount = (articleJSON.textFromXML.toLowerCase().match(imageRegex) || []).length

        // Image per text length (number of sentence)
        var imagePerTextLength = imageCount/articleJSON.features.lengthFeatures.sentenceCount

        // Image per section
        var imagePerSection = imageCount/sectionCount

        var structureFeatures = {
          sectionCount: sectionCount,
          subsectionCount: subsectionCount,
          paragraphCount: paragraphCount,
          meanSectionSize: meanSectionSize,
          meanParagraphSize: meanParagraphSize,
          largestSectionSize: largestSectionSize,
          shortestSectionSize:shortestSectionSize,
          largestShortestSectionRatio: largestShortestSectionRatio,
          sectionSizeStandardDeviation: sectionSizeStandardDeviation,
          meanOfSubsectionsPerSection: meanOfSubsectionsPerSection,
          abstractSize: abstractSize,
          abstractSizeArtcileLengthRatio: abstractSizeArtcileLengthRatio,
          citationCount: citationCount,
          citationCountPerTextLength: citationCountPerTextLength,
          citationCountPerSection: citationCountPerSection,
          externalLinksCount: externalLinksCount,
          externalLinksPerTextLength: externalLinksPerTextLength,
          externalLinksPerSection: externalLinksPerSection,
          imageCount: imageCount,
          imagePerTextLength: imagePerTextLength,
          imagePerSection: imagePerSection
        }

        articleJSON.features.structureFeatures = structureFeatures

        ////////////////////////////////////////////////////////////////////////
        //////////////////////////// STYLE FEATURES ////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        // Largest sentence size (in words)
        var largestSentenceSize = 0
        articleJSON.sentences.forEach((sentence) => {
          // Expand contractions (i'll -> i will)
          var expandedSentence = sentence.contractions.expand().text()
          var sentenceLengthInWords = expandedSentence.split(' ').length
          if (sentenceLengthInWords > largestSentenceSize) {
            largestSentenceSize = sentenceLengthInWords
          }
        })

        // Mean sentence size (in words)
        var meanSentenceSize = articleJSON.features.lengthFeatures.wordCount/articleJSON.features.lengthFeatures.sentenceCount

        // Large sentence rate
        var largeSentenceCount = 0
        articleJSON.sentences.forEach((sentence) => {
          // Expand contractions (i'll -> i will)
          var expandedSentence = sentence.contractions.expand().text()
          var sentenceLengthInWords = expandedSentence.split(' ').length
          if (sentenceLengthInWords > meanSentenceSize + 10) {
            largeSentenceCount++
          }
        })
        var largeSentenceRate = largeSentenceCount/articleJSON.features.lengthFeatures.sentenceCount

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
        var shortSentenceRate = shortSentenceCount/articleJSON.features.lengthFeatures.sentenceCount

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

        var styleFeatures = {
          largestSentenceSize: largestSentenceSize,
          meanSentenceSize: meanSentenceSize,
          largeSentenceRate: largeSentenceRate,
          shortSentenceCount: shortSentenceCount
        }

        articleJSON.features.styleFeatures = styleFeatures






















        ////////////////////////////////////////////////////////////////////////
        ///////////////////////// READABILITY FEATURES /////////////////////////
        ////////////////////////////////////////////////////////////////////////

        // // Complex words count
        // var complexWordCount = articleJSON.words.filter((word) => {
        //   return nlp.term(word).syllables().length >= 3
        // }).length
        //
        // // Dale-Chall complex word count
        // var daleChallComplexWordCount = articleJSON.words.filter((word) => {
        //   return daleChall.indexOf(word.toLowerCase()) == -1
        // }).length
        //
        // // Long words count
        // var longWordCount = articleJSON.words.filter(function (word) {
        //   return word.length > 6
        // }).length

        // Complex words count
        var complexWordCount = 0

        // Dale-Chall complex word count
        var daleChallComplexWordCount = 0

        // Long words count
        var longWordCount = 0

        articleJSON.words.forEach((word) => {
          if (nlp.term(word).syllables().length >= 3) {
            complexWordCount++
          }
          if (daleChall.indexOf(word.toLowerCase()) == -1) {
            daleChallComplexWordCount++
          }
          if (word.length > 6) {
            longWordCount++
          }
        })

        var characterCount = articleJSON.features.lengthFeatures.characterCount
        var wordCount = articleJSON.features.lengthFeatures.wordCount
        var sentenceCount = articleJSON.features.lengthFeatures.sentenceCount
        var syllableCount = articleJSON.features.lengthFeatures.syllableCount

        // Periods count
        var periodCount = sentenceCount + (articleJSON.text.match(/:/g) || []).length

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
        var lix = (wordCount/periodCount) + (longWordCount*100/wordCount)

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

        /////////////////////// READABILITY FEATURES END ///////////////////////

        var readabilityFeatures = {
          automatedReadabilityIndex: ari,
          colemanLiauIndex: cli,
          fleshReadingEase: fre,
          fleschKincaidGradeLevel: fkgl,
          gunningFogIndex: gfi,
          lasbarhetsIndex: lix,
          smogGrading: smog,
          linsearWriteFormula: lwf,
          daleChallReadabilityFormula: dc
        }

        articleJSON.features.readabilityFeatures = readabilityFeatures

        console.log(articleJSON.features.readabilityFeatures);









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
