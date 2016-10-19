// open a connection to the database on our locally running instance of MongoDB
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/wikipedia')

// models
var Article = require('./models/article.js').Article

console.log(Article);

// get notified if we connect successfully or if a connection error occurs
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to MongoDB')
  // Reastart the collection at every new launch
  // Artist.remove({}, function(err) {
  //    console.log('Collection restarted')
  // })
})

// insert an artist in the db
// exports.insert = function(info) {
//   Article.create(info, function (err, obj) {
//     if (err) return handleError(err)
//     else console.log('Artist saved!')
//   })
// }

var a = {
  characterCount: 35679,
  wordCount: 7087,
  syllableCount: 11878,
  sentenceCount: 311,
  sectionCount: 8,
  subsectionCount: 18,
  paragraphCount: 59,
  meanSectionSize: 4459.875,
  meanParagraphSize: 120.11864406779661,
  largestSectionSize: 7569,
  shortestSectionSize: 1226,
  largestShortestSectionRatio: 6.17373572593801,
  sectionSizeStandardDeviation: 2713.5677325774855,
  meanOfSubsectionsPerSection: 2.25,
  abstractSize: 1680,
  abstractSizeArtcileLengthRatio: 0.047086521483225424,
  citationCount: 331,
  citationCountPerSentence: 1.0643086816720257,
  citationCountPerSection: 41.375,
  externalLinksCount: 57,
  externalLinksPerSentence: 0.1832797427652733,
  externalLinksPerSection: 7.125,
  imageCount: 34,
  imagePerSentence: 0,
  imagePerSection: 4.25,
  meanSentenceSize: 22.787781350482316,
  largestSentenceSize: 62,
  shortestSentenceSize: 4,
  largeSentenceRate: 0.1414790996784566,
  shortSentenceRate: 0.2379421221864952,
  questionCount: 0,
  questionRatio: 0,
  exclamationCount: 0,
  exclamationRatio: 0,
  toBeVerbCount: 261,
  toBeVerbRatio: 0.4915254237288136,
  toBeVerbPerSentence: 0.8392282958199357,
  toBeVerbRate: 0.036827994920276566,
  automatedReadabilityIndex: 13.676052379770574,
  colemanLiauIndex: 12.503502187103141,
  fleshReadingEase: 41.913557707445875,
  fleschKincaidGradeLevel: 13.074347750534585,
  gunningFogIndex: 16.130775020791205,
  lasbarhetsIndex: 51.39639491938067,
  smogGrading: 14.549999386538158,
  linsearWriteFormula: -0.7636655948553055,
  daleChallReadabilityFormula: 11.187936647237345,
  differentWordCount: 2174,
  differentWordsPerSentence: 6.990353697749196,
  differentWordsRate: 0.30675885424015803,
  nounCount: 2145,
  nounsPerSentence: 6.897106109324759,
  nounsRate: 0.3026668548045717,
  differentNounCount: 934,
  differentNounsPerSentence: 3.0032154340836015,
  differentNounsRate: 0.13179060251164104,
  verbCount: 531,
  verbsPerSentence: 1.707395498392283,
  verbsRate: 0.07492592069987301,
  differentVerbCount: 266,
  differentVerbsPerSentence: 0.8553054662379421,
  differentVerbsRate: 0.03753351206434316,
  pronounCount: 156,
  pronounsPerSentence: 0.5016077170418006,
  pronounsRate: 0.022012134894877945,
  differentPronounCount: 13,
  differentPronounsPerSentence: 0.04180064308681672,
  differentPronounsRate: 0.0018343445745731622,
  adjectiveCount: 770,
  adjectivesPerSentence: 2.4758842443729905,
  adjectivesRate: 0.10864964018625653,
  differentAdjectiveCount: 374,
  differentAdjectivesPerSentence: 1.202572347266881,
  differentAdjectivesRate: 0.05277268237618174,
  adverbCount: 323,
  adverbsPerSentence: 1.0385852090032155,
  adverbsRate: 0.045576407506702415,
  differentAdverbCount: 118,
  differentAdverbsPerSentence: 0.37942122186495175,
  differentAdverbsRate: 0.01665020459997178,
  coordinatingConjunctionCount: 259,
  coordinatingConjunctionsPerSentence: 0.8327974276527331,
  coordinatingConjunctionsRate: 0.03654578806264992,
  differentCoordinatingConjunctionCount: 5,
  differentCoordinatingConjunctionsPerSentence: 0.01607717041800643,
  differentCoordinatingConjunctionsRate: 0.0007055171440666008,
  subordinatingPrepositionAndConjunctionCount: 1003,
  subordinatingPrepositionsAndConjunctionsPerSentence: 3.22508038585209,
  subordinatingPrepositionsAndConjunctionsRate: 0.14152673909976013,
  differentSubordinatingPrepositionAndConjunctionCount: 48,
  differentSubordinatingPrepositionsAndConjunctionsPerSentence: 0.15434083601286175,
  differentSubordinatingPrepositionsAndConjunctionsRate: 0.006772964583039368,
  syllablesPerWord: 1.6760265274446169,
  charactersPerWord: 5.03442923663045,
  articleClass: 5
}


Article.create(a, function (err, obj) {
  if (err) return handleError(err)
  else console.log('Article saved!')
})
