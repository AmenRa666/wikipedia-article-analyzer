// MODULES
const math = require('mathjs')
const async = require('async')
const _ = require('underscore')
const fs = require('fs')
const path = require("path")
const PythonShell = require('python-shell')
const mkdirp = require('mkdirp')
const request = require('request')
const nlp = require('nlp_compromise')
// const sanitize = require("sanitize-filename")
// Database Agent
const dbAgent = require('../dbAgent.js')


// LOGIC
let articleTitle = ''

const folder = path.join('..', 'articles', 'talkPagesXML')
const paths = [
  'stubArticles',
  'startArticles',
  'cClassArticles',
  'bClassArticles',
  'goodArticles',
  'aClassArticles',
  'featuredArticles',
]

// let _reverts = fs.readFileSync(path.join(__dirname, '..', 'reverts.csv'), 'utf8').trim().split('\n')
// _reverts.shift()
//
// let reverts = []
//
// _reverts.forEach((revert) => {
//   revert = revert.split(/"/)
//   revert.shift()
//   revert[1] = revert[1].replace(/,/g, '').replace(/\r/g, '')
//   reverts.push(revert)
// })

let reviews = []
let timestamps = []
let users = []
let sentences = []
let qualityClass = null

const dir = 'tmp'
const specialExportUrl = 'https://en.wikipedia.org/w/index.php?title=Special:Export&pages='

let reviewFeatures = {
  age: 0,
  agePerReview: 0,
  reviewPerDay: 0,
  reviewsPerUser: 0,
  reviewsPerUserStdDev: 0,
  discussionCount: 0,
  reviewCount: 0,
  registeredReviewCount: 0,
  anonymouseReviewCount: 0,
  registeredReviewRate: 0,
  anonymouseReviewRate: 0,
  registeredAnonymouseReviewRatio: 0,
  userCount: 0,
  occasionalUserCount: 0,
  occasionalUserRate: 0,
  registeredUserCount: 0,
  anonymouseUserCount: 0,
  registerdAnonymouseUserRatio: 0,
  registeredUserRate: 0,
  anonymouseUserRate: 0,
  revertCount:0,
  revertReviewRatio: 0,
  diversity: 0,
  modifiedLinesRate: 0,
  mostActiveUsersReviewCount: 0,
  mostActiveUsersReviewRate: 0,
  occasionalReviewCount: 0,
  occasionalReviewRate: 0,
  lastThreeMonthsReviewCount: 0,
  lastThreeMonthsReviewRate: 0
}

const getAge = (cb) => {
  let creationDate = timestamps[timestamps.length - 1]
  let today = new Date()
  let timeDiff = Math.abs(today.getTime() - creationDate.getTime())
  let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
  reviewFeatures.age = diffDays
  cb(null, 'Get Age')
}

const getAgePerReview = (cb) => {
  reviewFeatures.agePerReview = reviewFeatures.age/reviews.length
  cb(null, 'Get Age Per Review')
}

const getReviewPerDay = (cb) => {
  reviewFeatures.reviewPerDay = reviews.length/reviewFeatures.age
  cb(null, 'Get Review Per Day')
}

const getReviewsPerUser = (cb) => {
  reviewFeatures.reviewsPerUser = reviews.length/users.length
  cb(null, 'Get Review Per User')
}

const getReviewsPerUserStdDev = (cb) => {
  let reviewsGroupedByUser = []
  users.forEach((user) => {
    let reviewByUser = 0
    reviews.forEach((review) => {
      if (review.user == user) {
        reviewByUser++
      }
    })
    reviewsGroupedByUser.push(reviewByUser)
  })
  reviewFeatures.reviewsPerUserStdDev = math.std(reviewsGroupedByUser)
  cb(null, 'Get Review Per User Std Dev')
}

