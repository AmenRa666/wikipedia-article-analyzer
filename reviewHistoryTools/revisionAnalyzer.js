// MODULES
var math = require('mathjs')
var async = require('async')
var _ = require('underscore')
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
  userCount: 0,
  registeredUserCount: 0,
  anonymouseUserCount: 0,
  registerdAnonymouseUserRatio: 0,
  registeredUserRate: 0,
  anonymouseUserRate: 0
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

const getReviewCount = (cb) => {
  reviewFeatures.reviewCount = reviews.length
  cb(null, 'Get Review Count')
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
  reviewFeatures.userCount = userCount
  reviewFeatures.registeredUserCount = registeredUserCount
  reviewFeatures.anonymouseUserCount = anonymouseUserCount
  reviewFeatures.registerdAnonymouseUserRatio = registeredUserCount/anonymouseUserCount
  reviewFeatures.registeredUserRate = registeredUserCount/userCount
  reviewFeatures.anonymouseUserRate = anonymouseUserCount/userCount
  cb(null, 'Count Users')
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

  // console.log(timestamps);

  async.parallel([
    getReviewsPerUserStdDev,
    getReviewCount,
    countUsers,
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
