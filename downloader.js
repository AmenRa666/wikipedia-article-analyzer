// MODULES
var fs = require('fs')
var request = require('request')
var async = require('async')
var qs = require('querystring')
var mkdirp = require('mkdirp');
var _ = require('underscore')


// LOGIC
var filename = 'articleList.txt'
var url = 'https://en.wikipedia.org/wiki/Special:Export/'
var path = 'articleXML/'
var i = 1

const writeFile = (title, contents, cb) => {
  mkdirp(path, function (err) {
    if (err) return cb(err);
    title = title.replace(/\//g, '\u2215') // REPLACE SLASH
    fs.writeFile(path + title + '.xml', contents, () => {
      console.log(i +' SAVED: '+ title);
      i++
      cb(null, 'Article Downloaded')
    })
  });
}

const downloadXML = (title, cb) => {
  var urlXML = url + qs.escape(title)
  request(urlXML, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      writeFile(title, body, cb)
    }
    else {
      cb('Error downloading: ' + title, null)
    }
  })
}

fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;
  console.log('Article List: LOADED');
  var titles = data.trim().split('\n')
  titles.forEach((title) => {
    title.trim()
  })
  console.log('Articles download: STARTING');
  async.eachSeries(
    titles,
    downloadXML,
    (err, result) => {
    if (err) console.log(err);
    else console.log('Articles donwload: DONE');
  })

  // fs.readdir('articleXML', (err, files) => {
  //   titles.forEach((title) => {
  //     if (files.indexOf(title+'.xml') == -1) {
  //       console.log(title);
  //     }
  //   })
  // })

})
