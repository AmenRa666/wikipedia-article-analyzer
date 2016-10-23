const testFolder = 'articlesXML/aClassArticlesXML/';
const fs = require('fs');



fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
})
