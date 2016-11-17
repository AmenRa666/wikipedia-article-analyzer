// MODULES
var math = require('mathjs')
var async = require('async')
var _ = require('underscore')
var fs = require('fs')
var path = require("path")
// Database Agent
var dbAgent = require('../dbAgent.js')


// LOGIC

var articleTitle = "Monadnock_Building"

var reviews = []
var timestamps = []
var users = []

var reviewFeatures = {
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
  lastThreeMonthsReviewRate: 0,
  mostActiveUsersReviewCount: 0,
  mostActiveUsersReviewRate: 0,
  occasionalUsersReviewCount: 0,
  occasionalUsersReviewRate: 0,
  lastThreeMonthsReviewCount: 0,
  lastThreeMonthsReviewRate: 0
}

const getAge = (cb) => {
  var creationDate = timestamps[timestamps.length - 1]
  var today = new Date()
  var timeDiff = Math.abs(today.getTime() - creationDate.getTime())
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
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
  var reviewsGroupedByUser = []
  users.forEach((user) => {
    var reviewByUser = 0
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
  var reviewCount = reviews.length

  var registeredReviewCount = 0
  var anonymouseReviewCount = 0
  reviews.forEach((review) => {
    var registered = false
    var blocks = review.user.split('.')
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
  reviewFeatures.registeredAnonymouseReviewRatio = registeredReviewCount/anonymouseReviewCount

  cb(null, 'Get Review Count')
}

const countDiscussion = (cb) => {
  var folder = '../articlesTalkPages/'
  var paths = [
    'stubArticlesTalkPages/',
    'startArticlesTalkPages/',
    'cClassArticlesTalkPages/',
    'bClassArticlesTalkPages/',
    'goodArticlesTalkPages/',
    'aClassArticlesTalkPages/',
    'featuredArticlesTalkPages/',
  ]
  dbAgent.findArticleByTitle(articleTitle.replace(/_/g, ' '), (doc) => {
    var xmlFilename = folder + paths[doc.qualityClass - 1] + 'Talk:' + articleTitle + '.xml'
    fs.readFile(path.join(__dirname, folder, xmlFilename), 'utf8', (err, talkPage) => {
      if (err) throw err
      else {
        // Remove subsubsection titles and similar
        var subsubsectionRegex = /===(.+?)===/g
        talkPage = talkPage.replace(subsubsectionRegex, '') || []
        // Count sections
        var sectionsRegex = /==(.+?)==/g
        var rawSections = talkPage.match(sectionsRegex) || []
        reviewFeatures.discussionCount = rawSections.length
        cb(null, 'Count Discussion')
      }
    })
  })
}

const countUsers = (cb) => {
  var userCount = users.length
  var registeredUserCount = 0
  var anonymouseUserCount = 0
  users.forEach((user) => {
    var registered = false
    var blocks = user.split('.')
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

  var usersActivity = []
  var occasionalUsers = []

  users.forEach((user) => {
    var editCount = 0
    reviews.forEach((review) => {
      if (review.user == user) {
        editCount++
      }
    })
    var u = {
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
  var fivePercent = Math.round((userCount*5)/100)
  var mostActiveUsersReviewCount = 0
  var mostActiveUsersReviewRate = 0
  for (var i = 0; i < fivePercent; i++) {
    mostActiveUsersReviewCount = mostActiveUsersReviewCount + usersActivity[i].editCount
  }

  var occasionalUsersReviewCount = 0
  occasionalUsers.forEach((user) => {
    occasionalUsersReviewCount = occasionalUsersReviewCount + user.editCount
  })


  reviewFeatures.userCount = userCount
  reviewFeatures.registeredUserCount = registeredUserCount
  reviewFeatures.anonymouseUserCount = anonymouseUserCount
  reviewFeatures.registerdAnonymouseUserRatio = registeredUserCount/anonymouseUserCount
  reviewFeatures.registeredUserRate = registeredUserCount/userCount
  reviewFeatures.anonymouseUserRate = anonymouseUserCount/userCount
  reviewFeatures.occasionalUserCount = occasionalUsers.length
  reviewFeatures.occasionalUserRate = occasionalUsers.length/userCount
  reviewFeatures.mostActiveUsersReviewCount = mostActiveUsersReviewCount
  reviewFeatures.mostActiveUsersReviewRate = mostActiveUsersReviewCount/reviews.length
  reviewFeatures.occasionalUsersReviewCount = occasionalUsersReviewCount
  reviewFeatures.occasionalUsersReviewRate = occasionalUsersReviewCount/reviews.length
  cb(null, 'Count Users')
}

const getDiversity = (cb) => {
  reviewFeatures.diversity = reviewFeatures.userCount/reviewFeatures.reviewCount
  cb(null, 'Count Users')
}

const getThreeMonthsAgoFeatures = (cb) => {
  var today = new Date();
  var todayThreeMonthsAgo = new Date(today.setMonth(today.getMonth() - 3))
  var lastThreeMonthsReviews = []
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

dbAgent.findRevisionByArticleTitle(articleTitle, (docs) => {
  reviews = docs
  timestamps = []
  users = []
  reviewFeatures.age = 0
  reviewFeatures.agePerReview = 0
  reviewFeatures.reviewPerDay = 0
  reviewFeatures.reviewsPerUser = 0
  reviewFeatures.reviewsPerUserStdDev = 0
  reviewFeatures.reviewCount = 0
  reviewFeatures.discussionCount = 0
  reviewFeatures.userCount = 0
  reviewFeatures.registeredUserCount = 0
  reviewFeatures.anonymouseUserCount = 0
  reviewFeatures.registerdAnonymouseUserRatio = 0
  reviewFeatures.registeredUserRate = 0
  reviewFeatures.anonymouseUserRate = 0
  // console.log(timestamps.length);

  docs.sort((a,b) => {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  docs.forEach((review) => {
    timestamps.push(review.timestamp)
    users.push(review.user)
  })

  users = _.uniq(users)

  async.parallel([
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
      console.log(reviewFeatures);
      process.exit()
    }
  })


})




//////////////////////////////////////////////////////////////////////////////

Array.prototype.min = function() {
  return Math.min.apply(null, this)
}

Array.prototype.max = function() {
  return Math.max.apply(null, this)
}
