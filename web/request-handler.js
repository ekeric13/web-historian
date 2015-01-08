var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var httpHelpers = require("./http-helpers.js");
var data = '<input>';
var url = require("url")

var actions = {
  "GET" : function(request, response){
    var path = url.parse(request.url).pathname;
    httpHelpers.serveAssets(response, path);
  },
  "POST" : function(request, response){
    // first check to see if it is in the list of URL's

      // if true then add to list of urls
        // also write to the archives
    // archive.readListOfUrls
    httpHelpers.collectData(request, function(dataUrl){
      var parsedUrl = dataUrl.split("=")[1] + "\n";
      if(!archive.isUrlInList(parsedUrl)){
        archive.addUrlToList(parsedUrl);
        httpHelpers.sendResponse(response, "url added to list", 302)
      } else {
        httpHelpers.sendResponse(response, "url already in list", 404)
      }

    });
  }

}

exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if (action){
    action(req, res)
  } else {
    httpHelpers.sendResponse(res, "not found", 404)
  }
  // res.end(archive.paths.list);
};
