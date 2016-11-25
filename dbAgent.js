// open a connection to the database on our locally running instance of MongoDB
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/wikipedia')

// models
const Article = require('./models/article.js').Article
const Revision = require('./models/revision.js').Revision
const Revision2 = require('./models/revision2.js').Revision2

// get notified if we connect successfully or if a connection error occurs
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to MongoDB')
})

const insertArticle = (article, cb) => {
  Article.create(article, (err, obj) => {
    if (err) return handleError(err)
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
  Revision.find(query, (err, docs) => {
    if (err) console.log(err);
    else cb(docs)
  })
}

// EXPORTS
module.exports.insertArticle = insertArticle
module.exports.insertRevision = insertRevision
module.exports.findArticleByTitle = findArticleByTitle
module.exports.findById = findById
module.exports.findRevisionByArticleTitle = findRevisionByArticleTitle
