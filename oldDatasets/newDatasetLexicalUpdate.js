// MODULES
var json2csv = require('json2csv');
var fs = require('fs');
var mongoose = require('mongoose')
var math = require('mathjs')
var _ = require('underscore')
// Open a connection to the database on our locally running instance of MongoDB
mongoose.connect('mongodb://localhost/wikipedia')

// MODEL
var Article = require('./models/article.js').Article

var fields = ["characterCount", "wordCount", "syllableCount", "sentenceCount", "sectionCount", "subsectionCount", "paragraphCount", "meanSectionSize", "meanParagraphSize", "largestSectionSize", "shortestSectionSize", "largestShortestSectionRatio", "sectionSizeStandardDeviation", "meanOfSubsectionsPerSection", "abstractSize", "abstractSizeArtcileLengthRatio", "citationCount", "citationCountPerSentence", "citationCountPerSection", "externalLinksCount", "externalLinksPerSentence", "externalLinksPerSection", "imageCount", "imagePerSentence", "imagePerSection", "meanSentenceSize", "largestSentenceSize", "shortestSentenceSize", "largeSentenceRate", "shortSentenceRate", "questionCount", "questionRatio", "exclamationCount", "exclamationRatio", "toBeVerbCount", "toBeVerbRatio", "toBeVerbPerSentence", "toBeVerbRate", "automatedReadabilityIndex", "colemanLiauIndex", "fleshReadingEase", "fleschKincaidGradeLevel", "gunningFogIndex", "lasbarhetsIndex", "smogGrading", "linsearWriteFormula", "daleChallReadabilityFormula", "differentWordCount", "differentWordsPerSentence", "differentWordsRate", "nounCount", "nounsPerSentence", "nounsRate", "differentNounCount", "differentNounsPerSentence", "differentNounsRate", "verbCount", "verbsPerSentence", "verbsRate", "differentVerbCount", "differentVerbsPerSentence", "differentVerbsRate", "pronounCount", "pronounsPerSentence", "pronounsRate", "differentPronounCount", "differentPronounsPerSentence", "differentPronounsRate", "adjectiveCount", "adjectivesPerSentence", "differentAdjectiveCount", "differentAdjectivesPerSentence", "differentAdjectivesRate", "adverbCount", "adverbsPerSentence", "adverbsRate", "differentAdverbCount", "differentAdverbsPerSentence", "differentAdverbsRate", "coordinatingConjunctionCount", "coordinatingConjunctionsPerSentence", "coordinatingConjunctionsRate", "differentCoordinatingConjunctionCount", "differentCoordinatingConjunctionsPerSentence", "differentCoordinatingConjunctionsRate", "subordinatingPrepositionAndConjunctionCount", "subordinatingPrepositionsAndConjunctionsPerSentence", "subordinatingPrepositionsAndConjunctionsRate", "differentSubordinatingPrepositionAndConjunctionCount", "differentSubordinatingPrepositionsAndConjunctionsPerSentence", "differentSubordinatingPrepositionsAndConjunctionsRate", "syllablesPerWord", "charactersPerWord", "differentNounsDifferentWordsRatio", "differentVerbsDifferentWordsRatio", "differentPronounsDifferentWordsRatio", "differentAdjectivesDifferentWordsRatio", "differentAdverbsDifferentWordsRatio", "differentCoordinatingConjunctionsDifferentWordsRatio", "differentSubordinatingPrepositionsAndConjunctionsDifferentWordsRatio", "qualityClass"]

