// MODULES
var async = require('async')
var nlp = require('nlp_compromise')
var math = require('mathjs')


// LOGIC
var structureFeatures = {
  sectionCount: 0,
  subsectionCount: 0,
  paragraphCount: 0,
  meanSectionSize: 0,
  meanParagraphSize: 0,
  largestSectionSize: 0,
  shortestSectionSize:0,
  largestShortestSectionRatio: 0,
  sectionSizeStandardDeviation: 0,
  meanOfSubsectionsPerSection: 0,
  abstractSize: 0,
  abstractSizeArtcileLengthRatio: 0,
  citationCount: 0,
  citationCountPerSentence: 0,
  citationCountPerSection: 0,
  externalLinksCount: 0,
  externalLinksPerSentence: 0,
  externalLinksPerSection: 0,
  imageCount: 0,
  imagePerSentence: 0,
  imagePerSection: 0
}

var sections = []
var subsectionIndexes = []
var characterCount = 0
var wordCount = 0
var sectionSizes = []
var sentenceCount = 0
var textFromXML = ''

const countSections = (cb) => {
  structureFeatures.sectionCount = sections.length
  cb(null, 'Count Sections')
}

const countSubsections = (cb) => {
  structureFeatures.subsectionCount = subsectionIndexes.length
  cb(null, 'Count Subsections')
}

const countParagraphs = (cb) => {
  var paragraphCount = 0
  sections.forEach((section) => {
    paragraphCount = paragraphCount + section.split('.\n').length
  })
  structureFeatures.paragraphCount = paragraphCount
  cb(null, 'Count Paragraphs')
}

const getMeanSectionSize = (cb) => {
  structureFeatures.meanSectionSize = characterCount/structureFeatures.sectionCount
  cb(null, 'Get Mean Subsection Size')
}

const getMeanParagraphSize = (cb) => {
  structureFeatures.meanParagraphSize = wordCount/structureFeatures.paragraphCount
  cb(null, 'Get Mean Paragraph Size')
}

const getSectionSizes = (cb) => {
  sections.forEach((section) => {
    // Expand contractions
    var expandedSectionText = nlp.text(section).contractions.expand().text()
    // Normalize text (remove all punctation, except for dots, and 'new line')
    var normalizedSectionText = nlp.text(expandedSectionText).normal();
    // Remove dots, question marks, exclamation marks and brackets
    var noPointsSectionText = normalizedSectionText.replace(/[\.|?|!|{|}|\[|\]]/g, '')
    var sectionSize = noPointsSectionText.replace(/ /g, '').length
    sectionSizes.push(sectionSize)
  })
  cb(null, 'Get Section Sizes')
}

const getLargestSectionSize = (cb) => {
  structureFeatures.largestSectionSize = sectionSizes.max()
  cb(null, 'Get Largest Section Size')
}

const getShortestSectionSize = (cb) => {
  structureFeatures.shortestSectionSize = sectionSizes.min()
  cb(null, 'Get Shortest Section Size')
}

const getLargestShortestSectionRatio = (cb) => {
  structureFeatures.largestShortestSectionRatio = structureFeatures.largestSectionSize/structureFeatures.shortestSectionSize
  cb(null, 'Get Largest-Shortest Section Ratio')
}

const getSectionSizeStandardDeviation = (cb) => {
  structureFeatures.sectionSizeStandardDeviation = math.std(sectionSizes)
  cb(null, 'Get Section Size Standard Deviation')
}

const getMeanOfSubsectionsPerSection = (cb) => {
  structureFeatures.meanOfSubsectionsPerSection = structureFeatures.subsectionCount/structureFeatures.sectionCount
  cb(null, 'Get Mean Subsection Per Section')
}

// Abstract size (in characters (letters and numbers))
const getAbstractSize = (cb) => {
  structureFeatures.abstractSize = sectionSizes[0]
  cb(null, 'Get Abstract Size')
}

const getAbstractSizeArtcileLengthRatio = (cb) => {
  structureFeatures.abstractSizeArtcileLengthRatio = structureFeatures.abstractSize/characterCount
  cb(null, 'Get Abstract Size Article Length Ratio')
}

