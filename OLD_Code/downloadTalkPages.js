// MODULES
const fs = require('fs')
const request = require('request')
const async = require('async')
const qs = require('querystring')
const mkdirp = require('mkdirp')
const _ = require('underscore')
const sanitize = require("sanitize-filename");
const path = require('path')

// LOGIC

const url = 'https://en.wikipedia.org/wiki/Special:Export/Talk:'
const listFolder = path.join('articles', 'articlesLists')
const folder = 'articlesTalkPages'
const paths = ['featuredArticlesTalkPages/', 'aClassArticlesTalkPages/', 'goodArticlesTalkPages/', 'bClassArticlesTalkPages/', 'cClassArticlesTalkPages/', 'startArticlesTalkPages/', 'stubArticlesTalkPages/']
let pathIndex = 0
let index = 1

const writeFile = (title, contents, cb) => {
  // mkdirp(folder + paths[pathIndex], (err) => {
  mkdirp(folder, (err) => {
    if (err) {
      console.log(err);
      return cb(err);
    }
    title = title.replace(/\//g, '\u2215') // REPLACE SLASH
    // fs.writeFile(folder + paths[pathIndex] + 'Talk-' + sanitize(title) + '.xml', contents, () => {
    fs.writeFile(path.join(folder, 'Talk-' + sanitize(title) + '.xml') , contents, () => {
      console.log(index +' SAVED: '+ 'Talk:' + title);
      index++
      cb(null, 'Article Downloaded')
    })
  });
}

const downloadXML = (title, cb) => {
  let urlXML = url + qs.escape(title)
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
  let filename = path.join(listFolder, 'featuredArticles.txt')
  index = 1
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
  let filename = path.join(listFolder, 'aClassArticles.txt')
  index = 1
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
  let filename = path.join(listFolder, 'goodArticles.txt')
  index = 1
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
  let filename = path.join(listFolder, 'bClassArticles.txt')
  index = 1
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
  let filename = path.join(listFolder, 'cClassArticles.txt')
  index = 1
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
  let filename = path.join(listFolder, 'startArticles.txt')
  index = 1
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
  let filename = path.join(listFolder, 'stubArticles.txt')
  index = 1
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
    console.log('All articles talk pages have been downloaded!');
});



// fs.readFile(filename, 'utf8', (err, data) => {
//   if (err) throw err;
//   console.log('Article List: LOADED');
//   let titles = data.trim().split('\n')
//   for (let i = 0; i < titles.length; i++) {
//     titles[i] = decodeURIComponent(titles[i].trim())
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
