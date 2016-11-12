// MODULES
var PythonShell = require('python-shell')
var fs = require('fs')
var xml2js = require('xml2js')
var nlp = require('nlp_compromise')
nlp.plugin(require('nlp-syllables'))
var math = require('mathjs')
var _ = require('underscore')
var async = require('async')
var time = require('node-tictoc')
var jsonfile = require('jsonfile')
var mkdirp = require('mkdirp')
// Analizer
var articleAnalyzer = require('./articleAnalyzer.js')
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
  fs.readFile(xmlFilename, 'utf8', (err, xmlArticle) => {
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
    PythonShell.run('WikiExtractor.py', options, (err, results) => {
      if (err) throw err

      // Load extracted article
      fs.readFile('tmp/AA/wiki_00', 'utf8', (err, extractedArticle) => {
        if (err) throw err
        // Now we have the xml file and the clean article

        // Parse XML file
        parser.parseString(xmlArticle, (err, result) => {
          if (err) throw err

          var articleTextFromXML = result.mediawiki.page[0].revision[0].text[0]._

          var sectionsRegex = /==(.+?)==/g
          var rawSections = articleTextFromXML.match(sectionsRegex) || []

          // Section titles with extra sections
          var sectionTitlesXML = rawSections.filter((element) => {
            return element.charAt(2) != '='
          })
          sectionTitlesXML = sectionTitlesXML.map((sectionTitle) => {
            sectionTitle = sectionTitle.substring(2)
            sectionTitle = sectionTitle.substring(0, sectionTitle.length - 2)
            return sectionTitle.trim()
          })

          // Subsection titles
          var subsectionTitlesXML = rawSections.filter((element) => {
            return element.charAt(2) == '=' && element.charAt(3) != '='
          })
          subsectionTitlesXML = subsectionTitlesXML.map((subsectionTitle) => {
            subsectionTitle = subsectionTitle.substring(3)
            subsectionTitle = subsectionTitle.substring(0, subsectionTitle.length - 2)
            return subsectionTitle.trim()
          })

          // Delete surraunding tags (<doc> ...text... <\doc>)
          var textWithTitleAndSectionTitles = extractedArticle.substring(extractedArticle.indexOf(">") + 1, extractedArticle.length - 7).trim()

          // ID
          var id = extractedArticle.split('\"')[1]

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
            var subsectionPattern = subsectionTitle.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g'), '\\$&') + '.'
            var regex = new RegExp(subsectionPattern, '')
            var index = textWithSectionTitles.search(regex)
            if (index > -1) {
              subsectionIndexes.push(index)
              textWithSectionTitles = textWithSectionTitles.replace(subsectionTitle + '.', '')
            }
          })

          // Initialized with element 0 because it's the index of the abstract
          var sectionIndexes = [0]
          sectionTitlesXML.forEach((sectionTitle) => {
            var sectionPattern = sectionTitle.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g'), '\\$&')
            var index = textWithSectionTitles.search(sectionPattern + '.')
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
          for (let i = 0; i < sectionIndexes.length; i++) {
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

            var trigrams = articleJSON.features.trigrams

            // Print trigrams
            var trigramObj = {
              posTrigrams: trigrams.posTrigrams,
              characterTrigrams: trigrams.characterTrigrams,
              qualityClass: qualityClass
            }
            var fileToSave = id + '.json'
            var trigramPath = 'trigrams/'
            mkdirp(trigramPath, (err) => {
              if (err) throw err
              jsonfile.writeFile(trigramPath + fileToSave, trigramObj, {spaces: 2}, (err) => {
                if (err) throw err
                cb(null, 'Trigrams Saved')
              })
            })

          })



        })
      })
    })
  })

}

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
    console.log('Time elapsed: ');
    time.toc()
    process.exit()
  }
)
