"use strict"
// MODULES
const Baby = require("babyparse")
const fs = require('fs')


// LOGIC
const dataFolderPath = './data/'

// Load files
const parsed = Baby.parseFiles(
  [
    dataFolderPath + 'pageRanks.csv',
    dataFolderPath + 'langLinks.csv',
    dataFolderPath + 'networkFeatures.csv',
    dataFolderPath + 'linkCount.csv'
  ]
)

const pageRanks = parsed[0].data
const langLinks = parsed[1].data
const networkFeaturesArray = parsed[2].data
const linkCount = parsed[3].data


let networkFeatures = {
  pageRank: 0,
  indegree: 0,
  outdegree: 0,
  assortativity_inin: 0,
  assortativity_inout: 0,
  assortativity_outin: 0,
  assortativity_outout: 0,
  localClusteringCoefficient: 0,
  reciprocity: 0,
  linkCount: 0,
  translationCount: 0
}

const getNetworkFeatures = (id, cb) => {
  networkFeatures.pageRank = 0.15
  networkFeatures.indegree = 0
  networkFeatures.outdegree = 0
  networkFeatures.assortativity_inin = 0
  networkFeatures.assortativity_inout = 0
  networkFeatures.assortativity_outin = 0
  networkFeatures.assortativity_outout = 0
  networkFeatures.localClusteringCoefficient = 0
  networkFeatures.reciprocity = 0
  networkFeatures.linkCount = 0
  networkFeatures.translationCount = 0

  for (let i = 0; i < pageRanks.length; i++) {
    if (pageRanks[i][0] == id) {
      networkFeatures.pageRank = pageRanks[i][1]
      break
    }
  }

  for (let j = 0; j < langLinks.length; j++) {
    if (langLinks[j][0] == id) {
      networkFeatures.translationCount = langLinks[j][1]
    }
  }

  for (let k = 0; k < networkFeaturesArray.length; k++) {
    if (networkFeaturesArray[k][0] == id) {
      networkFeatures.indegree = networkFeaturesArray[k][1]
      networkFeatures.outdegree = networkFeaturesArray[k][2]
      networkFeatures.assortativity_inin = networkFeaturesArray[k][3]
      networkFeatures.assortativity_inout = networkFeaturesArray[k][4]
      networkFeatures.assortativity_outin = networkFeaturesArray[k][5]
      networkFeatures.assortativity_outout = networkFeaturesArray[k][6]
      networkFeatures.localClusteringCoefficient = networkFeaturesArray[k][7]
      networkFeatures.reciprocity = networkFeaturesArray[k][8]
    }
  }

  id = 693018

  for (let l = 0; l < linkCount.length; l++) {
    if (linkCount[l][0] == id) {
      networkFeatures.linkCount = linkCount[l][1]
    }
  }
  
  cb(networkFeatures)
}


// EXPORTS
module.exports.getNetworkFeatures = getNetworkFeatures
