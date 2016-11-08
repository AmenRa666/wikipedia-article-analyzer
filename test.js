var Converter = require("csvtojson").Converter;
var json2csv = require('json2csv');
var fs = require('fs');
var math = require('mathjs')


var converter = new Converter({});
var converter2 = new Converter({});


var fields = ["characterCount", "wordCount", "syllableCount", "sentenceCount", "sectionCount", "subsectionCount", "paragraphCount", "meanSectionSize", "meanParagraphSize", "largestSectionSize", "shortestSectionSize", "largestShortestSectionRatio", "sectionSizeStandardDeviation", "meanOfSubsectionsPerSection", "abstractSize", "abstractSizeArtcileLengthRatio", "citationCount", "citationCountPerSentence", "citationCountPerSection", "externalLinksCount", "externalLinksPerSentence", "externalLinksPerSection", "imageCount", "imagePerSentence", "imagePerSection", "meanSentenceSize", "largestSentenceSize", "shortestSentenceSize", "largeSentenceRate", "shortSentenceRate", "questionCount", "questionRatio", "exclamationCount", "exclamationRatio", "toBeVerbCount", "toBeVerbRatio", "toBeVerbPerSentence", "toBeVerbRate", "modalAuxiliaryVerbCount", "modalAuxiliaryVerbsRatio", "modalAuxiliaryVerbsPerSentence", "modalAuxiliaryVerbsRate", "passiveVoiceCount", "passiveVoiceRatio", "passiveVoicePerSentence", "passiveVoiceRate", "numberOfSentencesThatStartWithACoordinatingConjunction", "numberOfSentencesThatStartWithADeterminer", "numberOfSentencesThatStartWithASubordinatingPrepositionOrConjunction", "numberOfSentencesThatStartWithAnAdjective", "numberOfSentencesThatStartWithANoun", "numberOfSentencesThatStartWithAPronoun", "numberOfSentencesThatStartWithAnAdverb", "numberOfSentencesThatStartWithAnArticle", "numberOfSentencesThatStartWithACoordinatingConjunctionRatio", "numberOfSentencesThatStartWithADeterminerRatio", "numberOfSentencesThatStartWithASubordinatingPrepositionOrConjunctionRatio", "numberOfSentencesThatStartWithAnAdjectiveRatio", "numberOfSentencesThatStartWithANounRatio", "numberOfSentencesThatStartWithAPronounRatio", "numberOfSentencesThatStartWithAnAdverbRatio", "numberOfSentencesThatStartWithAnArticleRatio", "automatedReadabilityIndex", "colemanLiauIndex", "fleshReadingEase", "fleschKincaidGradeLevel", "gunningFogIndex", "lasbarhetsIndex", "smogGrading", "daleChallReadabilityFormula", "differentWordCount", "differentWordsPerSentence", "differentWordsRate", "nounCount", "nounsPerSentence", "nounsRate", "differentNounCount", "differentNounsPerSentence", "differentNounsRate", "differentNounsDifferentWordsRatio", "verbCount", "verbsPerSentence", "verbsRate", "differentVerbCount", "differentVerbsPerSentence", "differentVerbsRate", "differentVerbsDifferentWordsRatio", "pronounCount", "pronounsPerSentence", "pronounsRate", "differentPronounCount", "differentPronounsPerSentence", "differentPronounsRate", "differentPronounsDifferentWordsRatio", "adjectiveCount", "adjectivesPerSentence", "adjectivesRate", "differentAdjectiveCount", "differentAdjectivesPerSentence", "differentAdjectivesRate", "differentAdjectivesDifferentWordsRatio", "adverbCount", "adverbsPerSentence", "adverbsRate", "differentAdverbCount", "differentAdverbsPerSentence", "differentAdverbsRate", "differentAdverbsDifferentWordsRatio", "coordinatingConjunctionCount", "coordinatingConjunctionsPerSentence", "coordinatingConjunctionsRate", "differentCoordinatingConjunctionCount", "differentCoordinatingConjunctionsPerSentence", "differentCoordinatingConjunctionsRate", "differentCoordinatingConjunctionsDifferentWordsRatio", "subordinatingPrepositionAndConjunctionCount", "subordinatingPrepositionsAndConjunctionsPerSentence", "subordinatingPrepositionsAndConjunctionsRate", "differentSubordinatingPrepositionAndConjunctionCount", "differentSubordinatingPrepositionsAndConjunctionsPerSentence", "differentSubordinatingPrepositionsAndConjunctionsRate", "differentSubordinatingPrepositionsAndConjunctionsDifferentWordsRatio", "syllablesPerWord", "charactersPerWord", "qualityClass"]


