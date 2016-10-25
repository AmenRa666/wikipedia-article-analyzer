// MODULES
var PythonShell = require('python-shell');
var fs = require('fs')
var xml2js = require('xml2js')
var nlp = require('nlp_compromise')
nlp.plugin(require('nlp-syllables'))
var math = require('mathjs')
var _ = require('underscore')
var async = require('async')
 var time = require('node-tictoc');
// Analizer
var articleAnalyzer = require('./articleAnalyzer.js')
// Database Agent
var dbAgent = require('./dbAgent.js')
// XML Parser
var parser = new xml2js.Parser()

// LOGIC
// var listsFolder = 'articleLists/'
// var articleLists = ['featuredArticleList.txt', 'aClassArticleList.txt', 'goodArticleList.txt', 'bClassArticleList.txt', 'cClassArticleList.txt', 'startArticleList.txt', 'stubArticleList.txt']
var folder = 'articlesXML/'
var paths = ['featuredArticlesXML/','aClassArticlesXML/', 'goodArticlesXML/', 'bClassArticlesXML/', 'cClassArticlesXML/', 'startArticlesXML/', 'stubArticlesXML/']
// var paths = ['cClassArticlesXML/', 'startArticlesXML/', 'stubArticlesXML/']
var pathIndex = 0
var qualityClass = 7


