var Converter = require("csvtojson").Converter;
var json2csv = require('json2csv');
var fs = require('fs');
var math = require('mathjs')


var converter = new Converter({});
var converter2 = new Converter({});


var fields = ["characterCount", "wordCount", "syllableCount", "sentenceCount", "sectionCount", "subsectionCount", "paragraphCount", "meanSectionSize", "meanParagraphSize", "largestSectionSize", "shortestSectionSize", "largestShortestSectionRatio", "sectionSizeStandardDeviation", "meanOfSubsectionsPerSection", "abstractSize", "abstractSizeArtcileLengthRatio", "citationCount", "citationCountPerSentence", "citationCountPerSection", "externalLinksCount", "externalLinksPerSentence", "externalLinksPerSection", "imageCount", "imagePerSentence", "imagePerSection", "meanSentenceSize", "largestSentenceSize", "shortestSentenceSize", "largeSentenceRate", "shortSentenceRate", "questionCount", "questionRatio", "exclamationCount", "exclamationRatio", "toBeVerbCount", "toBeVerbRatio", "toBeVerbPerSentence", "toBeVerbRate", "modalAuxiliaryVerbCount", "modalAuxiliaryVerbsRatio", "modalAuxiliaryVerbsPerSentence", "modalAuxiliaryVerbsRate", "passiveVoiceCount", "passiveVoiceRatio", "passiveVoicePerSentence", "passiveVoiceRate", "numberOfSentencesThatStartWithACoordinatingConjunction", "numberOfSentencesThatStartWithADeterminer", "numberOfSentencesThatStartWithASubordinatingPrepositionOrConjunction", "numberOfSentencesThatStartWithAnAdjective", "numberOfSentencesThatStartWithANoun", "numberOfSentencesThatStartWithAPronoun", "numberOfSentencesThatStartWithAnAdverb", "numberOfSentencesThatStartWithAnArticle", "numberOfSentencesThatStartWithACoordinatingConjunctionRatio", "numberOfSentencesThatStartWithADeterminerRatio", "numberOfSentencesThatStartWithASubordinatingPrepositionOrConjunctionRatio", "numberOfSentencesThatStartWithAnAdjectiveRatio", "numberOfSentencesThatStartWithANounRatio", "numberOfSentencesThatStartWithAPronounRatio", "numberOfSentencesThatStartWithAnAdverbRatio", "numberOfSentencesThatStartWithAnArticleRatio", "automatedReadabilityIndex", "colemanLiauIndex", "fleshReadingEase", "fleschKincaidGradeLevel", "gunningFogIndex", "lasbarhetsIndex", "smogGrading", "daleChallReadabilityFormula", "differentWordCount", "differentWordsPerSentence", "differentWordsRate", "nounCount", "nounsPerSentence", "nounsRate", "differentNounCount", "differentNounsPerSentence", "differentNounsRate", "differentNounsDifferentWordsRatio", "verbCount", "verbsPerSentence", "verbsRate", "differentVerbCount", "differentVerbsPerSentence", "differentVerbsRate", "differentVerbsDifferentWordsRatio", "pronounCount", "pronounsPerSentence", "pronounsRate", "differentPronounCount", "differentPronounsPerSentence", "differentPronounsRate", "differentPronounsDifferentWordsRatio", "adjectiveCount", "adjectivesPerSentence", "adjectivesRate", "differentAdjectiveCount", "differentAdjectivesPerSentence", "differentAdjectivesRate", "differentAdjectivesDifferentWordsRatio", "adverbCount", "adverbsPerSentence", "adverbsRate", "differentAdverbCount", "differentAdverbsPerSentence", "differentAdverbsRate", "differentAdverbsDifferentWordsRatio", "coordinatingConjunctionCount", "coordinatingConjunctionsPerSentence", "coordinatingConjunctionsRate", "differentCoordinatingConjunctionCount", "differentCoordinatingConjunctionsPerSentence", "differentCoordinatingConjunctionsRate", "differentCoordinatingConjunctionsDifferentWordsRatio", "subordinatingPrepositionAndConjunctionCount", "subordinatingPrepositionsAndConjunctionsPerSentence", "subordinatingPrepositionsAndConjunctionsRate", "differentSubordinatingPrepositionAndConjunctionCount", "differentSubordinatingPrepositionsAndConjunctionsPerSentence", "differentSubordinatingPrepositionsAndConjunctionsRate", "differentSubordinatingPrepositionsAndConjunctionsDifferentWordsRatio", "syllablesPerWord", "charactersPerWord", "he_", "ing", "ng_", "_th", "the", "_of", "of_", "in_", "_in", "ion", "on_", "ed_", "_an", "and", "nd_", "er_", "_to", "to_", "as_", "DT,NNP,NNP", "NNP,NNP,NNP", "DT,NN,IN", "NN,IN,DT", "IN,DT,NNP", "NNP,NNP,IN", "NNP,IN,NNP", "NNP,IN,DT", "IN,DT,NN", "DT,NN,VBD", "NNS,IN,DT", "NNP,NNP,VBD", "JJ,NN,IN", "IN,DT,JJ", "DT,JJ,NN", "NN,IN,NNP", "IN,NNP,NNP", "VBD,DT,NN", "VBD,VBN,IN", "VBN,IN,DT", "NN,IN,NN", "IN,NN,IN", "JJ,NNS,IN", "NN,CC,NN", "IN,JJ,NNS", "IN,DT,NNS", "TO,VB,DT", "DT,NN,NN", "NNP,NNP,CC", "IN,JJ,NN", "NNP,CC,NNP", "NNP,POS,NN", "NN,IN,JJ", "qualityClass"]

