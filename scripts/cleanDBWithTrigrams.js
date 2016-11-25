// open a connection to the database on our locally running instance of MongoDB
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/wikipedia')

// models
const ArticleWithTrigrams = require('../models/articleWithTrigrams.js').ArticleWithTrigrams

// get notified if we connect successfully or if a connection error occurs
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to MongoDB')
  ArticleWithTrigrams.remove({}, function(err) {
     console.log('Collection restarted')
     process.exit()
  })
})
