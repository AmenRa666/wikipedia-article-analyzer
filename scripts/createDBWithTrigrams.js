// MODULES
var fs = require('fs');
var mongoose = require('mongoose')
var async = require('async')

// Open a connection to the database on our locally running instance of MongoDB
mongoose.connect('mongodb://localhost/wikipedia')

// models
var Article = require('../models/article.js').Article
var ArticleWithTrigrams = require('../models/articleWithTrigrams.js').ArticleWithTrigrams

var path = '../trigrams/'

var charTrigrams = [ "he ", "ing", "ng ", " th", "the", " of", "of ", "in ", " in", "ion", "on ", "ed ", " an", "and", "nd ", "er ", " to", "to ", "as " ]

var posTrigrams = [ "DT,NNP,NNP", "NNP,NNP,NNP", "DT,NN,IN", "NN,IN,DT", "IN,DT,NNP", "NNP,NNP,IN", "NNP,IN,NNP", "NNP,IN,DT", "IN,DT,NN", "DT,NN,VBD", "NNS,IN,DT", "NNP,NNP,VBD", "JJ,NN,IN", "IN,DT,JJ", "DT,JJ,NN", "NN,IN,NNP", "IN,NNP,NNP", "VBD,DT,NN", "VBD,VBN,IN", "VBN,IN,DT", "NN,IN,NN", "IN,NN,IN", "JJ,NNS,IN", "NN,CC,NN", "IN,JJ,NNS", "IN,DT,NNS", "TO,VB,DT", "DT,NN,NN", "NNP,NNP,CC", "IN,JJ,NN", "NNP,CC,NNP", "NNP,POS,NN", "NN,IN,JJ" ]