const countCitations = (cb) => {

  ////////////////////////////// PROVA UNIQUE REF //////////////////////////////

  // var citationCountText = textFromXML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<ref/g, '\n\n<ref').replace(/\/>/g, '/>\n\n').replace(/\/ref>/g, '/ref>\n\n').replace(/ /g, '')
  //
  // // console.log(citationCountText);
  //
  // // var citationsRegex = /<ref|&lt;ref|{{sfn\|/g
  //
  // // var citationsRegex = /<ref.*\/>|<ref.*\/ref>/g
  // var citationsRegex = /<ref.*\/ref>/g
  // // var citationsRegex = /<ref.*\/>/g
  //
  // // var citationsRegex = /&lt;ref.*ref&gt;|{{sfn.*}}|<ref.*ref>|<ref.*\/>/g
  //
  // // var citationsRegex = /&lt;ref.*ref&gt;/g
  // structureFeatures.citationCount = (citationCountText.toLowerCase().match(citationsRegex) || []).length
  //
  // // console.log(textFromXML);
  //
  //
  //
  //
  // console.log(structureFeatures.citationCount);
  // console.log(_.uniq(citationCountText.toLowerCase().match(citationsRegex)).length);
  // console.log(citationCountText.toLowerCase().match(citationsRegex));

  //////////////////////////////////////////////////////////////////////////////

  var citationsRegex = /<ref|&lt;ref|{{sfn\|/g
  structureFeatures.citationCount = (textFromXML.toLowerCase().match(citationsRegex) || []).length
  cb(null, 'Count Citations')
}

const getCitationCountPerSentence = (cb) => {
  structureFeatures.citationCountPerSentence = structureFeatures.citationCount/sentenceCount
  cb(null, 'Get Citation Count Per Text Length')
}

const getCitationCountPerSection = (cb) => {
  structureFeatures.citationCountPerSection = structureFeatures.citationCount/structureFeatures.sectionCount
  cb(null, 'Get Citation Count Per Text Length')
}

const countExternalLinks = (cb) => {
  var webURLRegex = /\|url=|\| url=|url =| url =|\[http/g
  structureFeatures.externalLinksCount = (textFromXML.toLowerCase().match(webURLRegex) || []).length
  cb(null, 'Count External Links')
}

const getExternalLinksPerSentence = (cb) => {
  structureFeatures.externalLinksPerSentence = structureFeatures.externalLinksCount/sentenceCount
  cb(null, 'Get External Links Per Text Length')
}

const getExternalLinksPerSection = (cb) => {
  structureFeatures.externalLinksPerSection = structureFeatures.externalLinksCount/structureFeatures.sectionCount
  cb(null, 'Get External Links Per Section')
}

const countImages = (cb) => {
  var imageRegex = /\[\[file:|\[\[image:/g
  structureFeatures.imageCount = (textFromXML.toLowerCase().match(imageRegex) || []).length
  cb(null, 'Count Images')
}

const getImagesPerSentence = (cb) => {
  imagePerSentence = structureFeatures.imageCount/sentenceCount
  cb(null, 'Get Images Per Text Length')
}

const getImagesLinksPerSection = (cb) => {
  structureFeatures.imagePerSection = structureFeatures.imageCount/structureFeatures.sectionCount
  cb(null, 'Get Images Per Section')
}

const analyze = (_sections, _subsectionIndexes, _characterCount, _wordCount, _sentenceCount, _textFromXML, cb) => {

  sections = _sections
  subsectionIndexes = _subsectionIndexes
  characterCount = _characterCount
  wordCount = _wordCount
  sentenceCount = _sentenceCount
  textFromXML = _textFromXML

  async.parallel([
    (cb) => {
      async.series([
        (cb) => {
          async.parallel([
            (cb) => {
              async.series([
                countSections,
                getMeanSectionSize
              ], cb )
            },
            countSubsections
          ], cb )
        },
        getMeanOfSubsectionsPerSection

      ], cb )
    },
    (cb) => {
      async.series([
        getSectionSizes,
        (cb) => {
          async.parallel([
            getLargestSectionSize,
            getShortestSectionSize,
            getSectionSizeStandardDeviation,
            (cb) => {
              async.series([
                getAbstractSize,
                getAbstractSizeArtcileLengthRatio
              ], cb)
            }
          ], cb )
        },
        getLargestShortestSectionRatio
      ], cb )
    },
    (cb) => {
    async.series([
      countParagraphs,
      getMeanParagraphSize
    ], cb )
    },
    // CITATIONS, LINKS, IMAGES
    (cb) => {
    async.series([
      countCitations,
      (cb) => {
        async.parallel([
          getCitationCountPerSentence,
          getCitationCountPerSection
        ], cb )
      }
    ], cb )
    },
    (cb) => {
    async.series([
      countExternalLinks,
      (cb) => {
        async.parallel([
          getExternalLinksPerSentence,
          getExternalLinksPerSection
        ], cb )
      }
    ], cb )
    },
    (cb) => {
    async.series([
      countImages,
      (cb) => {
        async.parallel([
          getImagesPerSentence,
          getImagesLinksPerSection
        ], cb )
      }
    ], cb )
    }
  ], (err, result) => {
    cb(structureFeatures)
  }
  )

}

// EXPORTS
module.exports.analyze = analyze


//////////////////////////////////////////////////////////////////////////////

Array.prototype.min = function() {
  return Math.min.apply(null, this)
}

Array.prototype.max = function() {
  return Math.max.apply(null, this)
}
