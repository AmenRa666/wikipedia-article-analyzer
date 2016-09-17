var StanfordSimpleNlp = require('stanford-simple-nlp');

var stanfordSimpleNLP = new StanfordSimpleNLP.StanfordSimpleNLP();
stanfordSimpleNLP.loadPipelineSync();
stanfordSimpleNLP.process('This is so good.', function(err, result) {
  console.log(result);
});
