// Modules
var PythonShell = require('python-shell');
var fs = require('fs')
var xml2js = require('xml2js')
var nlp = require('nlp_compromise')
nlp.plugin(require('nlp-syllables'))
var WordPOS = require('wordpos')


// Logic
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

        var articleJSON = {
          id: id,
          title: title,
          abstract: '',
          text: textWithSectionTitles,
          sections: [],
          features: {
            lengthFeatures: {},
            structureFeatures : {}
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
          }
          else if (i == sectionIndexes.length - 1) {
            articleJSON.sections.push(textWithSectionTitles.substring(sectionIndexes[i]).trim())
          }
          else {
            articleJSON.sections.push(textWithSectionTitles.substring(sectionIndexes[i], sectionIndexes[i+1]).trim())
          }
        }

        // Section titles have been removed
        var text = textWithSectionTitles

        ////////////// PREPROCESSING ////////////

        // Extract sentences
        var sentences = nlp.text(text).sentences

        // Expand contractions
        var expandedText = nlp.text(text).contractions.expand().text()
        // console.log(expandedText);

        // Normalize text (remove all punctation, except for dots, and 'new line')
        var normalizedText = nlp.text(expandedText).normal();

        // Remove dots, question marks, exclamation marks and brackets
        var noPointsText = normalizedText.replace(/[\.|?|!|{|}|\[|\]]/g, '')

        // Root text (she sold seashells -> she sell seashell)
        var rootText = nlp.text(expandedText).root()

        //     DA USARE ASSOLUTAMENTE !!!!!!!!!!!
        // wordpos.getPOS(rootText, console.log)

        ////////////////////////////////////////////////////////////////////////
        /////////////////////////// LENGHT FEATURES ////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        // Character count (letters and numbers)
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

        // Sentence count
        var sentenceCount = sentences.length

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
        var meanParagraphCount = articleJSON.features.lengthFeatures.wordCount/paragraphCount

        // Size of the largest section (in characters (letters and numbers))
        var largestSectionSize = 0
        articleJSON.sections.forEach((section) => {
          // Expand contractions
          var expandedSectionText = nlp.text(section).contractions.expand().text()
          // Normalize text (remove all punctation, except for dots, and 'new line')
          var normalizedSectionText = nlp.text(expandedSectionText).normal();
          // Remove dots, question marks, exclamation marks and brackets
          var noPointsSectionText = normalizedSectionText.replace(/[\.|?|!|{|}|\[|\]]/g, '')
          var sectionSize = noPointsSectionText.replace(/ /g, '').length
          if (sectionSize > largestSectionSize) {
            largestSectionSize = sectionSize
          }
        })

        // Size of the shortest section (in characters (letters and numbers))
        var shortestSectionSize = largestSectionSize
        articleJSON.sections.forEach((section) => {
          // Expand contractions
          var expandedSectionText = nlp.text(section).contractions.expand().text()
          // Normalize text (remove all punctation, except for dots, and 'new line')
          var normalizedSectionText = nlp.text(expandedSectionText).normal();
          // Remove dots, question marks, exclamation marks and brackets
          var noPointsSectionText = normalizedSectionText.replace(/[\.|?|!|{|}|\[|\]]/g, '')
          var sectionSize = noPointsSectionText.replace(/ /g, '').length
          if (sectionSize < shortestSectionSize) {
            shortestSectionSize = sectionSize
          }
        })

        // Largest-Shortest section ratio
        var largestShortestSectionRatio = largestSectionSize/shortestSectionSize

        var structureFeatures = {
          sectionCount: sectionCount,
          subsectionCount: subsectionCount,
          paragraphCount: paragraphCount,
          meanSectionSize: meanSectionSize,
          meanParagraphCount: meanParagraphCount,
          largestSectionSize: largestSectionSize,
          shortestSectionSize:shortestSectionSize,
          largestShortestSectionRatio: largestShortestSectionRatio

        }

        articleJSON.features.structureFeatures = structureFeatures

        console.log(articleJSON.features);







      })







    })


  })

})




Array.prototype.min = function() {
  return Math.min.apply(null, this);
};
