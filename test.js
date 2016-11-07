var Converter = require("csvtojson").Converter;
var converter = new Converter({});
var converter2 = new Converter({});
converter.fromFile("datasets/dataset.csv",function(err,result){
  var dataset = result

  converter2.fromFile("oldDatasets/dataset.csv",function(err,result2){
    if (err) throw err
    var dataset2 = result2

    var a1 = []
    var a2 = []

    dataset.forEach((article) => {
      a1.push(article.characterCount)
    })

    dataset2.forEach((article) => {
      a2.push(article.characterCount)
    })

    ca1 = 0
    ca2 = 0

    a1.forEach((a) => {
      ca1 = ca1 + a
    })

    a2.forEach((a) => {
      ca2 = ca2 + a
    })



    console.log(ca1);
    console.log(ca2);



  })




})
