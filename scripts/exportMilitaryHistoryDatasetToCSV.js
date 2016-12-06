"use strict"
// MODULES
const json2csv = require('json2csv');
const fs = require('fs');
const mongoose = require('mongoose')
const math = require('mathjs')
const shuffle = require('shuffle-array')
// Open a connection to the database on our locally running instance of MongoDB
mongoose.connect('mongodb://localhost/wikipedia')

// MODEL
const Article = require('../models/article.js').Article

const fields = ['id', 'title', 'characterCount', 'wordCount', 'syllableCount', 'sentenceCount', 'sectionCount', 'subsectionCount', 'paragraphCount', 'meanSectionSize', 'meanParagraphSize', 'largestSectionSize', 'shortestSectionSize', 'largestShortestSectionRatio', 'sectionSizeStandardDeviation', 'meanOfSubsectionsPerSection', 'abstractSize', 'abstractSizeArtcileLengthRatio', 'citationCount', 'citationCountPerSentence', 'citationCountPerSection', 'externalLinksCount', 'externalLinksPerSentence', 'externalLinksPerSection', 'imageCount', 'imagePerSentence', 'imagePerSection', 'meanSentenceSize', 'largestSentenceSize', 'shortestSentenceSize', 'largeSentenceRate', 'shortSentenceRate', 'questionCount', 'questionRatio', 'exclamationCount', 'exclamationRatio', 'toBeVerbCount', 'toBeVerbRatio', 'toBeVerbPerSentence', 'toBeVerbRate', 'modalAuxiliaryVerbCount', 'modalAuxiliaryVerbsRatio', 'modalAuxiliaryVerbsPerSentence', 'modalAuxiliaryVerbsRate', 'passiveVoiceCount', 'passiveVoiceRatio', 'passiveVoicePerSentence', 'passiveVoiceRate', 'numberOfSentencesThatStartWithACoordinatingConjunction', 'numberOfSentencesThatStartWithADeterminer', 'numberOfSentencesThatStartWithASubordinatingPrepositionOrConjunction', 'numberOfSentencesThatStartWithAnAdjective', 'numberOfSentencesThatStartWithANoun', 'numberOfSentencesThatStartWithAPronoun', 'numberOfSentencesThatStartWithAnAdverb', 'numberOfSentencesThatStartWithAnArticle', 'numberOfSentencesThatStartWithACoordinatingConjunctionRatio', 'numberOfSentencesThatStartWithADeterminerRatio', 'numberOfSentencesThatStartWithASubordinatingPrepositionOrConjunctionRatio', 'numberOfSentencesThatStartWithAnAdjectiveRatio', 'numberOfSentencesThatStartWithANounRatio', 'numberOfSentencesThatStartWithAPronounRatio', 'numberOfSentencesThatStartWithAnAdverbRatio', 'numberOfSentencesThatStartWithAnArticleRatio', 'automatedReadabilityIndex', 'colemanLiauIndex', 'fleshReadingEase', 'fleschKincaidGradeLevel', 'gunningFogIndex', 'lasbarhetsIndex', 'smogGrading', 'daleChallReadabilityFormula', 'differentWordCount', 'differentWordsPerSentence', 'differentWordsRate', 'nounCount', 'nounsPerSentence', 'nounsRate', 'differentNounCount', 'differentNounsPerSentence', 'differentNounsRate', 'differentNounsDifferentWordsRatio', 'verbCount', 'verbsPerSentence', 'verbsRate', 'differentVerbCount', 'differentVerbsPerSentence', 'differentVerbsRate', 'differentVerbsDifferentWordsRatio', 'pronounCount', 'pronounsPerSentence', 'pronounsRate', 'differentPronounCount', 'differentPronounsPerSentence', 'differentPronounsRate', 'differentPronounsDifferentWordsRatio', 'adjectiveCount', 'adjectivesPerSentence', 'adjectivesRate', 'differentAdjectiveCount', 'differentAdjectivesPerSentence', 'differentAdjectivesRate', 'differentAdjectivesDifferentWordsRatio', 'adverbCount', 'adverbsPerSentence', 'adverbsRate', 'differentAdverbCount', 'differentAdverbsPerSentence', 'differentAdverbsRate', 'differentAdverbsDifferentWordsRatio', 'coordinatingConjunctionCount', 'coordinatingConjunctionsPerSentence', 'coordinatingConjunctionsRate', 'differentCoordinatingConjunctionCount', 'differentCoordinatingConjunctionsPerSentence', 'differentCoordinatingConjunctionsRate', 'differentCoordinatingConjunctionsDifferentWordsRatio', 'subordinatingPrepositionAndConjunctionCount', 'subordinatingPrepositionsAndConjunctionsPerSentence', 'subordinatingPrepositionsAndConjunctionsRate', 'differentSubordinatingPrepositionAndConjunctionCount', 'differentSubordinatingPrepositionsAndConjunctionsPerSentence', 'differentSubordinatingPrepositionsAndConjunctionsRate', 'differentSubordinatingPrepositionsAndConjunctionsDifferentWordsRatio', 'syllablesPerWord', 'charactersPerWord', 'DT,NNP,NNP', 'NNP,NNP,NNP', 'DT,NN,IN', 'NN,IN,DT', 'IN,DT,NNP', 'NNP,NNP,IN', 'NNP,IN,NNP', 'NNP,IN,DT', 'IN,DT,NN', 'DT,NN,VBD', 'NNS,IN,DT', 'NNP,NNP,VBD', 'JJ,NN,IN', 'IN,DT,JJ', 'DT,JJ,NN', 'NN,IN,NNP', 'IN,NNP,NNP', 'VBD,DT,NN', 'VBD,VBN,IN', 'VBN,IN,DT', 'NN,IN,NN', 'IN,NN,IN', 'JJ,NNS,IN', 'NN,CC,NN', 'IN,JJ,NNS', 'IN,DT,NNS', 'TO,VB,DT', 'DT,NN,NN', 'NNP,NNP,CC', 'IN,JJ,NN', 'NNP,CC,NNP', 'NNP,POS,NN', 'NN,IN,JJ', 'he_', 'ing', 'ng_', '_th', 'the', '_of', 'of_', 'in_', '_in', 'ion', 'on_', 'ed_', '_an', 'and', 'nd_', 'er_', '_to', 'to_', 'as_', 'age', 'agePerReview', 'reviewPerDay', 'reviewsPerUser', 'reviewsPerUserStdDev', 'discussionCount', 'reviewCount', 'registeredReviewCount', 'anonymouseReviewCount', 'registeredReviewRate', 'anonymouseReviewRate', 'registeredAnonymouseReviewRatio', 'userCount', 'occasionalUserCount', 'occasionalUserRate', 'registeredUserCount', 'anonymouseUserCount', 'registerdAnonymouseUserRatio', 'registeredUserRate', 'anonymouseUserRate', 'revertCount', 'revertReviewRatio', 'diversity', 'modifiedLinesRate', 'mostActiveUsersReviewCount', 'mostActiveUsersReviewRate', 'occasionalUsersReviewCount', 'occasionalUsersReviewRate', 'lastThreeMonthsReviewCount', 'lastThreeMonthsReviewRate', 'qualityClass']

// get notified if we connect successfully or if a connection error occurs
let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to MongoDB')

  Article.find({}, (err, articles) => {
    if (err) console.log(err);
    else if (articles) {

      // articles.sort(function(a, b) {
      //   return b.qualityClass - a.qualityClass
      // })

      let csv = json2csv({ data: articles, fields: fields })
      fs.writeFileSync('../datasets/MHDataset.csv', csv)
      console.log('CSV Saved!')

      let shuffledArticles = shuffle(articles)
      let shuffledCSV = json2csv({ data: shuffledArticles, fields: fields })
      fs.writeFileSync('../datasets/MHShuffledDataset.csv', shuffledCSV)
      console.log('Shuffled CSV Saved!')

      process.exit()
    }
    else {
      console.log('Not Found');
      process.exit()
    }
  })
})
