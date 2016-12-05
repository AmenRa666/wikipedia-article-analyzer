var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema maps to a MongoDB collection and defines the shape of the documents within that collection
var revertsSchema = new Schema({
  articleTitle: String,
  revertCount: Number
});

// instances of Models are documents
exports.Revert = mongoose.model('reverts', revertsSchema);
