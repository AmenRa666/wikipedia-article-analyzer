// MODULES
var _ = require('underscore')
var async = require('async')
var nlp = require('nlp_compromise')
nlp.plugin(require('nlp-syllables'))
var Lemmer = require('lemmer')


// LOGIC
var lexicalFeatures = {
  differentWordCount: 0,
  differentWordsPerSentence: 0,
  differentWordsRate: 0,
  nounCount: 0,
  nounsPerSentence: 0,
  nounsRate: 0,
  differentNounCount: 0,
  differentNounsPerSentence: 0,
  differentNounsRate: 0,
  differentNounsDifferentWordsRatio: 0,
  verbCount: 0,
  verbsPerSentence: 0,
  verbsRate: 0,
  differentVerbCount: 0,
  differentVerbsPerSentence: 0,
  differentVerbsRate: 0,
  differentVerbsDifferentWordsRatio: 0,
  pronounCount: 0,
  pronounsPerSentence: 0,
  pronounsRate: 0,
  differentPronounCount: 0,
  differentPronounsPerSentence: 0,
  differentPronounsRate: 0,
  differentPronounsDifferentWordsRatio: 0,
  adjectiveCount: 0,
  adjectivesPerSentence: 0,
  adjectivesRate: 0,
  differentAdjectiveCount: 0,
  differentAdjectivesPerSentence: 0,
  differentAdjectivesRate: 0,
  differentAdjectivesDifferentWordsRatio: 0,
  adverbCount: 0,
  adverbsPerSentence: 0,
  adverbsRate: 0,
  differentAdverbCount: 0,
  differentAdverbsPerSentence: 0,
  differentAdverbsRate: 0,
  differentAdverbsDifferentWordsRatio: 0,
  coordinatingConjunctionCount: 0,
  coordinatingConjunctionsPerSentence: 0,
  coordinatingConjunctionsRate: 0,
  differentCoordinatingConjunctionCount: 0,
  differentCoordinatingConjunctionsPerSentence: 0,
  differentCoordinatingConjunctionsRate: 0,
  differentCoordinatingConjunctionsDifferentWordsRatio: 0,
  subordinatingPrepositionAndConjunctionCount: 0,
  subordinatingPrepositionsAndConjunctionsPerSentence: 0,
  subordinatingPrepositionsAndConjunctionsRate: 0,
  differentSubordinatingPrepositionAndConjunctionCount: 0,
  differentSubordinatingPrepositionsAndConjunctionsPerSentence: 0,
  differentSubordinatingPrepositionsAndConjunctionsRate: 0,
  differentSubordinatingPrepositionsAndConjunctionsDifferentWordsRatio:0,
  syllablesPerWord: 0,
  charactersPerWord: 0
}

var words = []
var nouns = []
var difNouns = []
var verbs = []
var difVerbs = []
var pronouns = []
var adjectives = []
var adverbs = []
var coordinatingConjunctions = []
var subordinatingPrepositionsAndConjunctions = []
var words = []
var characterCount = 0
var wordCount = 0
var syllableCount = 0
var sentenceCount = 0

const differentWordCount = (cb) => {
  lexicalFeatures.differentWordCount = _.uniq(words).length
  cb(null, 'Count Words')
}

const differentWordsPerSentence = (cb) => {
  lexicalFeatures.differentWordsPerSentence = lexicalFeatures.differentWordCount/sentenceCount
  cb(null, 'Get Different Words Per Sentence')
}

const differentWordsRate = (cb) => {
  lexicalFeatures.differentWordsRate = lexicalFeatures.differentWordCount/wordCount
  cb(null, 'Get Different Words Rate')
}

const countNouns = (cb) => {
  lexicalFeatures.nounCount = nouns.length
  cb(null, 'Count Nouns')
}

const getNounsPerSentence = (cb) => {
  lexicalFeatures.nounsPerSentence = lexicalFeatures.nounCount/sentenceCount
  cb(null, 'Get Nouns Per Sentence')
}

const getNounsRate = (cb) => {
  lexicalFeatures.nounsRate = lexicalFeatures.nounCount/wordCount
  cb(null, 'Get Nouns Rate')
}

const countDifferentNouns = (cb) => {




  // var singularNouns = []
  // for (var i = 0; i < nouns.length; i++) {
  //   if (nouns[i].substr(nouns[i].length - 1) == 's') {
  //     console.log(nouns[i]);
  //     console.log(nouns[i].substring(0, nouns[i].length - 1));
  //     singularNouns.push(nouns[i].substring(0, nouns[i].length - 1))
  //   }
  //   else {
  //     singularNouns.push(nouns[i])
  //   }
  // }




  lexicalFeatures.differentNounCount = _.uniq(difNouns).length
  cb(null, 'Count Different Nouns')
}