// get notified if we connect successfully or if a connection error occurs
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to MongoDB')

  Article.find({}, (err, docs) => {
    if (err) console.log(err);
    else if (docs) {

      for (var i = 0; i < docs.length; i++) {
        var differentWordCount = docs[i].differentWordCount
        
        docs[i].differentNounsDifferentWordsRatio = docs[i].differentNounCount/differentWordCount,

        docs[i].differentVerbsDifferentWordsRatio = docs[i].differentVerbCount/differentWordCount,

        docs[i].differentPronounsDifferentWordsRatio = docs[i].differentPronounCount/differentWordCount,

        docs[i].differentAdjectivesDifferentWordsRatio = docs[i].differentAdjectiveCount/differentWordCount,

        docs[i].differentAdverbsDifferentWordsRatio = docs[i].differentAdverbCount/differentWordCount,

        docs[i].differentCoordinatingConjunctionsDifferentWordsRatio = docs[i].differentCoordinatingConjunctionCount/differentWordCount,

        docs[i].differentSubordinatingPrepositionsAndConjunctionsDifferentWordsRatio = docs[i].differentSubordinatingPrepositionAndConjunctionCount/differentWordCount
      }

      var csv = json2csv({ data: docs, fields: fields })
      fs.writeFile('dataset.csv', csv, function(err) {
        if (err) throw err;
        console.log('dataset Saved!');

        var array = []

        for (var i = 0; i < docs.length; i++) {
          array.push(_.clone(docs[i]))
        }

        for (var i = 0; i < array.length; i++) {
          if (array[i].qualityClass != 7 && array[i].qualityClass != 2) {
            array.splice(array.indexOf(array[i]), 1)
            i--
          }
        }

        for (var i = 0; i < array.length; i++) {
          if (array[i].qualityClass == 7) {
            array[i].qualityClass = 1
          }
        }

        var csv = json2csv({ data: array, fields: fields })
        fs.writeFile('featuredStartDataset.csv', csv, function(err) {
          if (err) throw err;
          console.log('featuredStartDataset Saved!');

          var aClassCount = 0
          var gaClassCount = 0
          var bClassCount = 0
          var cClassCount = 0
          var startClassCount = 0
          var stubClassCount = 0

          console.log(docs.length);

          for (var i = 0; i < docs.length; i++) {
            if (docs[i].qualityClass == 1) {
              stubClassCount++
            }
            else if (docs[i].qualityClass == 2) {
              startClassCount++
            }
            else if (docs[i].qualityClass == 3) {
              cClassCount++
            }
            else if (docs[i].qualityClass == 4) {
              bClassCount++
            }
            else if (docs[i].qualityClass == 5) {
              gaClassCount++
            }
            else if (docs[i].qualityClass == 6) {
              aClassCount++
            }
            if (docs[i].qualityClass == 1 && stubClassCount > 17) {
              docs.splice(docs.indexOf(docs[i]), 1)
              i--
            }
            else if (docs[i].qualityClass == 2 && startClassCount > 17) {
              docs.splice(docs.indexOf(docs[i]), 1)
              i--
            }
            else if (docs[i].qualityClass == 3 && cClassCount > 16) {
              docs.splice(docs.indexOf(docs[i]), 1)
              i--
            }
            else if (docs[i].qualityClass == 4 && bClassCount > 17) {
              docs.splice(docs.indexOf(docs[i]), 1)
              i--
            }
            else if (docs[i].qualityClass == 5 && gaClassCount > 17) {
              docs.splice(docs.indexOf(docs[i]), 1)
              i--
            }
            else if (docs[i].qualityClass == 6 && aClassCount > 16) {
              docs.splice(docs.indexOf(docs[i]), 1)
              i--
            }
          }

          for (var i = 0; i < docs.length; i++) {
            if (docs[i].qualityClass != 7) {
              docs[i].qualityClass = 2
            }
            else {
              docs[i].qualityClass = 1
            }
          }

          console.log(docs.length);

          var csv = json2csv({ data: docs, fields: fields })
          fs.writeFile('twoClassDataset.csv', csv, function(err) {
            if (err) throw err;
            console.log('twoClassDataset Saved!');
            process.exit()
          });
        });

      });


    }
    else {
      console.log('Not Found');
      process.exit()
    }
  })
})
