// Modules

var PythonShell = require('python-shell');
var fs = require('fs')
var path = require('path')
var _ = require('underscore');


// Logic

var filename = process.argv[2]

// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log('USAGE: node ' + process.argv[1] + ' \'filename\'')
  process.exit(1)
}

// Read the file and print its contents.
fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err

  console.log('- - - - - - - - - - - - - - - - - - - -')
  console.log('FILE LOADED: ' + filename)
  console.log('- - - - - - - - - - - - - - - - - - - -')


  var options = {
    args: ['-o tmp', filename]
  };

  PythonShell.run('WikiExtractor.py', options, function () {


    fs.unlinkSync('/tmp');
    console.log('successfully deleted /tmp/hello');


  })


})









// path should have trailing slash
function removeDirForce(dirPath) {
  fs.readdir(dirPath, function(err, files) {
    if (err) {
      console.log(JSON.stringify(err));
    } else {
      if (files.length === 0) {
	fs.rmdir(dirPath, function(err) {
	  if (err) {
            console.log(JSON.stringify(err));
	  } else {
	    var parentPath = path.normalize(dirPath + '/..') + '/';
	    if (parentPath != path.normalize(rootPath)) {
	      removeDirForce(parentPath);
	    }
	  }
	});
      } else {
	_.each(files, function(file) {
	  var filePath = dirPath + file;
	  fs.stat(filePath, function(err, stats) {
	    if (err) {
	      console.log(JSON.stringify(err));
	    } else {
	      if (stats.isFile()) {
		fs.unlink(filePath, function(err) {
		  if (err) {
                    console.log(JSON.stringify(err));
		  }
		});
	      }

	      if (stats.isDirectory()) {
		removeDirForce(filePath + '/');
	      }
	    }
	  });
	});
      }
    }
  });
}