const countReviews = (cb) => {
  let reviewCount = reviews.length
  let registeredReviewCount = 0
  let anonymouseReviewCount = 0
  reviews.forEach((review) => {
    let registered = false
    let blocks = review.user.split('.')
    if (blocks.length < 4 || blocks.length > 8) {
      registered = true
    }
    else {
      blocks.forEach((block) => {
        if (block < 0 || block > 255) {
          registered = true
        }
      })
    }
    if (registered) {
      registeredReviewCount++
    }
    else {
      anonymouseReviewCount++
    }
  })

  reviewFeatures.reviewCount = reviewCount
  reviewFeatures.registeredReviewCount = registeredReviewCount
  reviewFeatures.anonymouseReviewCount = anonymouseReviewCount
  reviewFeatures.registeredReviewRate = registeredReviewCount/reviewCount
  reviewFeatures.anonymouseReviewRate = anonymouseReviewCount/reviewCount
  if (anonymouseReviewCount > 0) {
    reviewFeatures.registeredAnonymouseReviewRatio = registeredReviewCount/anonymouseReviewCount
  }
  else {
    reviewFeatures.registeredAnonymouseReviewRatio = registeredReviewCount
  }
  cb(null, 'Get Review Count')
}

const countDiscussion = (cb) => {
  // dbAgent.findArticleByTitle(articleTitle.replace(/_/g, ' '), (doc) => {
    // let xmlFilename = folder + paths[doc.qualityClass - 1] + 'Talk-' + sanitize(articleTitle) + '.xml'

    // let xmlFilename = path.join(folder, paths[qualityClass - 1], ('Talk&#58;' + articleTitle.replace(/ /g, '_') + '.xml'))
    let xmlFilename = path.join(folder, paths[qualityClass - 1], ('Talk&#58;' + articleTitle + '.xml'))

    fs.readFile(path.join(__dirname, xmlFilename), 'utf8', (err, talkPage) => {
      if (err) throw err
      else {
        // Remove subsubsection titles and similar
        const subsubsectionRegex = /===(.+?)===/g
        talkPage = talkPage.replace(subsubsectionRegex, '') || []
        // Count sections
        const sectionsRegex = /==(.+?)==/g
        let rawSections = talkPage.match(sectionsRegex) || []
        reviewFeatures.discussionCount = rawSections.length
        cb(null, 'Count Discussion')
      }
    })
  // })
}

const countUsers = (cb) => {
  let userCount = users.length
  let registeredUserCount = 0
  let anonymouseUserCount = 0
  users.forEach((user) => {
    let registered = false
    let blocks = user.split('.')
    if (blocks.length < 4 || blocks.length > 8) {
      registered = true
    }
    else {
      blocks.forEach((block) => {
        if (block < 0 || block > 255) {
          registered = true
        }
      })
    }
    if (registered) {
      registeredUserCount++
    }
    else {
      anonymouseUserCount++
    }
  })

  let usersActivity = []
  let occasionalUsers = []

  users.forEach((user) => {
    let editCount = 0
    reviews.forEach((review) => {
      if (review.user == user) {
        editCount++
      }
    })
    let u = {
      username: user,
      editCount: editCount
    }
    usersActivity.push(u)
    if (editCount < 4) {
      occasionalUsers.push(u)
    }
  })

  usersActivity.sort((a, b) => {
    return parseFloat(b.editCount) - parseFloat(a.editCount);
  });

  // Most active users
  let fivePercent = Math.round((userCount*5)/100)
  let mostActiveUsersReviewCount = 0
  let mostActiveUsersReviewRate = 0
  for (let i = 0; i < fivePercent; i++) {
    mostActiveUsersReviewCount = mostActiveUsersReviewCount + usersActivity[i].editCount
  }

  let occasionalReviewCount = 0
  occasionalUsers.forEach((user) => {
    occasionalReviewCount = occasionalReviewCount + user.editCount
  })


  reviewFeatures.userCount = userCount
  reviewFeatures.registeredUserCount = registeredUserCount
  reviewFeatures.anonymouseUserCount = anonymouseUserCount
  if (anonymouseUserCount > 0) {
    reviewFeatures.registerdAnonymouseUserRatio = registeredUserCount/anonymouseUserCount
  }
  else {
    reviewFeatures.registerdAnonymouseUserRatio = registeredUserCount
  }
  reviewFeatures.registeredUserRate = registeredUserCount/userCount
  reviewFeatures.anonymouseUserRate = anonymouseUserCount/userCount
  reviewFeatures.occasionalUserCount = occasionalUsers.length
  reviewFeatures.occasionalUserRate = occasionalUsers.length/userCount
  reviewFeatures.mostActiveUsersReviewCount = mostActiveUsersReviewCount
  reviewFeatures.mostActiveUsersReviewRate = mostActiveUsersReviewCount/reviews.length
  reviewFeatures.occasionalReviewCount = occasionalReviewCount
  reviewFeatures.occasionalReviewRate = occasionalReviewCount/reviews.length
  cb(null, 'Count Users')
}