const getDifferentNounsPerSentence = (cb) => {
  lexicalFeatures.differentNounsPerSentence = lexicalFeatures.differentNounCount/sentenceCount
  cb(null, 'Get Different Nouns Per Sentence')
}

const getDifferentNounsRate = (cb) => {
  lexicalFeatures.differentNounsRate = lexicalFeatures.differentNounCount/wordCount
  cb(null, 'Get Different Nouns Rate')
}

const getDifferentNounsDifferentWordsRatio = (cb) => {
  lexicalFeatures.differentNounsDifferentWordsRatio = lexicalFeatures.differentNounCount/differentWordCount
  cb(null, 'Get Different Nouns Different Words Ratio')
}

const countVerbs = (cb) => {
  lexicalFeatures.verbCount = verbs.length
    cb(null, 'Count Verbs')
}

const getVerbsPerSentence = (cb) => {
  lexicalFeatures.verbsPerSentence = lexicalFeatures.verbCount/sentenceCount
  cb(null, 'Get Verbs Per Sentence')
}

const getVerbsRate = (cb) => {
  lexicalFeatures.verbsRate = lexicalFeatures.verbCount/wordCount
  cb(null, 'Get Verbs Rate')
}

const countDifferentVerbs = (cb) => {
  lexicalFeatures.differentVerbCount = _.uniq(difVerbs).length
  cb(null, 'Count Different Verbs')
}

const getDifferentVerbsPerSentence = (cb) => {
  lexicalFeatures.differentVerbsPerSentence = lexicalFeatures.differentVerbCount/sentenceCount
  cb(null, 'Get Different Verbs Per Sentence')
}

const getDifferentVerbsRate = (cb) => {
  lexicalFeatures.differentVerbsRate = lexicalFeatures.differentVerbCount/wordCount
  cb(null, 'Get Different Verbs Rate')
}

const getDifferentVerbsDifferentWordsRatio = (cb) => {
  lexicalFeatures.differentVerbsDifferentWordsRatio = lexicalFeatures.differentVerbCount/differentWordCount
  cb(null, 'Get Different Verbs Different Words Ratio')
}

const countPronouns = (cb) => {
  lexicalFeatures.pronounCount = pronouns.length
    cb(null, 'Count Pronouns')
}

const getPronounsPerSentence = (cb) => {
  lexicalFeatures.pronounsPerSentence = lexicalFeatures.pronounCount/sentenceCount
  cb(null, 'Get Pronouns Per Sentence')
}

const getPronounsRate = (cb) => {
  lexicalFeatures.pronounsRate = lexicalFeatures.pronounCount/wordCount
  cb(null, 'Get Pronouns Rate')
}

const countDifferentPronouns = (cb) => {
  lexicalFeatures.differentPronounCount = _.uniq(pronouns).length
  cb(null, 'Count Different Pronouns')
}

const getDifferentPronounsPerSentence = (cb) => {
  lexicalFeatures.differentPronounsPerSentence = lexicalFeatures.differentPronounCount/sentenceCount
  cb(null, 'Get Different Pronouns Per Sentence')
}

const getDifferentPronounsRate = (cb) => {
  lexicalFeatures.differentPronounsRate = lexicalFeatures.differentPronounCount/wordCount
  cb(null, 'Get Different Pronouns Rate')
}

const getDifferentPronounsDifferentWordsRatio = (cb) => {
  lexicalFeatures.differentPronounsDifferentWordsRatio = lexicalFeatures.differentPronounCount/differentWordCount
  cb(null, 'Get Different Pronouns Different Words Ratio')
}

const countAdjectives = (cb) => {
  lexicalFeatures.adjectiveCount = adjectives.length
  cb(null, 'Count Adjectives')
}

const getAdjectivePerSentence = (cb) => {
  lexicalFeatures.adjectivesPerSentence = lexicalFeatures.adjectiveCount/sentenceCount
  cb(null, 'Get Adjective Per Sentence')
}

const getAdjectiveRate = (cb) => {
  lexicalFeatures.adjectivesRate = lexicalFeatures.adjectiveCount/wordCount
  cb(null, 'Get Adjective Rate')
}

