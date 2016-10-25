// MODULES
var json2csv = require('json2csv');
var fs = require('fs');
var mongoose = require('mongoose')
var math = require('mathjs')
// Open a connection to the database on our locally running instance of MongoDB
mongoose.connect('mongodb://localhost/wikipedia')

// MODEL
var Article = require('./models/article.js').Article

var fields = ["id", "characterCount", "wordCount", "syllableCount", "sentenceCount", "sectionCount", "subsectionCount", "paragraphCount", "meanSectionSize", "meanParagraphSize", "largestSectionSize", "shortestSectionSize",
"largestShortestSectionRatio",
"sectionSizeStandardDeviation", "meanOfSubsectionsPerSection", "abstractSize", "abstractSizeArtcileLengthRatio", "citationCount", "citationCountPerSentence", "citationCountPerSection", "externalLinksCount", "externalLinksPerSentence", "externalLinksPerSection", "imageCount", "imagePerSentence", "imagePerSection", "meanSentenceSize", "largestSentenceSize", "shortestSentenceSize", "largeSentenceRate", "shortSentenceRate", "questionCount", "questionRatio", "exclamationCount", "exclamationRatio", "toBeVerbCount", "toBeVerbRatio", "toBeVerbPerSentence", "toBeVerbRate", "automatedReadabilityIndex", "colemanLiauIndex", "fleshReadingEase", "fleschKincaidGradeLevel", "gunningFogIndex", "lasbarhetsIndex", "smogGrading", "linsearWriteFormula", "daleChallReadabilityFormula", "differentWordCount", "differentWordsPerSentence", "differentWordsRate", "nounCount", "nounsPerSentence", "nounsRate", "differentNounCount", "differentNounsPerSentence", "differentNounsRate", "verbCountentence", "verbsRate", "differentVerbCount", "differentVerbsPerSentence", "differentVerbsRate", "pronounCount", "pronounsPerSentence", "pronounsRate", "differentPronounCount", "differentPronounsPerSentence", "differentPronounsRate", "adjectiveCount", "adjectivesPerSentence", "differentAdjectiveCount", "differentAdjectivesPerSentence", "differentAdjectivesRate", "adverbCount", "adverbsPerSentence", "adverbsRate", "differentAdverbCount", "differentAdverbsPerSentence", "differentAdverbsRate", "coordinatingConjunctionCount", "coordinatingConjunctionsPerSentence", "coordinatingConjunctionsRate", "differentCoordinatingConjunctionCount", "differentCoordinatingConjunctionsPerSentence", "differentCoordinatingConjunctionsRate", "subordinatingPrepositionAndConjunctionCount", "subordinatingPrepositionsAndConjunctionsPerSentence", "subordinatingPrepositionsAndConjunctionsRate", "differentSubordinatingPrepositionAndConjunctionCount", "differentSubordinatingPrepositionsAndConjunctionsPerSentence", "differentSubordinatingPrepositionsAndConjunctionsRate", "syllablesPerWord", "charactersPerWord", "qualityClass"]

