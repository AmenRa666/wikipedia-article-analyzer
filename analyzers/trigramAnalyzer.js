// MODULES


// LOGIC

const getTrigrams = (text, cb) => {
  var trigrams = {}
  for (var i = 0; i <= text.length-3; i++) {
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
module.exports.getTrigrams = getTrigrams