const countDifferentAdjectives = (cb) => {
  lexicalFeatures.differentAdjectiveCount = _.uniq(adjectives).length
  cb(null, 'Count Different Adjectives')
}

const getDifferentAdjectivesPerSentence = (cb) => {
  lexicalFeatures.differentAdjectivesPerSentence = lexicalFeatures.differentAdjectiveCount/sentenceCount
  cb(null, 'Get Different Adjectives Per Sentence')
}

const getDifferentAdjectivesRate = (cb) => {
  lexicalFeatures.differentAdjectivesRate = lexicalFeatures.differentAdjectiveCount/wordCount
  cb(null, 'Get Different Adjectives Rate')
}

const getDifferentAdjectivesDifferentWordsRatio = (cb) => {
  lexicalFeatures.differentAdjectivesDifferentWordsRatio = lexicalFeatures.differentAdjectiveCount/differentWordCount
  cb(null, 'Get Different Adjectives Different Words Ratio')
}

const countAdverbs = (cb) => {
  lexicalFeatures.adverbCount = adverbs.length
  cb(null, 'Count Adverbs')
}

const getAdverbsPerSentence = (cb) => {
  lexicalFeatures.adverbsPerSentence = lexicalFeatures.adverbCount/sentenceCount
  cb(null, 'Get Adverbs Per Sentence')
}

const getAdverbsRate = (cb) => {
  lexicalFeatures.adverbsRate = lexicalFeatures.adverbCount/wordCount
  cb(null, 'Get Adverbs Rate')
}

const countDifferentAdverbs = (cb) => {
  lexicalFeatures.differentAdverbCount = _.uniq(adverbs).length
  cb(null, 'Count Different Adverbs')
}

const getDifferentAdverbsPerSentence = (cb) => {
  lexicalFeatures.differentAdverbsPerSentence = lexicalFeatures.differentAdverbCount/sentenceCount
  cb(null, 'Get Different Adverbs Per Sentence')
}

const getDifferentAdverbsRate = (cb) => {
  lexicalFeatures.differentAdverbsRate = lexicalFeatures.differentAdverbCount/wordCount
  cb(null, 'Get Different Adverbs Rate')
}

const getDifferentAdverbsDifferentWordsRatio = (cb) => {
  lexicalFeatures.differentAdverbsDifferentWordsRatio = lexicalFeatures.differentAdverbCount/differentWordCount
  cb(null, 'Get Different Adverbs Different Words Ratio')
}

const countCoordinatingConjunctions = (cb) => {
  lexicalFeatures.coordinatingConjunctionCount = coordinatingConjunctions.length
  cb(null, 'Count Coordinating Conjunctions')
}

const getCoordinatingConjunctionsPerSentence = (cb) => {
  lexicalFeatures.coordinatingConjunctionsPerSentence = lexicalFeatures.coordinatingConjunctionCount/sentenceCount
  cb(null, 'Get Coordinating Conjunctions Per Sentence')
}

const getCoordinatingConjunctionsRate = (cb) => {
  lexicalFeatures.coordinatingConjunctionsRate = lexicalFeatures.coordinatingConjunctionCount/wordCount
  cb(null, 'Get Coordinating Conjunctions Rate')
}

const countDifferentCoordinatingConjunctions = (cb) => {
  lexicalFeatures.differentCoordinatingConjunctionCount = _.uniq(coordinatingConjunctions).length
  cb(null, 'Count Different Coordinating Conjunctions')
}

const getDifferentCoordinatingConjunctionsPerSentence = (cb) => {
  lexicalFeatures.differentCoordinatingConjunctionsPerSentence = lexicalFeatures.differentCoordinatingConjunctionCount/sentenceCount
  cb(null, 'Get Different Coordinating Conjunctions Per Sentence')
}

const getDifferentCoordinatingConjunctionsRate = (cb) => {
  lexicalFeatures.differentCoordinatingConjunctionsRate = lexicalFeatures.differentCoordinatingConjunctionCount/wordCount
  cb(null, 'Get Different Coordinating Conjunctions Rate')
}

const getDifferentCoordinatingConjunctionsDifferentWordsRatio = (cb) => {
  lexicalFeatures.differentCoordinatingConjunctionsDifferentWordsRatio = lexicalFeatures.differentCoordinatingConjunctionCount/differentWordCount
  cb(null, 'Get Different Coordinating Conjunctions Different Words Ratio')
}

const countSubordinatingPrepositionsAndConjunctions = (cb) => {
  lexicalFeatures.subordinatingPrepositionAndConjunctionCount = subordinatingPrepositionsAndConjunctions.length
  cb(null, 'Count Subordinating Prepositions And Conjunctions')
}

