// open a connection to the database on our locally running instance of MongoDB
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/wikipedia')

// models
var Article = require('./models/article.js').Article

console.log(Article);

// get notified if we connect successfully or if a connection error occurs
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to MongoDB')
})

exports.insert = function(article) {
  Article.create(article, function (err, obj) {
    if (err) return handleError(err)
    else console.log('Article saved!')
  })
}
