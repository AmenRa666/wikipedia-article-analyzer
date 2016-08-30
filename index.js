// MODULES

var syllable = require('syllable')
var fs = require('fs')
var WordPOS = require('wordpos')

var lengthFeatureAnalyzer = require('./modules/lengthFeaturesAnalyzer')
var structureFeaturesAnalyzer = require('./modules/structureFeaturesAnalyzer')
var styleFeaturesAnalyzer = require('./modules/styleFeaturesAnalyzer')
var lexicalFeaturesAnalyzer = require('./modules/lexicalFeaturesAnalyzer')


// LOGIC

var wordpos = new WordPOS()

var filename = process.argv[2]

var article = {
  lengthFeature: {
    characters: 0,
    syllables: 0,
    words: 0,
    sentences: 0
  },
  structureFeature: {
    paragraphs: 0,
    meanParagraphSize: 0
  },
  styleFeature: {
    largestSentenceSize: 0,
    meanSentenceSize: 0,
    largeSentenceRate: 0,
    shortSentenceRatentencerate: 0
  }
}

// var a = syllable('syllable')
// console.log(a)


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

  // Now the article text is clean

  // console.log(text)

  console.log('- - - - - - - - - - - - - - - - - - - -')

  // ************************************************************************ //

  // lengthFeatureAnalyzer.analyze(text, (results) => {
  //   article.lengthFeature.characters = results.characters
  //   article.lengthFeature.syllables = results.syllables
  //   article.lengthFeature.words = results.words
  //   article.lengthFeature.sentences = results.sentences
  // })

  // styleFeaturesAnalyzer.analyze(text, (results) => {
  //   console.log(results);
  // })


  lexicalFeaturesAnalyzer.analyze(text, (results) => {
    console.log(results);
  })


  // Count characters
  // var characterCount = text.length
  // console.log('Characters: ' + characterCount);


  // ************************************************************************ //
//   console.log('STRUCTURE FEATURES');
//
//   var paragraphs = text.split('\n')
//
//   // Count paragraphs
//   var paragraphCount = paragraphs.length
//   console.log('Paragraphs: ' + paragraphCount);
//
//   // Mean paragraph size (in words)
//   var meanParagraphSize = parseInt(wordCount/13)
//   console.log('Mean paragraph size: ' + meanParagraphSize + ' words');
//
//   console.log('- - - - - - - - - - - - - - - - - - - -')
//
//   // ************************************************************************ //
//   console.log('STYLE FEATURES');
//

  // console.log('Largest sentence size: ' + largestSentenceSize + ' words');
  //
  // console.log('Mean sentence size: ' + meanSentenceSize + ' words');
  //
  // console.log('Large sentence rate: ' + largeSentenceRate);
  //
  // console.log('Short sentence rate: ' + shortSentenceRate);
  //
  // console.log('Nouns per sentence: ' + nounsPerSentence);
  // Noun per sentence



//
//
//
//   console.log('- - - - - - - - - - - - - - - - - - - -')
})











































//
