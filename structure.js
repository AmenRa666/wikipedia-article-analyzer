// MODULES

var fs = require('fs')
var xml2js = require('xml2js')


// LOGIC

var filename = process.argv[2]
var parser = new xml2js.Parser()

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

  parser.parseString(data, function (err, result) {
    // console.dir(result)
    console.log('Done')

    // console.log(result.mediawiki.page)
    // console.log(result.mediawiki.page[0].revision[0].text)

    var articleText = result.mediawiki.page[0].revision[0].text[0]._

    var sectionsRegex = /==(.+?)==/g
    var rawSections = articleText.match(sectionsRegex) || []

    // Section count
    var sectionTitles = rawSections.filter((element) => {
      return element.charAt(2) != '='
    })
    var sectionCount = sectionTitles.length

    // Subsection count
    var subsectionTitles = rawSections.filter((element) => {
      return element.charAt(2) == '=' && element.charAt(3) != '='
    })
    var subsectionCount = subsectionTitles.length

    var sections = articleText.split(sectionTitles[0])

    console.log(sections.length);


  //
  //   // var sectionCount = (articleText.match(/=+=/g || []).length
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
  // const res = articleText.match(regex) || []
  // console.log(rawSections)
  })
})