const getSubordinatingPrepositionsAndConjunctionsPerSentence = (cb) => {
  lexicalFeatures.subordinatingPrepositionsAndConjunctionsPerSentence = lexicalFeatures.subordinatingPrepositionAndConjunctionCount/sentenceCount
  cb(null, 'Get Subordinating Prepositions And Conjunctions Per Sentence')
}

const getSubordinatingPrepositionsAndConjunctionsRate = (cb) => {
  lexicalFeatures.subordinatingPrepositionsAndConjunctionsRate = lexicalFeatures.subordinatingPrepositionAndConjunctionCount/wordCount
  cb(null, 'Get Subordinating Prepositions And Conjunctions Rate')
}

const countDifferentSubordinatingPrepositionsAndConjunctions = (cb) => {
  lexicalFeatures.differentSubordinatingPrepositionAndConjunctionCount = _.uniq(subordinatingPrepositionsAndConjunctions).length
  cb(null, 'Count Different Subordinating Prepositions And Conjunctions')
}

const getDifferentSubordinatingPrepositionsAndConjunctionsPerSentence = (cb) => {
  lexicalFeatures.differentSubordinatingPrepositionsAndConjunctionsPerSentence = lexicalFeatures.differentSubordinatingPrepositionAndConjunctionCount/sentenceCount
  cb(null, 'Get Different Subordinating Prepositions And Conjunctions Per Sentence')
}

const getDifferentSubordinatingPrepositionsAndConjunctionsRate = (cb) => {
  lexicalFeatures.differentSubordinatingPrepositionsAndConjunctionsRate = lexicalFeatures.differentSubordinatingPrepositionAndConjunctionCount/wordCount
  cb(null, 'Get Different Subordinating Prepositions And Conjunctions Rate')
}

const getDifferentSubordinatingPrepositionsAndConjunctionsDifferentWordsRatio = (cb) => {
  lexicalFeatures.differentSubordinatingPrepositionsAndConjunctionsDifferentWordsRatio = lexicalFeatures.differentSubordinatingPrepositionAndConjunctionCount/differentWordCount
  cb(null, 'Get Different Subordinating Prepositions And Conjunctions Different Words Ratio')
}

const getSyllablesPerWord = (cb) => {
  lexicalFeatures.syllablesPerWord = syllableCount/wordCount
  cb(null, 'Get Syllables Per Word')
}

const getCharactersPerWord = (cb) => {
  lexicalFeatures.charactersPerWord = characterCount/wordCount
  cb(null, 'Get Characters Per Word')
}

/////////////////////////////////// ANALYZE ///////////////////////////////////

