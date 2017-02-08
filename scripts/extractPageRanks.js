// MODULES
const fs = require('fs')
const inspect = require('util').inspect
const time = require('node-tictoc')
const async = require('async')


// LOGIC
time.tic()
let idsFile = fs.readFileSync('../ids.txt', 'utf-8').trim()
let ids = idsFile.split('\n')

let targetFile = '../pageRanks.csv'
fs.appendFileSync(targetFile, 'id,langLinksCount\n')

let articlesFound = 0

let buffer = '';
let rs = fs.createReadStream('ranks.csv');
rs.on('data', (chunk) => {
  let lines = (buffer + chunk).split(/\r?\n/g);
  buffer = lines.pop();
  for (let i = 0; i < lines.length; ++i) {
    let tuple = lines[i].split(',')
    if (ids.indexOf(tuple[0]) > 0) {
      fs.appendFileSync(targetFile, lines[i] + '\n')
      articlesFound++
      console.log(articlesFound);
    }
  }
})
rs.on('end', () => {
  console.log('- - - - - - - - - -');
  console.log('END');
  console.log('Elapsed time: ');
  time.toc()
})
