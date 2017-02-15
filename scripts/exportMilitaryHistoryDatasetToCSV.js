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

const fields = [
  // Length Features
  "characterCount",
  "wordCount",
  "syllableCount",
  "sentenceCount",
  // Structure Features
  "sectionCount",
  "subsectionCount",
  "paragraphCount",
  "meanSectionSize",
  "meanParagraphSize",
  "largestSectionSize",
  "shortestSectionSize",
  "largestShortestSectionRatio",
  "sectionSizeStandardDeviation",
  "meanOfSubsectionsPerSection",
  "abstractSize",
  "abstractSizeArtcileLengthRatio",
  "citationCount",
  "citationCountPerTextLength",
  "citationCountPerSection",
  "externalLinksCount",
  "externalLinksPerTextLength",
  "externalLinksPerSection",
  "imageCount",
  "imagePerTextLength",
  "imagePerSection",
  // Style Features
  "meanSentenceSize",
  "largestSentenceSize",
  "shortestSentenceSize",
  "largeSentenceRate",
  "shortSentenceRate",
  "questionCount",
  "questionRatio",
  "exclamationCount",
  "exclamationRatio",
  "toBeVerbCount",
  "toBeVerbRatio",
  "toBeVerbPerSentence",
  "toBeVerbRate",
  "modalAuxiliaryVerbCount",
  "modalAuxiliaryVerbsRatio",
  "modalAuxiliaryVerbsPerSentence" ,
  "modalAuxiliaryVerbsRate",
  "passiveVoiceCount",
  "passiveVoiceRatio",
  "passiveVoicePerSentence",
  "passiveVoiceRate",
  "numberOfSentencesThatStartWithACoordinatingConjunction",
  "numberOfSentencesThatStartWithADeterminer",
  "numberOfSentencesThatStartWithASubordinatingPrepositionOrConjunction",
  "numberOfSentencesThatStartWithAnAdjective",
  "numberOfSentencesThatStartWithANoun",
  "numberOfSentencesThatStartWithAPronoun",
  "numberOfSentencesThatStartWithAnAdverb",
  "numberOfSentencesThatStartWithAnArticle",
  "numberOfSentencesThatStartWithACoordinatingConjunctionRatio",
  "numberOfSentencesThatStartWithADeterminerRatio",
  "numberOfSentencesThatStartWithASubordinatingPrepositionOrConjunctionRatio",
  "numberOfSentencesThatStartWithAnAdjectiveRatio",
  "numberOfSentencesThatStartWithANounRatio",
  "numberOfSentencesThatStartWithAPronounRatio",
  "numberOfSentencesThatStartWithAnAdverbRatio",
  "numberOfSentencesThatStartWithAnArticleRatio",
  // Readability Features
  "automatedReadabilityIndex",
  "colemanLiauIndex",
  "fleshReadingEase",
  "fleschKincaidGradeLevel",
  "gunningFogIndex",
  "lasbarhetsIndex",
  "smogGrading",
  "daleChallReadabilityFormula",
  // Lexical Features
  "differentWordCount",
  "differentWordsPerSentence",
  "differentWordsRate",
  "nounCount",
  "nounsPerSentence",
  "nounsRate",
  "differentNounCount",
  "differentNounsPerSentence",
  "differentNounsRate",
  "differentNounsDifferentWordsRatio",
  "verbCount",
  "verbsPerSentence",
  "verbsRate",
  "differentVerbCount",
  "differentVerbsPerSentence",
  "differentVerbsRate",
  "differentVerbsDifferentWordsRatio",
  "pronounCount",
  "pronounsPerSentence",
  "pronounsRate",
  "differentPronounCount",
  "differentPronounsPerSentence",
  "differentPronounsRate",
  "differentPronounsDifferentWordsRatio",
  "adjectiveCount",
  "adjectivesPerSentence",
  "adjectivesRate",
  "differentAdjectiveCount",
  "differentAdjectivesPerSentence",
  "differentAdjectivesRate",
  "differentAdjectivesDifferentWordsRatio",
  "adverbCount",
  "adverbsPerSentence",
  "adverbsRate",
  "differentAdverbCount",
  "differentAdverbsPerSentence",
  "differentAdverbsRate",
  "differentAdverbsDifferentWordsRatio",
  "coordinatingConjunctionCount",
  "coordinatingConjunctionsPerSentence",
  "coordinatingConjunctionsRate",
  "differentCoordinatingConjunctionCount",
  "differentCoordinatingConjunctionsPerSentence",
  "differentCoordinatingConjunctionsRate",
  "differentCoordinatingConjunctionsDifferentWordsRatio",
  "subordinatingPrepositionAndConjunctionCount",
  "subordinatingPrepositionsAndConjunctionsPerSentence",
  "subordinatingPrepositionsAndConjunctionsRate",
  "differentSubordinatingPrepositionAndConjunctionCount",
  "differentSubordinatingPrepositionsAndConjunctionsPerSentence",
  "differentSubordinatingPrepositionsAndConjunctionsRate",
  "differentSubordinatingPrepositionsAndConjunctionsDifferentWordsRatio",
  "syllablesPerWord",
  "charactersPerWord",
  // POS Trigrmas
  "NNP,NNP,NNP",
  "VBD,DT,JJ",
  "IN,DT,NNP",
  "NNP,IN,DT",
  "DT,NNP,NNP",
  "JJ,NN,IN",
  "NN,IN,DT",
  "IN,DT,NN",
  "NN,IN,NNP",
  "IN,NNP,NNP",
  "NNP,VBD,DT",
  "VBD,DT,NN",
  "DT,NN,IN",
  "VBD,VBN,IN",
  "NNP,NNP,VBD",
  "IN,NN,IN",
  "NNP,NNP,IN",
  "NNP,IN,NNP",
  "VBD,IN,DT",
  "IN,DT,JJ",
  "JJ,NNS,IN",
  "DT,JJ,NN",
  "IN,DT,NNS",
  "IN,CD,NNP",
  "VBN,IN,DT",
  "DT,NN,NN",
  "IN,PRP$,NN",
  "NNP,VBD,VBN",
  "NNP,CC,NNP",
  "NNS,IN,DT",
  "NN,IN,NN",
  "DT,NN,VBD",
  "NN,VBD,VBN",
  "TO,VB,DT",
  "NNP,POS,NN",
  // Char Trigrmas
  "ter",
  "er_",
  "_wa",
  "was",
  "as_",
  "s_a",
  "_a_",
  "an_",
  "e_a",
  "_an",
  "and",
  "nd_",
  "_re",
  "ent",
  "_of",
  "of_",
  "f_t",
  "_th",
  "the",
  "he_",
  "on_",
  ",_a",
  "at_",
  "ed_",
  "_on",
  "n_t",
  "or_",
  "ing",
  "ng_",
  "_in",
  "in_",
  "d_t",
  "d_a",
  "_he",
  "_to",
  "ted",
  "th_",
  "al_",
  "es_",
  "ate",
  "_co",
  "ion",
  "ere",
  "_fo",
  "for",
  "s,_",
  "to_",
  "ati",
  "st_",
  "re_",
  "_be",
  "ly_",
  "her",
  "_hi",
  "his",
  "is_",
  "e_t",
  "en_",
  "e_o",
  "t_t",
  // "._T",
  "tio",
  "_Th",
  // Review features
  "age",
  "agePerReview",
  "reviewPerDay",
  "reviewsPerUser",
  "reviewsPerUserStdDev",
  "discussionCount",
  "reviewCount",
  "registeredReviewCount",
  "anonymouseReviewCount",
  "registeredReviewRate",
  "anonymouseReviewRate",
  "registeredAnonymouseReviewRatio",
  "userCount",
  "occasionalUserCount",
  "occasionalUserRate",
  "registeredUserCount",
  "anonymouseUserCount",
  "registerdAnonymouseUserRatio",
  "registeredUserRate",
  "anonymouseUserRate",
  "revertCount",
  "revertReviewRatio",
  "diversity",
  "modifiedLinesRate",
  "mostActiveUsersReviewCount",
  "mostActiveUsersReviewRate",
  // "occasionalUsersReviewCount",
  // "occasionalUsersReviewRate",
  "lastThreeMonthsReviewCount",
  "lastThreeMonthsReviewRate",
  // Network Features
  "pageRank",
  "indegree",
  "outdegree",
  "assortativity_inin",
  "assortativity_inout",
  "assortativity_outin",
  "assortativity_outout",
  "localClusteringCoefficient",
  "reciprocity",
  "linkCount",
  "translationCount",
  // Quality Class
  "qualityClass"
]

// get notified if we connect successfully or if a connection error occurs
let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to MongoDB')

  Article.find({}, (err, articles) => {
    if (err) console.log(err);
    else if (articles) {

      console.log(articles[0]);

      // articles.sort(function(a, b) {
      //   return b.qualityClass - a.qualityClass
      // })



      let csv = json2csv({ data: articles, fields: fields })
      fs.writeFileSync('../datasets/MHDataset.csv', csv)
      console.log('CSV Saved!')




      // let shuffledArticles = shuffle(articles)
      // let shuffledCSV = json2csv({ data: shuffledArticles, fields: fields })
      // fs.writeFileSync('../datasets/MHShuffledDataset.csv', shuffledCSV)
      // console.log('Shuffled CSV Saved!')

      process.exit()
    }
    else {
      console.log('Not Found');
      process.exit()
    }
  })
})
