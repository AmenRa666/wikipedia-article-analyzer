var WordNet = require("node-wordnet")
var wordnet = new WordNet({cache:true})
var async = require("async")
var _ = require("underscore")


var words = ['Die', 'is', 'goes', 'has', 'been']
// var words = ['has']
var lemmatizedVerbs = []
var lemmatizedNouns = []


const lemmatizeVerb = (verb, cb) => {
  wordnet.validForms(verb, (results) => {
    if (results.length > 0) {
      for (var i = 0; i < results.length; i++) {
        if (results[i].slice(-1) === 'v') {
          lemmatizedVerbs.push(results[i].substring(0, results[i].length - 2))
          break
        }
      }
    }
    cb(null, lemmatizedVerbs)
  })
}

const lemmatizeNoun = (noun, cb) => {
  wordnet.validForms(noun, (results) => {
    if (results.length > 0) {
      for (var i = 0; i < results.length; i++) {
        if (results[i].slice(-1) === 'n') {
          lemmatizedNouns.push(results[i].substring(0, results[i].length - 2))
          break
        }
      }
    }
    cb(null, 'Lemmatize noun')
  })
}

const lemmatizeVerbs = (verbs, cb) => {
  verbs = verbs.map((verb) => {
    return verb.toLowerCase()
  })
  async.each(
    verbs,
    lemmatizeVerb,
    (err, res) => {
      if (err) throw err
      else {
        cb(null, 'Lemmatize verbs')
      }
    }
  )
}

const lemmatizeNouns = (nouns, cb) => {
  nouns = nouns.map((noun) => {
    return noun.toLowerCase()
  })
  async.each(
    nouns,
    lemmatizeNoun,
    (err, res) => {
      if (err) throw err
      else {
        cb(null, 'Lemmatize nouns')
      }
    }
  )
}

const lemmatize = (cb) => {
  async.parallel([
    async.apply(lemmatizeVerbs, words),
    async.apply(lemmatizeNouns, words)
    ], (err, res) => {
      lemmatizedVerbs = _.uniq(lemmatizedVerbs)
      lemmatizedNouns = _.uniq(lemmatizedNouns)
    }
  )
}







// async.parallel([
//   async.apply(lemmatizeVerbs, words),
//   async.apply(lemmatizeNouns, words)
//   ], (err, res) => {
//     lemmatizedVerbs = _.uniq(lemmatizedVerbs)
//     lemmatizedNouns = _.uniq(lemmatizedNouns)
//   }
// )
