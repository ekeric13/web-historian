var fs = require('fs');
var path = require('path');
var request = require('request');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};


exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, function(err, sites) {
    sites = sites.toString().split('\n');
    if( callback ){
      callback(sites);
    }
  });
};

exports.isUrlInList = function(url, callback){
  exports.readListOfUrls(function(sites) {
    var found = _.any(sites, function(site, i) {
      return site.match(url)
    });
    callback(found);
  });
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(exports.paths.list, url+'\n', function(err, file){
    callback();
  });
};

exports.isURLArchived = function(url, callback){
  var sitePath =  path.join(exports.paths.archivedSites, url);

  fs.exists(sitePath, function(exists) {
    callback(exists);
  });
};

exports.downloadUrls = function(){

  exports.readListOfUrls(function(url){
    httpRequest.get("http://" + url, exports.paths.archivedSites + '/' + url, function (err, res) {
    if (err) {
      console.error(err);
      return;
    }
      // var fd = fs.open(exports.paths.archivedSites + url, "w");
      // fs.close(fd);

      // // Write data to the file.
      // fs.writeFile(exports.paths.archivedSites + url, res, {encoding:'utf-8'});

    });
  })
};




