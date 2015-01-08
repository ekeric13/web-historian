var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.sendResponse = function(res, data, status) {
  status = status || 200;
  res.writeHead(status, exports.headers);
  res.end(JSON.stringify(data));
}

// asset = url.parse(req.url).pathname
exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // console.log("Asset "+ asset);
  if (asset === "/"){
    asset = "/index.html"
  }
  var path = archive.paths.siteAssets + asset;
  // console.log("path "+ path);
  var encoding = {encoding:'utf8'};
  fs.readFile(path, encoding, function(err,data){
    if(err){
      // console.log("data stored path "+ path)
      path = archive.paths.archivedSites + asset
      fs.readFile(path, encoding, function(err, data){
        if (err){
          exports.sendResponse(res, err, 404);
        } else {
          exports.sendResponse(res, data, 200);
        }
      })
    } else {
      exports.sendResponse(res, data, 200);
    }
  })
};

exports.collectData = function(request, callback) {
  var data = "";
  request.on('data', function(chunk){
    data += chunk;
  });
  request.on('end', function(){
    callback(data);
  })
}




// As you progress, keep thinking about what helper functions you can put here!
