// MODULES
const fs = require('fs')
const request = require('request')
const async = require('async')
const qs = require('querystring')
const mkdirp = require('mkdirp');
const _ = require('underscore')
const sanitize = require("sanitize-filename");
const path = require('path')
const time = require('node-tictoc')
// Database Agent
const dbAgent = require('./dbAgent.js')


// LOGIC
const bot = require('nodemw');

// pass configuration object
const client = new bot({
  server: 'en.wikipedia.org',  // host name of MediaWiki-powered site
  path: '/w',                  // path to api.php script
  debug: false                 // is more verbose when set to true
});

let articleTitle = ''
let bots = []
let folder = path.join('articles', 'articlesLists')

const saveRevision = (_revision, cb) => {
  let revision = {
    articleTitle: sanitize(articleTitle),
    user: _revision.user,
    timestamp: _revision.timestamp,
    revid: _revision.revid,
    parentid: _revision.parentid,
    size: _revision.size
  }
  dbAgent.insertRevision(revision, (cb))
}

const downloadRevisionHistory = (_title, cb) => {
  console.log(_title);
  articleTitle = _title

  client.getArticleRevisions(articleTitle, (err, data) => {
    if (err) throw err

    if(data.length == 0) {
      console.log(articleTitle);
      process.exit()
    }

    data.forEach((review) => {
      if (bots.indexOf(review.user) > -1) {
        data.splice(data.indexOf(review), 1)
      }
    })

    let revisions = data
    let _revisions = []

    for (let i = 0; i < revisions.length; i++) {
      if (revisions[i+1] == undefined) {
        _revisions.push(revisions[i])
      }
      else if (revisions[i].user != revisions[i+1].user) {
        _revisions.push(revisions[i])
      }
    }

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

const downloadFeaturedArticlesRevisionHistory = (cb) => {
  let filename = path.join(folder, 'featuredArticleList.txt')
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Featured Article List: LOADED');
    let titles = data.trim().split('\n')
    for (let i = 0; i < titles.length; i++) {
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
        console.log('- - - - - - - - - - - - - - - - - - - -')
        console.log('Featured Articles donwload: DONE');
        console.log('- - - - - - - - - - - - - - - - - - - -')
        cb(null, 'Download Featured Articles')
      }
    })
  })
}

const downloadAClassArticlesRevisionHistory = (cb) => {
  let filename = path.join(folder, 'aClassArticleList.txt')
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('A Class Article List: LOADED');
    let titles = data.trim().split('\n')
    for (let i = 0; i < titles.length; i++) {
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
        console.log('- - - - - - - - - - - - - - - - - - - -')
        console.log('A Class Articles donwload: DONE');
        console.log('- - - - - - - - - - - - - - - - - - - -')
        cb(null, 'Download A Class Articles')
      }
    })
  })
}

const downloadGoodArticlesRevisionHistory = (cb) => {
  let filename = path.join(folder, 'goodArticleList.txt')
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Good Article List: LOADED');
    let titles = data.trim().split('\n')
    for (let i = 0; i < titles.length; i++) {
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
        console.log('- - - - - - - - - - - - - - - - - - - -')
        console.log('Good Articles donwload: DONE');
        console.log('- - - - - - - - - - - - - - - - - - - -')
        cb(null, 'Download Featured Articles')
      }
    })
  })
}

const downloadBClassArticlesRevisionHistory = (cb) => {
  let filename = path.join(folder, 'bClassArticleList.txt')
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('B Class Article List: LOADED');
    let titles = data.trim().split('\n')
    for (let i = 0; i < titles.length; i++) {
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
        console.log('- - - - - - - - - - - - - - - - - - - -')
        console.log('B Class Articles donwload: DONE');
        console.log('- - - - - - - - - - - - - - - - - - - -')
        cb(null, 'Download B Class Articles')
      }
    })
  })
}

const downloadCClassArticlesRevisionHistory = (cb) => {
  let filename = path.join(folder, 'cClassArticleList.txt')
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('C Class Article List: LOADED');
    let titles = data.trim().split('\n')
    for (let i = 0; i < titles.length; i++) {
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
        console.log('- - - - - - - - - - - - - - - - - - - -')
        console.log('C Class Articles donwload: DONE');
        console.log('- - - - - - - - - - - - - - - - - - - -')
        cb(null, 'Download B Class Articles')
      }
    })
  })
}

const downloadStartArticlesRevisionHistory = (cb) => {
  let filename = path.join(folder, 'startArticleList.txt')
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Start Article List: LOADED');
    let titles = data.trim().split('\n')
    for (let i = 0; i < titles.length; i++) {
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
        console.log('- - - - - - - - - - - - - - - - - - - -')
        console.log('Start Articles donwload: DONE');
        console.log('- - - - - - - - - - - - - - - - - - - -')
        cb(null, 'Download Featured Articles')
      }
    })
  })
}

const downloadStubArticlesRevisionHistory = (cb) => {
  let filename = path.join(folder, 'stubArticleList.txt')
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Stub Article List: LOADED');
    let titles = data.trim().split('\n')
    for (let i = 0; i < titles.length; i++) {
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
        console.log('- - - - - - - - - - - - - - - - - - - -')
        console.log('Stub Articles donwload: DONE');
        console.log('- - - - - - - - - - - - - - - - - - - -')
        cb(null, 'Download Featured Articles')
      }
    })
  })
}

time.tic()

fs.readFile("Bots.txt", 'utf8', (err, data) => {
  if (err) throw err;
  bots = _.uniq(data.trim().split(/[\n,\|]/))
  console.log('Bots List: LOADED');

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
    (err, results) => {
      console.log('All articles revision history have been saved!');
      console.log('Time elapsed: ');
      time.toc()
      process.exit()
  });

})
