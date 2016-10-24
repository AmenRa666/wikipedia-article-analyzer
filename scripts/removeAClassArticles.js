// open a connection to the database on our locally running instance of MongoDB
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/wikipedia')

// models
var Article = require('../models/article.js').Article

// get notified if we connect successfully or if a connection error occurs
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to MongoDB')
  var query = {qualityClass: 4};
  Article.remove(query, function(err) {
     console.log('A Class Articles Removed!')
     process.exit()
  })
})
