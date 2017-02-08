// MODULES


// LOGIC
const charTrigrams = [
  "ter",
  "er ",
  " wa",
  "was",
  "as ",
  "s a",
  " a ",
  "an ",
  "e a",
  " an",
  "and",
  "nd ",
  " re",
  "ent",
  " of",
  "of ",
  "f t",
  " th",
  "the",
  "he ",
  "on ",
  ", a",
  "at ",
  "ed ",
  " on",
  "n t",
  "or ",
  "ing",
  "ng ",
  " in",
  "in ",
  "d t",
  "d a",
  " he",
  " to",
  "ted",
  "th ",
  "al ",
  "es ",
  "ate",
  " co",
  "ion",
  "ere",
  " fo",
  "for",
  "s, ",
  "to ",
  "ati",
  "st ",
  "re ",
  " be",
  "ly ",
  "her",
  " hi",
  "his",
  "is ",
  "e t",
  "en ",
  "e o",
  "t t",
  ". T",
  "tio",
  " Th"
]

const getCharTrigrams = (text, cb) => {
  let charTrigramsObj = {
    "ter": 0,
    "er_": 0,
    "_wa": 0,
    "was": 0,
    "as_": 0,
    "s_a": 0,
    "_a_": 0,
    "an_": 0,
    "e_a": 0,
    "_an": 0,
    "and": 0,
    "nd_": 0,
    "_re": 0,
    "ent": 0,
    "_of": 0,
    "of_": 0,
    "f_t": 0,
    "_th": 0,
    "the": 0,
    "he_": 0,
    "on_": 0,
    ",_a": 0,
    "at_": 0,
    "ed_": 0,
    "_on": 0,
    "n_t": 0,
    "or_": 0,
    "ing": 0,
    "ng_": 0,
    "_in": 0,
    "in_": 0,
    "d_t": 0,
    "d_a": 0,
    "_he": 0,
    "_to": 0,
    "ted": 0,
    "th_": 0,
    "al_": 0,
    "es_": 0,
    "ate": 0,
    "_co": 0,
    "ion": 0,
    "ere": 0,
    "_fo": 0,
    "for": 0,
    "s,_": 0,
    "to_": 0,
    "ati": 0,
    "st_": 0,
    "re_": 0,
    "_be": 0,
    "ly_": 0,
    "her": 0,
    "_hi": 0,
    "his": 0,
    "is_": 0,
    "e_t": 0,
    "en_": 0,
    "e_o": 0,
    "t_t": 0,
    "._T": 0,
    "tio": 0,
    "_Th": 0
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