const analyze = (pos, _words, _characterCount, _wordCount, _syllableCount, _sentenceCount, cb) => {
  words = _words
  characterCount = _characterCount
  wordCount = _wordCount
  syllableCount = _syllableCount
  sentenceCount = _sentenceCount

  // All type of nouns together
  nouns = pos.singolarCommonNounsAndMasses.concat(pos.pluralCommonNouns, pos.singularProperNouns, pos.pluralProperNouns)

  verbs = pos.modalAuxiliaries.concat(pos.pastTenseVerbs, pos.notThirdPersonSingularPresentTenseVerbs, pos.thirdPersonSingularPresentTenseVerbs)

  difVerbs = pos.modalAuxiliaries.concat(pos.pastTenseVerbs, pos.notThirdPersonSingularPresentTenseVerbs, pos.thirdPersonSingularPresentTenseVerbs, pos.presentParticipleAndGerundVerbs,
  pos.pastParticipleVerbs)

  // All type of pronouns together
  pronouns = pos.personalPronouns.concat(pos.personalPronouns, pos.existentialTheres, pos.whPronouns, pos.possessiveWHPronouns)

  // All type of adjectives together
  adjectives = pos.ordinalAdjectivesAndNumerals.concat(pos.comparativeAdjectives, pos.superlativeAdjectives)

  // All type of adverbs together
  adverbs = pos.adverbs.concat(pos.comparativeAdverbs, pos.superlativeAdverbs, pos.whAdverbTag)

  coordinatingConjunctions = pos.coordinatingConjunctions

  subordinatingPrepositionsAndConjunctions = pos.subordinatingPrepositionsAndConjunctions

  Lemmer.lemmatize(difVerbs, function(err, _lemmatizedDifVerbs){
    if (err) console.log(err);
    difVerbs = _lemmatizedDifVerbs

    Lemmer.lemmatize(nouns, function(err, _lemmatizedNouns){
      if (err) console.log(err);
      difNouns = _lemmatizedNouns

      async.parallel([
        getSyllablesPerWord,
        getCharactersPerWord,

        (cb) => {
          async.series([
            differentWordCount,
            (cb) => {
              async.parallel([
                differentWordsPerSentence,
                differentWordsRate
              ], cb )
            }
          ], cb)
        },

        (cb) => {
          async.series([
            countNouns,
            (cb) => {
              async.parallel([
                getNounsPerSentence,
                getNounsRate
              ], cb )
            }
          ], cb)
        },

        (cb) => {
          async.series([
            countDifferentNouns,
            (cb) => {
              async.parallel([
                getDifferentNounsPerSentence,
                getDifferentNounsRate,
                getDifferentNounsDifferentWordsRatio
              ], cb )
            }
          ], cb)
        },

        (cb) => {
          async.series([
            countVerbs,
            (cb) => {
              async.parallel([
                getVerbsPerSentence,
                getVerbsRate
              ], cb )
            }
          ], cb)
        },

        (cb) => {
          async.series([
            countDifferentVerbs,
            (cb) => {
              async.parallel([
                getDifferentVerbsPerSentence,
                getDifferentVerbsRate,
                getDifferentVerbsDifferentWordsRatio
              ], cb )
            }
          ], cb)
        },

        (cb) => {
          async.series([
            countPronouns,
            (cb) => {
              async.parallel([
                getPronounsPerSentence,
                getPronounsRate
              ], cb )
            }
          ], cb)
        },

        (cb) => {
          async.series([
            countDifferentPronouns,
            (cb) => {
              async.parallel([
                getDifferentPronounsPerSentence,
                getDifferentPronounsRate,
                getDifferentPronounsDifferentWordsRatio
              ], cb )
            }
          ], cb)
        },

        (cb) => {
          async.series([
            countAdjectives,
            (cb) => {
              async.parallel([
                getAdjectivePerSentence,
                getAdjectiveRate
              ], cb )
            }
          ], cb)
        },

        (cb) => {
          async.series([
            countDifferentAdjectives,
            (cb) => {
              async.parallel([
                getDifferentAdjectivesPerSentence,
                getDifferentAdjectivesRate,
                getDifferentAdjectivesDifferentWordsRatio
              ], cb )
            }
          ], cb)
        },

        (cb) => {
          async.series([
            countAdverbs,
            (cb) => {
              async.parallel([
                getAdverbsPerSentence,
                getAdverbsRate
              ], cb )
            }
          ], cb)
        },

        (cb) => {
          async.series([
            countDifferentAdverbs,
            (cb) => {
              async.parallel([
                getDifferentAdverbsPerSentence,
                getDifferentAdverbsRate,
                getDifferentAdverbsDifferentWordsRatio
              ], cb )
            }
          ], cb)
        },

        (cb) => {
          async.series([
            countCoordinatingConjunctions,
            (cb) => {
              async.parallel([
                getCoordinatingConjunctionsPerSentence,
                getCoordinatingConjunctionsRate
              ], cb )
            }
          ], cb)
        },

        (cb) => {
          async.series([
            countDifferentCoordinatingConjunctions,
            (cb) => {
              async.parallel([
                getDifferentCoordinatingConjunctionsPerSentence,
                getDifferentCoordinatingConjunctionsRate,
                getDifferentCoordinatingConjunctionsDifferentWordsRatio
              ], cb )
            }
          ], cb)
        },

        (cb) => {
          async.series([
            countSubordinatingPrepositionsAndConjunctions,
            (cb) => {
              async.parallel([
                getSubordinatingPrepositionsAndConjunctionsPerSentence,
                getSubordinatingPrepositionsAndConjunctionsRate
              ], cb )
            }
          ], cb)
        },

        (cb) => {
          async.series([
            countDifferentSubordinatingPrepositionsAndConjunctions,
            (cb) => {
              async.parallel([
                getDifferentSubordinatingPrepositionsAndConjunctionsPerSentence,
                getDifferentSubordinatingPrepositionsAndConjunctionsRate,
                getDifferentSubordinatingPrepositionsAndConjunctionsDifferentWordsRatio
              ], cb )
            }
          ], cb)
        },

      ],
      (err, result) => {
        cb(lexicalFeatures)
      })




    })
  })
}


// EXPORTS
module.exports.analyze = analyze