converter.fromFile("datasets/dataset.csv",function(err,result){
  var dataset = result

  converter2.fromFile("oldDatasets/dataset.csv",function(err,result2){
    if (err) throw err
    var dataset2 = result2

    var a2 = []

    dataset2.forEach((doc) => {
      a2.push([doc.characterCount, doc.wordCount])
    })

    var docs = []

    a2.forEach((a) => {
      var i = dataset.length

      while(i--) {
        if( dataset[i].characterCount == a[0] && dataset[i].wordCount == a[1] ) {
          docs.push(dataset[i])
          break;
        }
      }
    })


    // for (var i = 0; i < docs.length; i++) {
    //   console.log(docs[i].title);
    //   console.log(docs[i].largestShortestSectionRatio + " | " + dataset2[i].largestShortestSectionRatio + "          " + docs[i].sectionSizeStandardDeviation + " | " + dataset2[i].sectionSizeStandardDeviation);
    // }

    // var csv = json2csv({ data: docs, fields: fields })
    // fs.writeFile('dataset.csv', csv, function(err) {
    //   if (err) throw err;
    //   console.log('CSV Saved!')
    //   process.exit()
    // })







    // var aClassCount = 0
    // var gaClassCount = 0
    // var bClassCount = 0
    // var cClassCount = 0
    // var startClassCount = 0
    // var stubClassCount = 0
    //
    // for (var i = 0; i < docs.length; i++) {
    //   if (docs[i].qualityClass == 1) {
    //     stubClassCount++
    //   }
    //   else if (docs[i].qualityClass == 2) {
    //     startClassCount++
    //   }
    //   else if (docs[i].qualityClass == 3) {
    //     cClassCount++
    //   }
    //   else if (docs[i].qualityClass == 4) {
    //     bClassCount++
    //   }
    //   else if (docs[i].qualityClass == 5) {
    //     gaClassCount++
    //   }
    //   else if (docs[i].qualityClass == 6) {
    //     aClassCount++
    //   }
    //   if (docs[i].qualityClass == 1 && stubClassCount > 17) {
    //     docs.splice(docs.indexOf(docs[i]), 1)
    //     i--
    //   }
    //   else if (docs[i].qualityClass == 2 && startClassCount > 17) {
    //     docs.splice(docs.indexOf(docs[i]), 1)
    //     i--
    //   }
    //   else if (docs[i].qualityClass == 3 && cClassCount > 16) {
    //     docs.splice(docs.indexOf(docs[i]), 1)
    //     i--
    //   }
    //   else if (docs[i].qualityClass == 4 && bClassCount > 17) {
    //     docs.splice(docs.indexOf(docs[i]), 1)
    //     i--
    //   }
    //   else if (docs[i].qualityClass == 5 && gaClassCount > 17) {
    //     docs.splice(docs.indexOf(docs[i]), 1)
    //     i--
    //   }
    //   else if (docs[i].qualityClass == 6 && aClassCount > 16) {
    //     docs.splice(docs.indexOf(docs[i]), 1)
    //     i--
    //   }
    // }
    //
    // for (var i = 0; i < docs.length; i++) {
    //   if (docs[i].qualityClass != 7) {
    //     docs[i].qualityClass = 2
    //   }
    // }
    //
    // for (var i = 0; i < docs.length; i++) {
    //   if (docs[i].qualityClass == 7) {
    //     docs[i].qualityClass = 1
    //   }
    // }
    //
    //
    // var csv = json2csv({ data: docs, fields: fields })
    // fs.writeFile('twoClassDataset.csv', csv, function(err) {
    //   if (err) throw err;
    //   console.log('CSV Saved!')
    //   process.exit()
    // })




    for (var i = 0; i < docs.length; i++) {
      if (docs[i].qualityClass != 7 && docs[i].qualityClass != 2) {
        docs.splice(docs.indexOf(docs[i]), 1)
        i--
      }
    }

    for (var i = 0; i < docs.length; i++) {
      if (docs[i].qualityClass == 7) {
        docs[i].qualityClass = 1
      }
    }

    console.log(docs.length);

    var csv = json2csv({ data: docs, fields: fields })
    fs.writeFile('featuredStartDataset.csv', csv, function(err) {
      if (err) throw err;
      console.log('CSV Saved!');
      process.exit()
    });




    // for (var prop in docs[0]) {
    //   var propArray = []
    //   if (docs[0].hasOwnProperty(prop)) {
    //     docs.forEach((doc) => {
    //       propArray.push(doc[prop])
    //     })
    //     var log = math.std(propArray)
    //     if (log < 1) {
    //       console.log(prop);
    //     }
    //     // console.log(prop + " std: " + log);
    //
    //   }
    // }


  })

})
