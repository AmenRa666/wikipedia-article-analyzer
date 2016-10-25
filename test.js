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
  var query = {"title":'1949 Ambato earthjsavdquake'}

  Article.findOne(query, (err, doc) => {
    if (err) console.log(err);
    else if (doc) {
      console.log('Found')
    }
    else {
      console.log('Not Found');
    }
     process.exit()
  })

})
