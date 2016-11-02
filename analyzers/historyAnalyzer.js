// MODULES
var fs = require('fs')
var async = require('async')
// Database Agent
var dbAgent = require('./dbAgent.js')

// LOGIC
var folder = '../articlesHistory/'
var title = 'Raccoon'

var revision = {
  articleID: null,
  user: null,
  timestamp: null
}

fs.readFile(folder + title + '.txt', 'utf8', (err, historyFile) => {
  if (err) throw err

  console.log('- - - - - - - - - - - - - - - - - - - -')
  console.log('HISTORY LOADED: ' + title)
  console.log('- - - - - - - - - - - - - - - - - - - -')

  var revisions = JSON.parse(historyFile)

  var _revisions = []

  for (var i = 0; i < revisions.length; i++) {
    if (revisions[i+1] == undefined) {
      _revisions.push(revisions[i])
    }
    else if (revisions[i].user != revisions[i+1].user) {
      _revisions.push(revisions[i])
    }
  }

  async.eachSeries(
    _revisions,
    dbAgent.insert,
    (err, result) => {
      if (err) console.log(err);
      else console.log('All Revisions Have Been Saved!');
    }
  )


})

const analyze = (title)
