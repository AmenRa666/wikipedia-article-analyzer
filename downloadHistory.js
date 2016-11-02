// MODULES
var fs = require('fs')
var request = require('request')
var async = require('async')
var qs = require('querystring')
var mkdirp = require('mkdirp');
var _ = require('underscore')
// Database Agent
// var dbAgent = require('./dbAgent.js')


// LOGIC
var folder = 'articlesHistory/'
var title = 'Raccoon'
var bot = require('nodemw');

// pass configuration object
var client = new bot({
  server: 'en.wikipedia.org',  // host name of MediaWiki-powered site
  path: '/w',                  // path to api.php script
  debug: false                 // is more verbose when set to true
});

var articleTitle = ''

const downloadRevisionHistory = (_title, cb) => {
  articleTitle = _title
  client.getArticleRevisions(articleTitle, (err, data) => {
    if (err) throw err

    var revisions = data
    var _revisions = []

    for (var i = 0; i < revisions.length; i++) {
      if (revisions[i+1] == undefined) {
        _revisions.push(revisions[i])
      }
      else if (revisions[i].user != revisions[i+1].user) {
        _revisions.push(revisions[i])
      }
    }

    console.log(articleTitle + ': ' +revisions.length);

    // cb(null, 'kasjhdkasjhd')

    async.eachSeries(
      _revisions,
      saveRevision,
      (err, result) => {
        if (err) console.log(err);
        else cb(null, 'All Revisions Have Been Saved!')
      }
    )

  })
}

const saveRevision = (_revision, cb) => {
  var revision = {
    articleTitle: articleTitle,
    user: _revision.user,
    timestamp: _revision.timestamp
  }
  dbAgent.insert(revision, (cb))
}

const downloadFeaturedArticlesRevisionHistory = (cb) => {
  var filename = './articleLists/featuredArticleList.txt'
  index = 1
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Featured Article List: LOADED');
    var titles = data.trim().split('\n')
    for (var i = 0; i < titles.length; i++) {
      titles[i] = decodeURIComponent(titles[i].trim())
    }
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Featured Articles download: STARTING');
    console.log('- - - - - - - - - - - - - - - - - - - -')
    async.eachSeries(
      titles,
      downloadRevisionHistory,
      (err, result) => {
      if (err) console.log(err);
      else {
        pathIndex++
        console.log('- - - - - - - - - - - - - - - - - - - -')
        console.log('Featured Articles donwload: DONE');
        console.log('- - - - - - - - - - - - - - - - - - - -')
        cb(null, 'Download Featured Articles')
      }
    })
  })
}

const downloadAClassArticlesRevisionHistory = (cb) => {
  var filename = './articleLists/aClassArticleList.txt'
  index = 1
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('A Class Article List: LOADED');
    var titles = data.trim().split('\n')
    for (var i = 0; i < titles.length; i++) {
      titles[i] = decodeURIComponent(titles[i].trim())
    }
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('A Class Articles download: STARTING');
    console.log('- - - - - - - - - - - - - - - - - - - -')
    async.eachSeries(
      titles,
      downloadRevisionHistory,
      (err, result) => {
      if (err) console.log(err);
      else {
        pathIndex++
        console.log('- - - - - - - - - - - - - - - - - - - -')
        console.log('A Class Articles donwload: DONE');
        console.log('- - - - - - - - - - - - - - - - - - - -')
        cb(null, 'Download A Class Articles')
      }
    })
  })
}

const downloadGoodArticlesRevisionHistory = (cb) => {
  var filename = './articleLists/goodArticleList.txt'
  index = 1
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Good Article List: LOADED');
    var titles = data.trim().split('\n')
    for (var i = 0; i < titles.length; i++) {
      titles[i] = decodeURIComponent(titles[i].trim())
    }
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Good Articles download: STARTING');
    console.log('- - - - - - - - - - - - - - - - - - - -')
    async.eachSeries(
      titles,
      downloadRevisionHistory,
      (err, result) => {
      if (err) console.log(err);
      else {
        pathIndex++
        console.log('- - - - - - - - - - - - - - - - - - - -')
        console.log('Good Articles donwload: DONE');
        console.log('- - - - - - - - - - - - - - - - - - - -')
        cb(null, 'Download Featured Articles')
      }
    })
  })
}