// get notified if we connect successfully or if a connection error occurs
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to MongoDB')

  Article.find({}, (err, docs) => {
    if (err) console.log(err);
    else if (docs) {




      // for (var i = 0; i < docs.length; i++) {
      //   docs[i].characterCount = Math.round(docs[i].characterCount * 1000) / 1000
      //   docs[i].wordCount = Math.round(docs[i].wordCount * 1000) / 1000
      //   docs[i].syllableCount = Math.round(docs[i].syllableCount * 1000) / 1000
      //   docs[i].sentenceCount = Math.round(docs[i].sentenceCount * 1000) / 1000
      //   docs[i].sectionCount = Math.round(docs[i].sectionCount * 1000) / 1000
      //   docs[i].subsectionCount = Math.round(docs[i].subsectionCount * 1000) / 1000
      //   docs[i].paragraphCount = Math.round(docs[i].paragraphCount * 1000) / 1000
      //   docs[i].meanSectionSize = Math.round(docs[i].meanSectionSize * 1000) / 1000
      //   docs[i].meanParagraphSize = Math.round(docs[i].meanParagraphSize * 1000) / 1000
      //   docs[i].largestSectionSize = Math.round(docs[i].largestSectionSize * 1000) / 1000
      //   docs[i].shortestSectionSize = Math.round(docs[i].shortestSectionSize * 1000) / 1000
      //   docs[i].sectionSizeStandardDeviation = Math.round(docs[i].sectionSizeStandardDeviation * 1000) / 1000
      //   docs[i].meanOfSubsectionsPerSection = Math.round(docs[i].meanOfSubsectionsPerSection * 1000) / 1000
      //   docs[i].abstractSize = Math.round(docs[i].abstractSize * 1000) / 1000
      //   docs[i].abstractSizeArtcileLengthRatio = Math.round(docs[i].abstractSizeArtcileLengthRatio * 1000) / 1000
      //   docs[i].citationCount = Math.round(docs[i].citationCount * 1000) / 1000
      //   docs[i].citationCountPerSentence = Math.round(docs[i].citationCountPerSentence * 1000) / 1000
      //   docs[i].citationCountPerSection = Math.round(docs[i].citationCountPerSection * 1000) / 1000
      //   docs[i].externalLinksCount = Math.round(docs[i].externalLinksCount * 1000) / 1000
      //   docs[i].externalLinksPerSentence = Math.round(docs[i].externalLinksPerSentence * 1000) / 1000
      //   docs[i].externalLinksPerSection = Math.round(docs[i].externalLinksPerSection * 1000) / 1000
      //   docs[i].imageCount = Math.round(docs[i].imageCount * 1000) / 1000
      //   docs[i].imagePerSentence = Math.round(docs[i].imagePerSentence * 1000) / 1000
      //   docs[i].imagePerSection = Math.round(docs[i].imagePerSection * 1000) / 1000
      //   docs[i].meanSentenceSize = Math.round(docs[i].meanSentenceSize * 1000) / 1000
      //   docs[i].largestSentenceSize = Math.round(docs[i].largestSentenceSize * 1000) / 1000
      //   docs[i].shortestSentenceSize = Math.round(docs[i].shortestSentenceSize * 1000) / 1000
      //   docs[i].largeSentenceRate = Math.round(docs[i].largeSentenceRate * 1000) / 1000
      //   docs[i].shortSentenceRate = Math.round(docs[i].shortSentenceRate * 1000) / 1000
      //   docs[i].questionCount = Math.round(docs[i].questionCount * 1000) / 1000
      //   docs[i].questionRatio = Math.round(docs[i].questionRatio * 1000) / 1000
      //   docs[i].exclamationCount = Math.round(docs[i].exclamationCount * 1000) / 1000
      //   docs[i].exclamationRatio = Math.round(docs[i].exclamationRatio * 1000) / 1000
      //   docs[i].toBeVerbCount = Math.round(docs[i].toBeVerbCount * 1000) / 1000
      //   docs[i].toBeVerbRatio = Math.round(docs[i].toBeVerbRatio * 1000) / 1000
      //   docs[i].toBeVerbPerSentence = Math.round(docs[i].toBeVerbPerSentence * 1000) / 1000
      //   docs[i].toBeVerbRate = Math.round(docs[i].toBeVerbRate * 1000) / 1000
      //   docs[i].automatedReadabilityIndex = Math.round(docs[i].automatedReadabilityIndex * 1000) / 1000
      //   docs[i].colemanLiauIndex = Math.round(docs[i].colemanLiauIndex * 1000) / 1000
      //   docs[i].fleshReadingEase = Math.round(docs[i].fleshReadingEase * 1000) / 1000
      //   docs[i].fleschKincaidGradeLevel = Math.round(docs[i].fleschKincaidGradeLevel * 1000) / 1000
      //   docs[i].gunningFogIndex = Math.round(docs[i].gunningFogIndex * 1000) / 1000
      //   docs[i].lasbarhetsIndex = Math.round(docs[i].lasbarhetsIndex * 1000) / 1000
      //   docs[i].smogGrading = Math.round(docs[i].smogGrading * 1000) / 1000
      //   docs[i].linsearWriteFormula = Math.round(docs[i].linsearWriteFormula * 1000) / 1000
      //   docs[i].daleChallReadabilityFormula = Math.round(docs[i].daleChallReadabilityFormula * 1000) / 1000
      //   docs[i].differentWordCount = Math.round(docs[i].differentWordCount * 1000) / 1000
      //   docs[i].differentWordsPerSentence = Math.round(docs[i].differentWordsPerSentence * 1000) / 1000
      //   docs[i].differentWordsRate = Math.round(docs[i].differentWordsRate * 1000) / 1000
      //   docs[i].nounCount = Math.round(docs[i].nounCount * 1000) / 1000
      //   docs[i].nounsPerSentence = Math.round(docs[i].nounsPerSentence * 1000) / 1000
      //   docs[i].nounsRate = Math.round(docs[i].nounsRate * 1000) / 1000
      //   docs[i].differentNounCount = Math.round(docs[i].differentNounCount * 1000) / 1000
      //   docs[i].differentNounsPerSentence = Math.round(docs[i].differentNounsPerSentence * 1000) / 1000
      //   docs[i].differentNounsRate = Math.round(docs[i].differentNounsRate * 1000) / 1000
      //   docs[i].verbCount = Math.round(docs[i].verbCount * 1000) / 1000
      //   docs[i].verbsPerSentence = Math.round(docs[i].verbsPerSentence * 1000) / 1000
      //   docs[i].verbsRate = Math.round(docs[i].verbsRate * 1000) / 1000
      //   docs[i].differentVerbCount = Math.round(docs[i].differentVerbCount * 1000) / 1000
      //   docs[i].differentVerbsPerSentence = Math.round(docs[i].differentVerbsPerSentence * 1000) / 1000
      //   docs[i].differentVerbsRate = Math.round(docs[i].differentVerbsRate * 1000) / 1000
      //   docs[i].pronounCount = Math.round(docs[i].pronounCount * 1000) / 1000
      //   docs[i].pronounsPerSentence = Math.round(docs[i].pronounsPerSentence * 1000) / 1000
      //   docs[i].pronounsRate = Math.round(docs[i].pronounsRate * 1000) / 1000
      //   docs[i].differentPronounCount = Math.round(docs[i].differentPronounCount * 1000) / 1000
      //   docs[i].differentPronounsPerSentence = Math.round(docs[i].differentPronounsPerSentence * 1000) / 1000
      //   docs[i].differentPronounsRate = Math.round(docs[i].differentPronounsRate * 1000) / 1000
      //   docs[i].adjectiveCount = Math.round(docs[i].adjectiveCount * 1000) / 1000
      //   docs[i].adjectivesPerSentence = Math.round(docs[i].adjectivesPerSentence * 1000) / 1000
      //   docs[i].differentAdjectiveCount = Math.round(docs[i].differentAdjectiveCount * 1000) / 1000
      //   docs[i].differentAdjectivesPerSentence = Math.round(docs[i].differentAdjectivesPerSentence * 1000) / 1000
      //   docs[i].differentAdjectivesRate = Math.round(docs[i].differentAdjectivesRate * 1000) / 1000
      //   docs[i].adverbCount = Math.round(docs[i].adverbCount * 1000) / 1000
      //   docs[i].adverbsPerSentence = Math.round(docs[i].adverbsPerSentence * 1000) / 1000
      //   docs[i].adverbsRate = Math.round(docs[i].adverbsRate * 1000) / 1000
      //   docs[i].differentAdverbCount = Math.round(docs[i].differentAdverbCount * 1000) / 1000
      //   docs[i].differentAdverbsPerSentence = Math.round(docs[i].differentAdverbsPerSentence * 1000) / 1000
      //   docs[i].differentAdverbsRate = Math.round(docs[i].differentAdverbsRate * 1000) / 1000
      //   docs[i].coordinatingConjunctionCount = Math.round(docs[i].coordinatingConjunctionCount * 1000) / 1000
      //   docs[i].coordinatingConjunctionsPerSentence = Math.round(docs[i].coordinatingConjunctionsPerSentence * 1000) / 1000
      //   docs[i].coordinatingConjunctionsRate = Math.round(docs[i].coordinatingConjunctionsRate * 1000) / 1000
      //   docs[i].differentCoordinatingConjunctionCount = Math.round(docs[i].differentCoordinatingConjunctionCount * 1000) / 1000
      //   docs[i].differentCoordinatingConjunctionsPerSentence = Math.round(docs[i].differentCoordinatingConjunctionsPerSentence * 1000) / 1000
      //   docs[i].differentCoordinatingConjunctionsRate = Math.round(docs[i].differentCoordinatingConjunctionsRate * 1000) / 1000
      //   docs[i].subordinatingPrepositionAndConjunctionCount = Math.round(docs[i].subordinatingPrepositionAndConjunctionCount * 1000) / 1000
      //   docs[i].subordinatingPrepositionsAndConjunctionsPerSentence = Math.round(docs[i].subordinatingPrepositionsAndConjunctionsPerSentence * 1000) / 1000
      //   docs[i].subordinatingPrepositionsAndConjunctionsRate = Math.round(docs[i].subordinatingPrepositionsAndConjunctionsRate * 1000) / 1000
      //   docs[i].differentSubordinatingPrepositionAndConjunctionCount = Math.round(docs[i].differentSubordinatingPrepositionAndConjunctionCount * 1000) / 1000
      //   docs[i].differentSubordinatingPrepositionsAndConjunctionsPerSentence = Math.round(docs[i].differentSubordinatingPrepositionsAndConjunctionsPerSentence * 1000) / 1000
      //   docs[i].differentSubordinatingPrepositionsAndConjunctionsRate = Math.round(docs[i].differentSubordinatingPrepositionsAndConjunctionsRate * 1000) / 1000
      //   docs[i].syllablesPerWord = Math.round(docs[i].syllablesPerWord * 1000) / 1000
      //   docs[i].charactersPerWord = Math.round(docs[i].charactersPerWord * 1000) / 1000
      //   docs[i].qualityClass = Math.round(docs[i].qualityClass * 1000) / 1000
      // }

      var csv = json2csv({ data: docs, fields: fields })
      fs.writeFile('dataset.csv', csv, function(err) {
        if (err) throw err;
        console.log('CSV Saved!');
        process.exit()
      });

    }
    else {
      console.log('Not Found');
      process.exit()
    }
  })
})


// var math = require('mathjs')
//
// var num = 0.8467898768698
//
// var a = Math.round(num * 1000) / 1000
//
//
// console.log(a);
