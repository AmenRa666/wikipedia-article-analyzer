// open a connection to the database on our locally running instance of MongoDB
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/wikipedia')

// models
var Article = require('./models/article.js').Article

// get notified if we connect successfully or if a connection error occurs
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to MongoDB')
})

const insert = (article, cb) => {
  Article.create(article, (err, obj) => {
    if (err) return handleError(err)
    else {
      console.log('Article saved!')
      cb(null, 'Article Saved')
    }
  })
}

const findByTitle = (title, cb) => {
  var query = {"title":title}
  Article.findOne(query, (err, doc) => {
    if (err) console.log(err);
    else cb(doc)
  })
}

const findById = (id, cb) => {
  var query = {"id":id}
  Article.findOne(query, (err, doc) => {
    if (err) console.log(err);
    else cb(doc)
  })
}

// EXPORTS
module.exports.insert = insert
module.exports.findByTitle = findByTitle
module.exports.findById = findById