const downloadBClassArticlesRevisionHistory = (cb) => {
  var filename = './articleLists/bClassArticleList.txt'
  index = 1
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('B Class Article List: LOADED');
    var titles = data.trim().split('\n')
    for (var i = 0; i < titles.length; i++) {
      titles[i] = decodeURIComponent(titles[i].trim())
    }
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('B Class Articles download: STARTING');
    console.log('- - - - - - - - - - - - - - - - - - - -')
    async.eachSeries(
      titles,
      downloadRevisionHistory,
      (err, result) => {
      if (err) console.log(err);
      else {
        pathIndex++
        console.log('- - - - - - - - - - - - - - - - - - - -')
        console.log('B Class Articles donwload: DONE');
        console.log('- - - - - - - - - - - - - - - - - - - -')
        cb(null, 'Download B Class Articles')
      }
    })
  })
}

const downloadCClassArticlesRevisionHistory = (cb) => {
  var filename = './articleLists/cClassArticleList.txt'
  index = 1
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('C Class Article List: LOADED');
    var titles = data.trim().split('\n')
    for (var i = 0; i < titles.length; i++) {
      titles[i] = decodeURIComponent(titles[i].trim())
    }
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('C Class Articles download: STARTING');
    console.log('- - - - - - - - - - - - - - - - - - - -')
    async.eachSeries(
      titles,
      downloadRevisionHistory,
      (err, result) => {
      if (err) console.log(err);
      else {
        pathIndex++
        console.log('- - - - - - - - - - - - - - - - - - - -')
        console.log('C Class Articles donwload: DONE');
        console.log('- - - - - - - - - - - - - - - - - - - -')
        cb(null, 'Download B Class Articles')
      }
    })
  })
}

const downloadStartArticlesRevisionHistory = (cb) => {
  var filename = './articleLists/startArticleList.txt'
  index = 1
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Start Article List: LOADED');
    var titles = data.trim().split('\n')
    for (var i = 0; i < titles.length; i++) {
      titles[i] = decodeURIComponent(titles[i].trim())
    }
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Start Articles download: STARTING');
    console.log('- - - - - - - - - - - - - - - - - - - -')
    async.eachSeries(
      titles,
      downloadRevisionHistory,
      (err, result) => {
      if (err) console.log(err);
      else {
        pathIndex++
        console.log('- - - - - - - - - - - - - - - - - - - -')
        console.log('Start Articles donwload: DONE');
        console.log('- - - - - - - - - - - - - - - - - - - -')
        cb(null, 'Download Featured Articles')
      }
    })
  })
}

const downloadStubArticlesRevisionHistory = (cb) => {
  var filename = './articleLists/stubArticleList.txt'
  index = 1
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Stub Article List: LOADED');
    var titles = data.trim().split('\n')
    for (var i = 0; i < titles.length; i++) {
      titles[i] = decodeURIComponent(titles[i].trim())
    }
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Stub Articles download: STARTING');
    console.log('- - - - - - - - - - - - - - - - - - - -')
    async.eachSeries(
      titles,
      downloadRevisionHistory,
      (err, result) => {
      if (err) console.log(err);
      else {
        pathIndex++
        console.log('- - - - - - - - - - - - - - - - - - - -')
        console.log('Stub Articles donwload: DONE');
        console.log('- - - - - - - - - - - - - - - - - - - -')
        cb(null, 'Download Featured Articles')
      }
    })
  })
}

async.series([
    downloadFeaturedArticlesRevisionHistory,
    downloadAClassArticlesRevisionHistory,
    downloadGoodArticlesRevisionHistory,
    downloadBClassArticlesRevisionHistory,
    downloadCClassArticlesRevisionHistory,
    downloadStartArticlesRevisionHistory,
    downloadStubArticlesRevisionHistory
  ],
  // optional callback
  function(err, results) {
    console.log('All articles revision history have been saved!');
});
