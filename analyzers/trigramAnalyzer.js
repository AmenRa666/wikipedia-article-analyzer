// MODULES


// LOGIC

const getPosTrigrams = (text, cb) => {
  var trigrams = {}
  for (var i = 0; i < text.length; i += 3) {
    trigram = {
      trigram: text.slice(i, i + 3)
    }
    if (text.slice(i, i + 3).length == 3) {
      if (text.slice(i, i + 3) in trigrams) {
        trigrams[text.slice(i, i + 3)]++
      }
      else {
        trigrams[text.slice(i, i + 3)] = 1
      }
    }
  }
  cb(trigrams)
}


// EXPORTS
module.exports.getPosTrigrams = getPosTrigrams