const getDiversity = (cb) => {
  reviewFeatures.diversity = reviewFeatures.userCount/reviewFeatures.reviewCount
  cb(null, 'Count Users')
}

const getThreeMonthsAgoFeatures = (cb) => {
  let today = new Date();
  let todayThreeMonthsAgo = new Date(today.setMonth(today.getMonth() - 3))
  let lastThreeMonthsReviews = []
  reviews.forEach((review) => {
    if (new Date(review.timestamp) > todayThreeMonthsAgo) {
      lastThreeMonthsReviews.push(review)
    }
  })

  lastThreeMonthsReviewCount = lastThreeMonthsReviews.length
  lastThreeMonthsReviewRate = lastThreeMonthsReviewCount/reviews.length

  reviewFeatures.lastThreeMonthsReviewCount = lastThreeMonthsReviewCount
  reviewFeatures.lastThreeMonthsReviewRate = lastThreeMonthsReviewRate

  cb(null, 'Get Three Months Ago Features')
}

const getRevertsFeatures = (cb) => {
  let revertCount = 0

  dbAgent.findRevertsByArticleTitle(decodeURIComponent(articleTitle).replace(/_/g, ' '), (reverts) => {
    revertCount = reverts.length
    reviewFeatures.revertCount = revertCount
    reviewFeatures.revertReviewRatio = revertCount/reviews.length
    cb(null, 'Get Revers Features')
  })
}

const getModifiedLinesRate = (cb) => {
  let date = new Date(reviews[0].timestamp);
  date.setMonth(date.getMonth()-3)
  let offset = date.toISOString()
  let url = specialExportUrl + reviews[0].articleTitle + '&offset=' + offset + '&limit=1'
  url = url.replace(/&#58;/g, ':')
  request.post(url, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      let data = body
      let filename = 'threeMonthsAgoRevision.xml'
      let _path = path.join(dir, filename)
      mkdirp(dir, (err) => {
        if (err) throw err
        else {
          fs.writeFileSync(_path, data)
          let options = {
            args: ['-o', 'tmp', '-q', _path]
          };
          // Run Python script
          PythonShell.run('./WikiExtractor.py', options, (err, results) => {
            if (err && JSON.stringify(err.toString()).indexOf('2703') == -1) {
              throw err
            }
            else {
              // Load extracted article
              fs.readFile('./tmp/AA/wiki_00', 'utf8', (err, extractedArticle) => {
                if (err) throw err
                else {
                  // Delete surraunding tags (<doc> ...text... <\doc>)
                  extractedArticle = extractedArticle.substring(extractedArticle.indexOf(">") + 1, extractedArticle.length - 7).trim()
                  // Removes title
                  extractedArticle = extractedArticle.substring(extractedArticle.indexOf("\n")).trim()
                  // Extract sentences
                  let _oldSentences = nlp.text(extractedArticle).sentences
                  let oldSentences = []
                  _oldSentences.forEach((sentence) => {
                    oldSentences.push(sentence.str)
                  })

                  let modifiedLinesRate = 0

                  oldSentences.forEach((sentence) => {
                    if (sentences.indexOf(sentence) == -1) {
                      modifiedLinesRate++
                    }
                  })

                  reviewFeatures.modifiedLinesRate = modifiedLinesRate
                  cb(null, 'Get Modified Lines Rate')
                }
              })
            }
          })
        }
      })
    }
    else {
      console.log(err);
      process.exit()
    }
  })
}



