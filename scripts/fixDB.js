// MODULES
var mongoose = require('mongoose')
var async = require('async')
// Open a connection to the database on our locally running instance of MongoDB
mongoose.connect('mongodb://localhost/wikipedia')

// MODEL
var Article = require('../models/article.js').Article


// get notified if we connect successfully or if a connection error occurs
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to MongoDB')

  Article.find({}, (err, docs) => {
    if (err) console.log(err);
    else if (docs) {

      async.eachSeries(
        docs,
        update,
        (err, result) => {
          if (err) console.log(err);
          else console.log('All articles have been updated!');
          process.exit()
        }
      )

    }
    else {
      console.log('Not Found');
      process.exit()
    }
  })
})


const update = (doc, cb) => {
  var _id = doc._id
  var adjCount = doc.adjectiveCount
  var wordCount = doc.wordCount
  var adjRate = adjCount/wordCount
  Article.update({_id: _id}, {$set: {adjectivesRate: adjRate}}, () => {
    cb(null, 'Document Updated')
  })
}
