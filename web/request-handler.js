var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var httpHelpers = require("./http-helpers.js");
var data = '<input>';
var url = require("url")

var actions = {
  "GET" : function(request, response){
    var path = url.parse(request.url).pathname;
    httpHelpers.serveAssets(response, path, function(){
      // if (path[0] === "/") { path = path.slice(1)}
        // check to see if in urlList
    });
  },
  "POST" : function(request, response){
    httpHelpers.writeAsset(request, response);
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