const load = (file, cb) => {

  var _title = file.replace(/_/g, ' ').replace(/\.xml/, '').trim()

  var xmlFilename = folder + paths[pathIndex] + file

  // Read the file and print its contents.
  fs.readFile(xmlFilename, 'utf8', function(err, xmlArticle) {
    if (err) throw err

    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('XML LOADED: ' + file)
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

          dbAgent.findById(id, (doc) => {
            if (doc) {
              console.log('Article Found in DB');
              cb(null, 'Article Found in DB')
            }
            else {
              console.log('Article NOT Found in DB');
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


              articleAnalyzer.analyze(articleTextFromXML, id, title, textWithSectionTitles, subsectionIndexes, abstract, sections, text, sentences, onlyLettersAndNumbersText, words, (articleJSON) => {
                // console.log(JSON.stringify(articleJSON.features, null, 2));

                var article = {
                  id: id,
                  title: title,
                  // Length Features
                  characterCount: articleJSON.features.lengthFeatures.characterCount,
                  wordCount: articleJSON.features.lengthFeatures.wordCount,
                  syllableCount: articleJSON.features.lengthFeatures.syllableCount,
                  sentenceCount: articleJSON.features.lengthFeatures.sentenceCount,
                  // Structure Features
                  sectionCount: articleJSON.features.structureFeatures.sectionCount,
                  subsectionCount: articleJSON.features.structureFeatures.subsectionCount,
                  paragraphCount: articleJSON.features.structureFeatures.paragraphCount,
                  meanSectionSize: articleJSON.features.structureFeatures.meanSectionSize,
                  meanParagraphSize: articleJSON.features.structureFeatures.meanParagraphSize,
                  largestSectionSize: articleJSON.features.structureFeatures.largestSectionSize,
                  shortestSectionSize: articleJSON.features.structureFeatures.shortestSectionSize,
                  largestShortestSectionRatio: articleJSON.features.structureFeatures.largestShortestSectionRatio,
                  sectionSizeStandardDeviation: articleJSON.features.structureFeatures.sectionSizeStandardDeviation,
                  meanOfSubsectionsPerSection: articleJSON.features.structureFeatures.meanOfSubsectionsPerSection,
                  abstractSize: articleJSON.features.structureFeatures.abstractSize,
                  abstractSizeArtcileLengthRatio: articleJSON.features.structureFeatures.abstractSizeArtcileLengthRatio,
                  citationCount: articleJSON.features.structureFeatures.citationCount,
                  citationCountPerSentence: articleJSON.features.structureFeatures.citationCountPerSentence,
                  citationCountPerSection: articleJSON.features.structureFeatures.citationCountPerSection,
                  externalLinksCount: articleJSON.features.structureFeatures.externalLinksCount,
                  externalLinksPerSentence: articleJSON.features.structureFeatures.externalLinksPerSentence,
                  externalLinksPerSection: articleJSON.features.structureFeatures.externalLinksPerSection,
                  imageCount: articleJSON.features.structureFeatures.imageCount,
                  imagePerSentence: articleJSON.features.structureFeatures.imagePerSentence,
                  imagePerSection: articleJSON.features.structureFeatures.imagePerSection,
                  // Style Features
                  meanSentenceSize: articleJSON.features.styleFeatures.meanSentenceSize,
                  largestSentenceSize: articleJSON.features.styleFeatures.largestSentenceSize,
                  shortestSentenceSize: articleJSON.features.styleFeatures.shortestSentenceSize,
                  largeSentenceRate: articleJSON.features.styleFeatures.largeSentenceRate,
                  shortSentenceRate: articleJSON.features.styleFeatures.shortSentenceRate,
                  questionCount: articleJSON.features.styleFeatures.questionCount,
                  questionRatio: articleJSON.features.styleFeatures.questionRatio,
                  exclamationCount: articleJSON.features.styleFeatures.exclamationCount,
                  exclamationRatio: articleJSON.features.styleFeatures.exclamationRatio,
                  toBeVerbCount: articleJSON.features.styleFeatures.toBeVerbCount,
                  toBeVerbRatio: articleJSON.features.styleFeatures.toBeVerbRatio,
                  toBeVerbPerSentence: articleJSON.features.styleFeatures.toBeVerbPerSentence,
                  toBeVerbRate: articleJSON.features.styleFeatures.toBeVerbRate,
                  // Readability Features
                  automatedReadabilityIndex: articleJSON.features.readabilityFeatures.automatedReadabilityIndex,
                  colemanLiauIndex: articleJSON.features.readabilityFeatures.colemanLiauIndex,
                  fleshReadingEase: articleJSON.features.readabilityFeatures.fleshReadingEase,
                  fleschKincaidGradeLevel: articleJSON.features.readabilityFeatures.fleschKincaidGradeLevel,
                  gunningFogIndex: articleJSON.features.readabilityFeatures.gunningFogIndex,
                  lasbarhetsIndex: articleJSON.features.readabilityFeatures.lasbarhetsIndex,
                  smogGrading: articleJSON.features.readabilityFeatures.smogGrading,
                  linsearWriteFormula: articleJSON.features.readabilityFeatures.linsearWriteFormula,
                  daleChallReadabilityFormula: articleJSON.features.readabilityFeatures.daleChallReadabilityFormula,
                  // Lexical Features
                  differentWordCount: articleJSON.features.lexicalFeatures.differentWordCount,
                  differentWordsPerSentence: articleJSON.features.lexicalFeatures.differentWordsPerSentence,
                  differentWordsRate: articleJSON.features.lexicalFeatures.differentWordsRate,
                  nounCount: articleJSON.features.lexicalFeatures.nounCount,
                  nounsPerSentence: articleJSON.features.lexicalFeatures.nounsPerSentence,
                  nounsRate: articleJSON.features.lexicalFeatures.nounsRate,
                  differentNounCount: articleJSON.features.lexicalFeatures.differentNounCount,
                  differentNounsPerSentence: articleJSON.features.lexicalFeatures.differentNounsPerSentence,
                  differentNounsRate: articleJSON.features.lexicalFeatures.differentNounsRate,
                  verbCount: articleJSON.features.lexicalFeatures.verbCount,
                  verbsPerSentence: articleJSON.features.lexicalFeatures.verbsPerSentence,
                  verbsRate: articleJSON.features.lexicalFeatures.verbsRate,
                  differentVerbCount: articleJSON.features.lexicalFeatures.differentVerbCount,
                  differentVerbsPerSentence: articleJSON.features.lexicalFeatures.differentVerbsPerSentence,
                  differentVerbsRate: articleJSON.features.lexicalFeatures.differentVerbsRate,
                  pronounCount: articleJSON.features.lexicalFeatures.pronounCount,
                  pronounsPerSentence: articleJSON.features.lexicalFeatures.pronounsPerSentence,
                  pronounsRate: articleJSON.features.lexicalFeatures.pronounsRate,
                  differentPronounCount: articleJSON.features.lexicalFeatures.differentPronounCount,
                  differentPronounsPerSentence: articleJSON.features.lexicalFeatures.differentPronounsPerSentence,
                  differentPronounsRate: articleJSON.features.lexicalFeatures.differentPronounsRate,
                  adjectiveCount: articleJSON.features.lexicalFeatures.adjectiveCount,
                  adjectivesPerSentence: articleJSON.features.lexicalFeatures.adjectivesPerSentence,
                  adjectivesRate: articleJSON.features.adjectivesRate,
                  differentAdjectiveCount: articleJSON.features.lexicalFeatures.differentAdjectiveCount,
                  differentAdjectivesPerSentence: articleJSON.features.lexicalFeatures.differentAdjectivesPerSentence,
                  differentAdjectivesRate: articleJSON.features.lexicalFeatures.differentAdjectivesRate,
                  adverbCount: articleJSON.features.lexicalFeatures.adverbCount,
                  adverbsPerSentence: articleJSON.features.lexicalFeatures.adverbsPerSentence,
                  adverbsRate: articleJSON.features.lexicalFeatures.adverbsRate,
                  differentAdverbCount: articleJSON.features.lexicalFeatures.differentAdverbCount,
                  differentAdverbsPerSentence: articleJSON.features.lexicalFeatures.differentAdverbsPerSentence,
                  differentAdverbsRate: articleJSON.features.lexicalFeatures.differentAdverbsRate,
                  coordinatingConjunctionCount: articleJSON.features.lexicalFeatures.coordinatingConjunctionCount,
                  coordinatingConjunctionsPerSentence: articleJSON.features.lexicalFeatures.coordinatingConjunctionsPerSentence,
                  coordinatingConjunctionsRate: articleJSON.features.lexicalFeatures.coordinatingConjunctionsPerSentence,
                  differentCoordinatingConjunctionCount: articleJSON.features.lexicalFeatures.differentCoordinatingConjunctionCount,
                  differentCoordinatingConjunctionsPerSentence: articleJSON.features.lexicalFeatures.differentCoordinatingConjunctionsPerSentence,
                  differentCoordinatingConjunctionsRate: articleJSON.features.lexicalFeatures.differentCoordinatingConjunctionsRate,
                  subordinatingPrepositionAndConjunctionCount: articleJSON.features.lexicalFeatures.subordinatingPrepositionAndConjunctionCount,
                  subordinatingPrepositionsAndConjunctionsPerSentence: articleJSON.features.lexicalFeatures.subordinatingPrepositionsAndConjunctionsPerSentence,
                  subordinatingPrepositionsAndConjunctionsRate: articleJSON.features.lexicalFeatures.subordinatingPrepositionsAndConjunctionsRate,
                  differentSubordinatingPrepositionAndConjunctionCount: articleJSON.features.lexicalFeatures.differentSubordinatingPrepositionAndConjunctionCount,
                  differentSubordinatingPrepositionsAndConjunctionsPerSentence: articleJSON.features.lexicalFeatures.differentSubordinatingPrepositionsAndConjunctionsPerSentence,
                  differentSubordinatingPrepositionsAndConjunctionsRate: articleJSON.features.lexicalFeatures.differentSubordinatingPrepositionsAndConjunctionsRate,
                  syllablesPerWord: articleJSON.features.lexicalFeatures.syllablesPerWord,
                  charactersPerWord: articleJSON.features.lexicalFeatures.charactersPerWord,
                  // Quality Class
                  qualityClass: qualityClass
                }
                dbAgent.insert(article, cb)

              })

            }
          })



        })
      })
    })
  })

}

// const readFile = (filename, cb) => {
//   fs.readFile(listsFolder + filename, 'utf8', function(err, data) {
//     if (err) throw err;
//     console.log(filename + ': LOADED');
//     var titles = data.trim().split('\n')
//     for (var i = 0; i < titles.length; i++) {
//       titles[i] = decodeURI(titles[i].trim())
//     }
//     console.log('Articles analysis: STARTING');
//     async.eachSeries(
//       titles,
//       load,
//       (err, result) => {
//       if (err) {
//         console.log(err);
//       }
//       else {
//         qualityClass--
//         console.log('Articles analysis: DONE');
//       }
//     })
//   })
// }



const readAllFiles = (path, cb) => {
  fs.readdir(folder + path, (err, files) => {
    if (err) console.log(err);
    else {
      console.log('Articles analysis: STARTING');
      async.eachSeries(
        files,
        load,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          else {
            pathIndex++
            qualityClass--
            console.log('Articles analysis: DONE');
            cb(null, 'Read All Files')
        }
      })
    }
  })
}



time.tic();

async.eachSeries(
  paths,
  readAllFiles,
  (err, result) => {
    if (err) console.log(err);
    else console.log('All articles have been analyzed!');
  }
)

time.toc();
