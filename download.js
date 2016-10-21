// MODULES
var fs = require('fs')
var request = require('request')
var async = require('async')
var qs = require('querystring')
var mkdirp = require('mkdirp');
var _ = require('underscore')


// LOGIC

var url = 'https://en.wikipedia.org/wiki/Special:Export/'
var folder = 'articlesXML/'
var paths = ['featuredArticlesXML/', 'aClassArticlesXML/', 'goodArticlesXML/', 'bClassArticlesXML/', 'cClassArticlesXML/', 'startArticlesXML/', 'stubArticlesXML/']
var pathIndex = 0
var index = 1

const writeFile = (title, contents, cb) => {
  mkdirp(folder + paths[pathIndex], function (err) {
    if (err) {
      console.log(err);
      return cb(err);
    }
    title = title.replace(/\//g, '\u2215') // REPLACE SLASH
    fs.writeFile(folder + paths[pathIndex] + title + '.xml', contents, () => {
      console.log(index +' SAVED: '+ title);
      index++
      cb(null, 'Article Downloaded')
    })
  });
}

const downloadXML = (title, cb) => {
  var urlXML = url + qs.escape(title)
  request(urlXML, (error, response, body) => {
    console.log('OK');
    if (!error && response.statusCode == 200) {
      writeFile(title, body, cb)
    }
    else {
      console.log(error);
      cb('Error downloading: ' + title, null)
    }
  })
}

const downloadFeaturedArticles = (cb) => {
  var filename = './articleLists/featuredArticleList.txt'
  index = 1
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Featured Article List: LOADED');
    var titles = data.trim().split('\n')
    for (var i = 0; i < titles.length; i++) {
      titles[i] = decodeURI(titles[i].trim())
    }
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Featured Articles download: STARTING');
    console.log('- - - - - - - - - - - - - - - - - - - -')
    async.eachSeries(
      titles,
      downloadXML,
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

const downloadAClassArticles = (cb) => {
  var filename = './articleLists/aCLassArticleList.txt'
  index = 1
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('A Class Article List: LOADED');
    var titles = data.trim().split('\n')
    for (var i = 0; i < titles.length; i++) {
      titles[i] = decodeURI(titles[i].trim())
    }
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('A Class Articles download: STARTING');
    console.log('- - - - - - - - - - - - - - - - - - - -')
    async.eachSeries(
      titles,
      downloadXML,
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

const downloadGoodArticles = (cb) => {
  var filename = './articleLists/goodArticleList.txt'
  index = 1
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Good Article List: LOADED');
    var titles = data.trim().split('\n')
    for (var i = 0; i < titles.length; i++) {
      titles[i] = decodeURI(titles[i].trim())
    }
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Good Articles download: STARTING');
    console.log('- - - - - - - - - - - - - - - - - - - -')
    async.eachSeries(
      titles,
      downloadXML,
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

const downloadBClassArticles = (cb) => {
  var filename = './articleLists/bCLassArticleList.txt'
  index = 1
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('B Class Article List: LOADED');
    var titles = data.trim().split('\n')
    for (var i = 0; i < titles.length; i++) {
      titles[i] = decodeURI(titles[i].trim())
    }
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('B Class Articles download: STARTING');
    console.log('- - - - - - - - - - - - - - - - - - - -')
    async.eachSeries(
      titles,
      downloadXML,
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

const downloadCClassArticles = (cb) => {
  var filename = './articleLists/cCLassArticleList.txt'
  index = 1
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('C Class Article List: LOADED');
    var titles = data.trim().split('\n')
    for (var i = 0; i < titles.length; i++) {
      titles[i] = decodeURI(titles[i].trim())
    }
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('C Class Articles download: STARTING');
    console.log('- - - - - - - - - - - - - - - - - - - -')
    async.eachSeries(
      titles,
      downloadXML,
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

const downloadStartArticles = (cb) => {
  var filename = './articleLists/startArticleList.txt'
  index = 1
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Start Article List: LOADED');
    var titles = data.trim().split('\n')
    for (var i = 0; i < titles.length; i++) {
      titles[i] = decodeURI(titles[i].trim())
    }
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Start Articles download: STARTING');
    console.log('- - - - - - - - - - - - - - - - - - - -')
    async.eachSeries(
      titles,
      downloadXML,
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

const downloadStubArticles = (cb) => {
  var filename = './articleLists/stubArticleList.txt'
  index = 1
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Stub Article List: LOADED');
    var titles = data.trim().split('\n')
    for (var i = 0; i < titles.length; i++) {
      titles[i] = decodeURI(titles[i].trim())
    }
    console.log('- - - - - - - - - - - - - - - - - - - -')
    console.log('Stub Articles download: STARTING');
    console.log('- - - - - - - - - - - - - - - - - - - -')
    async.eachSeries(
      titles,
      downloadXML,
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
    downloadFeaturedArticles,
    downloadAClassArticles,
    downloadGoodArticles,
    downloadBClassArticles,
    downloadCClassArticles,
    downloadStartArticles,
    downloadStubArticles
],
// optional callback
function(err, results) {
    console.log('All articles have been downloaded!');
});



// fs.readFile(filename, 'utf8', function(err, data) {
//   if (err) throw err;
//   console.log('Article List: LOADED');
//   var titles = data.trim().split('\n')
//   for (var i = 0; i < titles.length; i++) {
//     titles[i] = decodeURI(titles[i].trim())
//   }
//   console.log('Articles download: STARTING');
//   async.eachSeries(
//     titles,
//     downloadXML,
//     (err, result) => {
//     if (err) console.log(err);
//     else console.log('Articles donwload: DONE');
//   })
//
//   // fs.readdir('articleXML', (err, files) => {
//   //   titles.forEach((title) => {
//   //     if (files.indexOf(title+'.xml') == -1) {
//   //       console.log(title);
//   //     }
//   //   })
//   // })
//
// })
