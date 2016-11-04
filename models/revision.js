var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema maps to a MongoDB collection and defines the shape of the documents within that collection
var revisionsSchema = new Schema({
  user: String,
  timestamp: Date,
  articleTitle: String
});

// instances of Models are documents
exports.Revision = mongoose.model('revisions', revisionsSchema);