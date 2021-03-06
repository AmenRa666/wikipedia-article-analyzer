// MODULE
const mongoose = require('mongoose')

// open a connection to the database on our locally running instance of MongoDB
var options = {
  server: {
    socketOptions: {
      keepAlive: 3000000,
      connectTimeoutMS: 300000
     }
   },
   replset: {
    socketOptions: {
      keepAlive: 3000000,
      connectTimeoutMS : 300000
    }
  }
}

var mongodbUri = 'mongodb://localhost/wikipedia'

mongoose.connect(mongodbUri, options)

// models
const Article = require('./models/article.js').Article
const Revision = require('./models/revision.js').Revision
var Revert = require('./models/revert.js').Revert

// get notified if we connect successfully or if a connection error occurs
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to MongoDB')
})

const insertArticle = (article, cb) => {
  Article.create(article, (err, obj) => {
    if (err) {
      console.log(err);
      process.exit()
    }
    else {
      console.log('Article saved!')
      cb(null, 'Article Saved')
    }
  })
}

const findArticleByTitle = (title, cb) => {
  let query = {"title":title}
  Article.findOne(query, (err, doc) => {
    if (err) console.log(err);
    else {
      cb(doc)
    }
  })
}

const findById = (id, cb) => {
  let query = {"id":id}
  Article.findOne(query, (err, doc) => {
    if (err) console.log(err);
    else cb(doc)
  })
}

const insertRevision = (revision, cb) => {
  Revision.create(revision, (err, obj) => {
    if (err) return handleError(err)
    else {
      cb(null, 'Revision Saved')
    }
  })
}

const findRevisionByArticleTitle = (articleTitle, cb) => {
  let query = {"articleTitle":articleTitle}
  Revision.find(query, (err, revisions) => {
    if (err) console.log(err);
    else {
      cb(revisions)
    }
  })
}

const findRevertsByArticleTitle = (articleTitle, cb) => {
  var query = {
    'articleTitle': decodeURIComponent(articleTitle).replace(/_/g, ' ')
  }
  Revert.find(query, (err, reverts) => {
    if (err) console.log(err);
    else cb(reverts)
  })
}

// EXPORTS
module.exports.insertArticle = insertArticle
module.exports.insertRevision = insertRevision
module.exports.findArticleByTitle = findArticleByTitle
module.exports.findById = findById
module.exports.findRevisionByArticleTitle = findRevisionByArticleTitle
module.exports.findRevertsByArticleTitle = findRevertsByArticleTitle