// get notified if we connect successfully or if a connection error occurs
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to MongoDB')

  Article.find({}, (err, docs) => {
    if (err) console.log(err);
    else if (docs) {

      docs.sort(function(a, b) {
        return b.qualityClass - a.qualityClass
      })

      var articles =[]

      docs.forEach((doc) => {

        var article = {
          id: doc.id,
          title: doc.title,
          // Length Features
          characterCount: doc.characterCount,
          wordCount: doc.wordCount,
          syllableCount: doc.syllableCount,
          sentenceCount: doc.sentenceCount,
          // Structure Features
          sectionCount: doc.sectionCount,
          subsectionCount: doc.subsectionCount,
          paragraphCount: doc.paragraphCount,
          meanSectionSize: doc.meanSectionSize,
          meanParagraphSize: doc.meanParagraphSize,
          largestSectionSize: doc.largestSectionSize,
          shortestSectionSize: doc.shortestSectionSize,
          largestShortestSectionRatio: doc.largestShortestSectionRatio,
          sectionSizeStandardDeviation: doc.sectionSizeStandardDeviation,
          meanOfSubsectionsPerSection: doc.meanOfSubsectionsPerSection,
          abstractSize: doc.abstractSize,
          abstractSizeArtcileLengthRatio: doc.abstractSizeArtcileLengthRatio,
          citationCount: doc.citationCount,
          citationCountPerSentence: doc.citationCountPerSentence,
          citationCountPerSection: doc.citationCountPerSection,
          externalLinksCount: doc.externalLinksCount,
          externalLinksPerSentence: doc.externalLinksPerSentence,
          externalLinksPerSection: doc.externalLinksPerSection,
          imageCount: doc.imageCount,
          imagePerSentence: doc.imagePerSentence,
          imagePerSection: doc.imagePerSection,
          // Style Features
          meanSentenceSize: doc.meanSentenceSize,
          largestSentenceSize: doc.largestSentenceSize,
          shortestSentenceSize: doc.shortestSentenceSize,
          largeSentenceRate: doc.largeSentenceRate,
          shortSentenceRate: doc.shortSentenceRate,
          questionCount: doc.questionCount,
          questionRatio: doc.questionRatio,
          exclamationCount: doc.exclamationCount,
          exclamationRatio: doc.exclamationRatio,
          toBeVerbCount: doc.toBeVerbCount,
          toBeVerbRatio: doc.toBeVerbRatio,
          toBeVerbPerSentence: doc.toBeVerbPerSentence,
          toBeVerbRate: doc.toBeVerbRate,
          modalAuxiliaryVerbCount: doc.modalAuxiliaryVerbCount,
          modalAuxiliaryVerbsRatio: doc.modalAuxiliaryVerbsRatio,
          modalAuxiliaryVerbsPerSentence: doc.modalAuxiliaryVerbsPerSentence,
          modalAuxiliaryVerbsRate: doc.modalAuxiliaryVerbsRate,
          passiveVoiceCount: doc.passiveVoiceCount,
          passiveVoiceRatio: doc.passiveVoiceRatio,
          passiveVoicePerSentence: doc.passiveVoicePerSentence,
          passiveVoiceRate: doc.passiveVoiceRate,
          numberOfSentencesThatStartWithACoordinatingConjunction: doc.numberOfSentencesThatStartWithACoordinatingConjunction,
          numberOfSentencesThatStartWithADeterminer: doc.numberOfSentencesThatStartWithADeterminer,
          numberOfSentencesThatStartWithASubordinatingPrepositionOrConjunction: doc.numberOfSentencesThatStartWithASubordinatingPrepositionOrConjunction,
          numberOfSentencesThatStartWithAnAdjective: doc.numberOfSentencesThatStartWithAnAdjective,
          numberOfSentencesThatStartWithANoun: doc.numberOfSentencesThatStartWithANoun,
          numberOfSentencesThatStartWithAPronoun: doc.numberOfSentencesThatStartWithAPronoun,
          numberOfSentencesThatStartWithAnAdverb: doc.numberOfSentencesThatStartWithAnAdverb,
          numberOfSentencesThatStartWithAnArticle: doc.numberOfSentencesThatStartWithAnArticle,
          numberOfSentencesThatStartWithACoordinatingConjunctionRatio: doc.numberOfSentencesThatStartWithACoordinatingConjunctionRatio,
          numberOfSentencesThatStartWithADeterminerRatio: doc.numberOfSentencesThatStartWithADeterminerRatio,
          numberOfSentencesThatStartWithASubordinatingPrepositionOrConjunctionRatio: doc.numberOfSentencesThatStartWithASubordinatingPrepositionOrConjunctionRatio,
          numberOfSentencesThatStartWithAnAdjectiveRatio: doc.numberOfSentencesThatStartWithAnAdjectiveRatio,
          numberOfSentencesThatStartWithANounRatio: doc.numberOfSentencesThatStartWithANounRatio,
          numberOfSentencesThatStartWithAPronounRatio: doc.numberOfSentencesThatStartWithAPronounRatio,
          numberOfSentencesThatStartWithAnAdverbRatio: doc.numberOfSentencesThatStartWithAnAdverbRatio,
          numberOfSentencesThatStartWithAnArticleRatio: doc.numberOfSentencesThatStartWithAnArticleRatio,
          // Readability Features
          automatedReadabilityIndex: doc.automatedReadabilityIndex,
          colemanLiauIndex: doc.colemanLiauIndex,
          fleshReadingEase: doc.fleshReadingEase,
          fleschKincaidGradeLevel: doc.fleschKincaidGradeLevel,
          gunningFogIndex: doc.gunningFogIndex,
          lasbarhetsIndex: doc.lasbarhetsIndex,
          smogGrading: doc.smogGrading,
          daleChallReadabilityFormula: doc.daleChallReadabilityFormula,
          // Lexical Features
          differentWordCount: doc.differentWordCount,
          differentWordsPerSentence: doc.differentWordsPerSentence,
          differentWordsRate: doc.differentWordsRate,
          nounCount: doc.nounCount,
          nounsPerSentence: doc.nounsPerSentence,
          nounsRate: doc.nounsRate,
          differentNounCount: doc.differentNounCount,
          differentNounsPerSentence: doc.differentNounsPerSentence,
          differentNounsRate: doc.differentNounsRate,
          differentNounsDifferentWordsRatio: doc.differentNounsDifferentWordsRatio,
          verbCount: doc.verbCount,
          verbsPerSentence: doc.verbsPerSentence,
          verbsRate: doc.verbsRate,
          differentVerbCount: doc.differentVerbCount,
          differentVerbsPerSentence: doc.differentVerbsPerSentence,
          differentVerbsRate: doc.differentVerbsRate,
          differentVerbsDifferentWordsRatio: doc.differentVerbsDifferentWordsRatio,
          pronounCount: doc.pronounCount,
          pronounsPerSentence: doc.pronounsPerSentence,
          pronounsRate: doc.pronounsRate,
          differentPronounCount: doc.differentPronounCount,
          differentPronounsPerSentence: doc.differentPronounsPerSentence,
          differentPronounsRate: doc.differentPronounsRate,
          differentPronounsDifferentWordsRatio: doc.differentPronounsDifferentWordsRatio,
          adjectiveCount: doc.adjectiveCount,
          adjectivesPerSentence: doc.adjectivesPerSentence,
          adjectivesRate: doc.adjectivesRate,
          differentAdjectiveCount: doc.differentAdjectiveCount,
          differentAdjectivesPerSentence: doc.differentAdjectivesPerSentence,
          differentAdjectivesRate: doc.differentAdjectivesRate,
          differentAdjectivesDifferentWordsRatio: doc.differentAdjectivesDifferentWordsRatio,
          adverbCount: doc.adverbCount,
          adverbsPerSentence: doc.adverbsPerSentence,
          adverbsRate: doc.adverbsRate,
          differentAdverbCount: doc.differentAdverbCount,
          differentAdverbsPerSentence: doc.differentAdverbsPerSentence,
          differentAdverbsRate: doc.differentAdverbsRate,
          differentAdverbsDifferentWordsRatio: doc.differentAdverbsDifferentWordsRatio,
          coordinatingConjunctionCount: doc.coordinatingConjunctionCount,
          coordinatingConjunctionsPerSentence: doc.coordinatingConjunctionsPerSentence,
          coordinatingConjunctionsRate: doc.coordinatingConjunctionsRate,
          differentCoordinatingConjunctionCount: doc.differentCoordinatingConjunctionCount,
          differentCoordinatingConjunctionsPerSentence: doc.differentCoordinatingConjunctionsPerSentence,
          differentCoordinatingConjunctionsRate: doc.differentCoordinatingConjunctionsRate,
          differentCoordinatingConjunctionsDifferentWordsRatio: doc.differentCoordinatingConjunctionsDifferentWordsRatio,
          subordinatingPrepositionAndConjunctionCount: doc.subordinatingPrepositionAndConjunctionCount,
          subordinatingPrepositionsAndConjunctionsPerSentence: doc.subordinatingPrepositionsAndConjunctionsPerSentence,
          subordinatingPrepositionsAndConjunctionsRate: doc.subordinatingPrepositionsAndConjunctionsRate,
          differentSubordinatingPrepositionAndConjunctionCount: doc.differentSubordinatingPrepositionAndConjunctionCount,
          differentSubordinatingPrepositionsAndConjunctionsPerSentence: doc.differentSubordinatingPrepositionsAndConjunctionsPerSentence,
          differentSubordinatingPrepositionsAndConjunctionsRate: doc.differentSubordinatingPrepositionsAndConjunctionsRate,
          differentSubordinatingPrepositionsAndConjunctionsDifferentWordsRatio:doc.differentSubordinatingPrepositionsAndConjunctionsDifferentWordsRatio,
          syllablesPerWord: doc.syllablesPerWord,
          charactersPerWord: doc.charactersPerWord,
          // Trigrams
          "he_": 0,
          "ing": 0,
          "ng_": 0,
          "_th": 0,
          "the": 0,
          "_of": 0,
          "of_": 0,
          "in_": 0,
          "_in": 0,
          "ion": 0,
          "on_": 0,
          "ed_": 0,
          "_an": 0,
          "and": 0,
          "nd_": 0,
          "er_": 0,
          "_to": 0,
          "to_": 0,
          "as_": 0,
          "DT,NNP,NNP": 0,
          "NNP,NNP,NNP": 0,
          "DT,NN,IN": 0,
          "NN,IN,DT": 0,
          "IN,DT,NNP": 0,
          "NNP,NNP,IN": 0,
          "NNP,IN,NNP": 0,
          "NNP,IN,DT": 0,
          "IN,DT,NN": 0,
          "DT,NN,VBD": 0,
          "NNS,IN,DT": 0,
          "NNP,NNP,VBD": 0,
          "JJ,NN,IN": 0,
          "IN,DT,JJ": 0,
          "DT,JJ,NN": 0,
          "NN,IN,NNP": 0,
          "IN,NNP,NNP": 0,
          "VBD,DT,NN": 0,
          "VBD,VBN,IN": 0,
          "VBN,IN,DT": 0,
          "NN,IN,NN": 0,
          "IN,NN,IN": 0,
          "JJ,NNS,IN": 0,
          "NN,CC,NN": 0,
          "IN,JJ,NNS": 0,
          "IN,DT,NNS": 0,
          "TO,VB,DT": 0,
          "DT,NN,NN": 0,
          "NNP,NNP,CC": 0,
          "IN,JJ,NN": 0,
          "NNP,CC,NNP": 0,
          "NNP,POS,NN": 0,
          "NN,IN,JJ": 0,
          // Quality Class
          qualityClass: doc.qualityClass
        }

        var file = article.id + '.json'

        var articleTrigramsFile = JSON.parse(fs.readFileSync(path + file, 'utf8'))
        var articlePosTrigrams = articleTrigramsFile.posTrigrams
        var articleCharTrigrams = articleTrigramsFile.characterTrigrams

        charTrigrams.forEach((charTrigram) => {
          if (articleCharTrigrams.hasOwnProperty(charTrigram)) {
            article[charTrigram.replace(/ /g, '_')] = articleCharTrigrams[charTrigram]
          }
          else {
            article[charTrigram] = 0
          }
        })
        posTrigrams.forEach((posTrigram) => {
          if (articlePosTrigrams.hasOwnProperty(posTrigram)) {
            article[posTrigram] = articlePosTrigrams[posTrigram]
          }
          else {
            article[posTrigram] = 0
          }
        })

        articles.push(article)
      })

      async.eachSeries(
        articles,
        insertArticle,
        (err, result) => {
          if (err) console.log(err);
          else {
            console.log('All articles have been added!');
            process.exit()
          }
        }
      )

    }
    else {
      console.log('Not Found');
      process.exit()
    }
  })
})


const insertArticle = (article, cb) => {
  ArticleWithTrigrams.create(article, (err, obj) => {
    if (err) return handleError(err)
    else {
      console.log('Article saved!')
      cb(null, 'Article Saved')
    }
  })
}
