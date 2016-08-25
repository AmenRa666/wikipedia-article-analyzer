// MODULES

var syllable = require('syllable')
var fs = require('fs')

// LOGIC

var filename = process.argv[2]

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
  // Delete the title
  text = text.substring(text.indexOf("\n") + 2)
  // Delete the closing 'doc' tag
  text = text.substring(0, text.indexOf("</doc>") - 3)

  // Now the article text is clean

  // console.log(text)

  // ************************************************************************ //
  console.log('LENGTH FEATURES');

  // Count characters
  var characterCount = text.length
  console.log('Characters: ' + characterCount);

  // Count syllables
  var syllableCount = syllable(text)
  console.log('Syllables: ' + syllableCount)

  // Count words
  var wordCount = text.split(' ').length
  console.log('Words: ' + wordCount);

  // Count words
  var sentenceCount = text.split('. ').length + text.split('.\n').length
  console.log('Sentences: ' + sentenceCount);

  console.log('- - - - - - - - - - - - - - - - - - - -')

  // ************************************************************************ //
  console.log('STRUCTURE FEATURES');

  // Count paragraphs
  var paragraphCount = (text.match(/\n/g) || []).length + 1
  console.log('Paragraphs: ' + paragraphCount);

  console.log('- - - - - - - - - - - - - - - - - - - -')
})
