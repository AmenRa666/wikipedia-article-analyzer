// MODULES


// LOGIC
const charTrigrams = [
  "he ",
  "ing",
  "ng ",
  " th",
  "the",
  " of",
  "of ",
  "in ",
  " in",
  "ion",
  "on ",
  "ed ",
  " an",
  "and",
  "nd ",
  "er ",
  " to",
  "to ",
  "as "
]

const getCharTrigrams = (text, cb) => {
  let charTrigramsObj = {
    "he_": 0,
    "ing": 0,
    "ng_": 0,
    "_th": 0,
    "the": 0,
    "_of": 0,
    "of_": 0,
    "in_": 0,
    "_in": 0,
    "ion": 0,
    "on_": 0,
    "ed_": 0,
    "_an": 0,
    "and": 0,
    "nd_": 0,
    "er_": 0,
    "_to": 0,
    "to_": 0,
    "as_": 0
  }

  for (let i = 0; i <= text.length-3; i++) {
    if (charTrigrams.indexOf(text.slice(i, i + 3)) > -1) {
      charTrigramsObj[text.slice(i, i + 3).replace(/ /g, '_')]++
    }
  }

  cb(charTrigramsObj)
}


const getAllCharTrigrams = (text, cb) => {
  let charTrigramsObj = {}

  for (let i = 0; i <= text.length-3; i++) {
    if (text.slice(i, i + 3).length == 3) {
      if (text.slice(i, i + 3) in charTrigramsObj) {
        charTrigramsObj[text.slice(i, i + 3)]++
      }
      else {
        charTrigramsObj[text.slice(i, i + 3)] = 1
      }
    }
  }

  cb(trigrams)
}

// EXPORTS
module.exports.getCharTrigrams = getCharTrigrams
module.exports.getAllCharTrigrams = getAllCharTrigrams
