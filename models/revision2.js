var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema maps to a MongoDB collection and defines the shape of the documents within that collection
var revisions2Schema = new Schema({
  user: String,
  timestamp: Date,
  articleTitle: String,
  revid: String,
  parentid: String,
  size: Number
});

// instances of Models are documents
exports.Revision2 = mongoose.model('revisions2', revisions2Schema);
