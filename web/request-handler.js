var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!

var url = require('url');
var helpers = require('./http-helpers');

var getSite = function(request, response){
  var urlPath = url.parse(request.url).pathname;
  if( urlPath === '/' ){ urlPath = '/index.html'; }
  helpers.serveAssets(response, urlPath, function(){
    // trim leading slash if present
    if( urlPath[0] === '/' ) { urlPath = urlPath.slice(1)}
    archive.isUrlInList(urlPath, function(found){
      if( found ){ // if yes
        helpers.sendRedirect(response, '/loading.html');
      } else { // if no
        helpers.send404(response);
      }
    });
  });
};

var saveSite = function(request, response){
  helpers.collectData( request, function(data){
    var url = data.split('=')[1];
    url = url.replace('http://', '');
    // check sites.txt for web site
    archive.isUrlInList(url, function(found){
      if( found ){ // found site
        // check if site is on disk
        archive.isURLArchived(url, function(exists) {
          if(exists) {
            // redirect to site page (/www.google.com)
            helpers.sendRedirect(response, '/' + url);
          } else {
            // Redirect to loading.html
            helpers.sendRedirect(response, '/loading.html');
          }
        });
      } else { // not found
        // add to sites.txt
        archive.addUrlToList(url, function(){
          // Redirect to loading.html
          helpers.sendRedirect(response, '/loading.html');
        });
      }
    });
  });
};

var actions = {
  'GET': getSite,
  'POST': saveSite
};

//constant time lookups--use this pattern to differentiate between archives, static assests, and errors
exports.handleRequest = function (req, res) {
  console.log("Serving request type " + req.method + " for url " + req.url);

  var method = actions[req.method];

  if( method ){
    method(req, res);
  } else {
    helpers.send404(response);
  }
};
