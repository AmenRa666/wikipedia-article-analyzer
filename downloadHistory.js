// MODULES
var fs = require('fs')
var request = require('request')
var async = require('async')
var qs = require('querystring')
var mkdirp = require('mkdirp');
var _ = require('underscore')


// LOGIC
// Configure the request
var folder = 'articlesHistory/'
var title = 'Raccoon'

var options = {
    url: 'https://en.wikipedia.org/w/index.php?title=Special:Export',
    method: 'POST',
    form: {'pages': title, 'offset': 1, 'action': 'submit'}
}

// Start the request
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {



      mkdirp(folder, (err) => {
        if (err) {
          console.log(err);
        }
        title = title.replace(/\//g, '\u2215') // REPLACE SLASH
        fs.writeFile(folder + title + '.xml', body, () => {
          console.log('SAVED: '+ title);
        })
      });



    }
    else {
      console.log('Error while donwloading article history');
    }
})
