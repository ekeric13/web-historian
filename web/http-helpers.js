var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var util = require("util");

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
  res.end(data);
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
          callback() ? callback() : exports.sendResponse(res, err, 404);
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

exports.redirect = function(res, data, statusCode){
  status = statusCode || 302;

  res.setHeader('Location', '/loading.html');
  res.writeHead(status, exports.headers);
  res.end(data);
}

exports.writeAsset = function(request, response){
  exports.collectData(request, function(dataUrl){
    // is URL IN list?
      // if not add it with addurltosites. if it is is it archived?
        // if not archive and redirect to the site. if it is redirect to loading.
    var parsedUrl = dataUrl.split("=")[1];
    parsedUrl = parsedUrl.replace('http://', '');
    // TEST URL
    var testUrl = dataUrl.split("=")[1];
    // console.log("parsed url "+parsedUrl);
    var x = archive.isUrlInList(parsedUrl);
    console.log(x+ " is parsed url in list?");
    console.log("here is the url "+ parsedUrl)

    archive.isUrlInList(parsedUrl, function(bool){
      if (bool){
        exports.sendResponse(response, "url already in list", 404);
      } else {
        archive.addUrlToList(parsedUrl);
        exports.redirect(response, "url added to list", 302);
        // BE SURE TO TAKE THIS OUT. need to put into htmlfetcher. should be a chron job
        archive.downloadUrls(parsedUrl);
      }
    })
    // if(x){
    //   exports.sendResponse(response, "url already in list", 404);
    // } else {
    //   archive.addUrlToList(parsedUrl);
    //   exports.redirect(response, "url added to list", 302);
    //   // BE SURE TO TAKE THIS OUT. need to put into htmlfetcher. should be a chron job
    //   archive.downloadUrls(testUrl);
    // }
  });
}




// As you progress, keep thinking about what helper functions you can put here!