var trigrams = [ "he_","ing","ng_","_th","the","_of","of_","in_","_in","ion","on_","ed_","_an","and","nd_","er_","_to","to_","as_","DT,NNP,NNP","NNP,NNP,NNP","DT,NN,IN","NN,IN,DT","IN,DT,NNP","NNP,NNP,IN","NNP,IN,NNP","NNP,IN,DT","IN,DT,NN","DT,NN,VBD","NNS,IN,DT","NNP,NNP,VBD","JJ,NN,IN","IN,DT,JJ","DT,JJ,NN","NN,IN,NNP","IN,NNP,NNP","VBD,DT,NN","VBD,VBN,IN","VBN,IN,DT","NN,IN,NN","IN,NN,IN","JJ,NNS,IN","NN,CC,NN","IN,JJ,NNS","IN,DT,NNS","TO,VB,DT","DT,NN,NN","NNP,NNP,CC","IN,JJ,NN","NNP,CC,NNP","NNP,POS,NN","NN,IN,JJ" ]


converter.fromFile("datasets/datasetWithTrigrams.csv", (err, res) => {
  if (err) throw err
  var dataset = result

  var fa = 0
  var a = 0
  var ga = 0
  var b = 0
  var c = 0
  var start = 0
  var stub = 0

  converter2.fromFile("datasets/posCharTrigramsDataset.csv",function(err,result2){
    if (err) throw err
    var dataset2 = result2

    // var a2 = []
    //
    // dataset2.forEach((doc) => {
    //   a2.push([doc["NN,IN,DT"], doc["IN,DT,NNP"], doc["NNP,NNP,IN"], doc["NNP,IN,NNP"]])
    // })
    //
    // var docs = []
    //
    // a2.forEach((a) => {
    //   var i = dataset.length
    //
    //   while(i--) {
    //     if( dataset[i]["NN,IN,DT"] == a[0] && dataset[i]["IN,DT,NNP"] == a[1] && dataset[i]["NNP,NNP,IN"] == a[2] && dataset[i]["NNP,IN,NNP"] == a[3] ) {
    //       docs.push(dataset[i])
    //       break;
    //     }
    //   }
    // })

    var docs = []

    dataset2.forEach((element) => {
      var i = dataset.length
      var b = true

      while(i--) {
        for (key in element) {
          if (dataset[i].hasOwnProperty(key.replace(/ /g, '_'))) {
            if (dataset[i][key.replace(/ /g, '_')] == element[key]) {
              b = true
            }
            else {
              b = false
              break
            }
          }
        }
        if (b) {
          docs.push(dataset[i])
        }

      }
    })


    docs.forEach((doc) => {
      if (doc.qualityClass == 7) {
        fa++
      }
      if (doc.qualityClass == 6) {
        a++
      }
      if (doc.qualityClass == 5) {
        ga++
      }
      if (doc.qualityClass == 4) {
        b++
      }
      if (doc.qualityClass == 3) {
        c++
      }
      if (doc.qualityClass == 2) {
        start++
      }
      if (doc.qualityClass == 1) {
        stub++
      }
    })

    console.log(fa);
    console.log(a);
    console.log(ga);
    console.log(b);
    console.log(c);
    console.log(start);
    console.log(stub);



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







    var aClassCount = 0
    var gaClassCount = 0
    var bClassCount = 0
    var cClassCount = 0
    var startClassCount = 0
    var stubClassCount = 0

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

    docs.forEach((doc) => {
      if (doc.qualityClass == 7) {
        fa++
      }
      if (doc.qualityClass == 6) {
        a++
      }
      if (doc.qualityClass == 5) {
        ga++
      }
      if (doc.qualityClass == 4) {
        b++
      }
      if (doc.qualityClass == 3) {
        c++
      }
      if (doc.qualityClass == 2) {
        start++
      }
      if (doc.qualityClass == 1) {
        stub++
      }
    })

    console.log(fa);
    console.log(a);
    console.log(ga);
    console.log(b);
    console.log(c);
    console.log(start);
    console.log(stub);

    for (var i = 0; i < docs.length; i++) {
      if (docs[i].qualityClass != 7) {
        docs[i].qualityClass = 2
      }
    }

    for (var i = 0; i < docs.length; i++) {
      if (docs[i].qualityClass == 7) {
        docs[i].qualityClass = 1
      }
    }


    var csv = json2csv({ data: docs, fields: fields })
    fs.writeFile('featNonFeatDataset.csv', csv, function(err) {
      if (err) throw err;
      console.log('CSV Saved!')
      process.exit()
    })




    // for (var i = 0; i < docs.length; i++) {
    //   if (docs[i].qualityClass != 7 && docs[i].qualityClass != 2) {
    //     docs.splice(docs.indexOf(docs[i]), 1)
    //     i--
    //   }
    // }
    //
    // for (var i = 0; i < docs.length; i++) {
    //   if (docs[i].qualityClass == 7) {
    //     docs[i].qualityClass = 1
    //   }
    // }

    // console.log(docs.length);
    //
    // var csv = json2csv({ data: docs, fields: fields })
    // fs.writeFile('datasetWithTrigrams.csv', csv, function(err) {
    //   if (err) throw err;
    //   console.log('CSV Saved!');
    //   process.exit()
    // });




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