const getReviewFeatures = (_articleTitle, _qualityClass, _sentences, cb) => {
  articleTitle = _articleTitle.replace(/&amp;/g, '&').replace(/∕/g, '/')
  dbAgent.findRevisionByArticleTitle(articleTitle.replace(/ /g, '_'), (revisions) => {

    for (let i = 0; i < revisions.length; i++) {
      if(!revisions[i].user) {
        revisions[i].user = 'undefined' + i
      }
    }

    reviews = revisions
    timestamps = []
    users = []
    sentences = []

    _sentences.forEach((sentence) => {
      sentences.push(sentence.str)
    })

    qualityClass = _qualityClass

    reviewFeatures.age = 0
    reviewFeatures.agePerReview = 0
    reviewFeatures.reviewPerDay = 0
    reviewFeatures.reviewsPerUser = 0
    reviewFeatures.reviewsPerUserStdDev = 0
    reviewFeatures.discussionCount = 0
    reviewFeatures.reviewCount = 0
    reviewFeatures.registeredReviewCount = 0
    reviewFeatures.anonymouseReviewCount = 0
    reviewFeatures.registeredReviewRate = 0
    reviewFeatures.anonymouseReviewRate = 0
    reviewFeatures.registeredAnonymouseReviewRatio = 0
    reviewFeatures.userCount = 0
    reviewFeatures.occasionalUserCount = 0
    reviewFeatures.occasionalUserRate = 0
    reviewFeatures.registeredUserCount = 0
    reviewFeatures.anonymouseUserCount = 0
    reviewFeatures.registerdAnonymouseUserRatio = 0
    reviewFeatures.registeredUserRate = 0
    reviewFeatures.anonymouseUserRate = 0
    reviewFeatures.revertCount = 0
    reviewFeatures.revertReviewRatio = 0
    reviewFeatures.diversity = 0
    reviewFeatures.modifiedLinesRate = 0
    reviewFeatures.mostActiveUsersReviewCount = 0
    reviewFeatures.mostActiveUsersReviewRate = 0
    reviewFeatures.occasionalReviewCount = 0
    reviewFeatures.occasionalReviewRate = 0
    reviewFeatures.lastThreeMonthsReviewCount = 0
    reviewFeatures.lastThreeMonthsReviewRate = 0

    // Sort DESC
    revisions.sort((a,b) => {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    revisions.forEach((review) => {
      timestamps.push(review.timestamp)
      users.push(review.user)
    })

    users = _.uniq(users)

    async.parallel([
      getModifiedLinesRate,
      getRevertsFeatures,
      getReviewsPerUserStdDev,
      countReviews,
      countUsers,
      countDiscussion,
      getDiversity,
      getThreeMonthsAgoFeatures,
      (cb) => {
        async.series([
          getAge,
          (cb) => {
            async.parallel([
              getAgePerReview,
              getReviewPerDay,
              getReviewsPerUser
            ], cb)
          }
        ], cb)
      }
    ], (err, res) => {
      if (err) throw error
      else {
        cb(reviewFeatures)
      }
    })

  })

}


module.exports.getReviewFeatures = getReviewFeatures



//////////////////////////////////////////////////////////////////////////////

Array.prototype.min = function() {
  return Math.min.apply(null, this)
}

Array.prototype.max = function() {
  return Math.max.apply(null, this)
}
