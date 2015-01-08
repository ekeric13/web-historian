var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpRequest = require('http-request');
var util = require("util")

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

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, {encoding:'utf8'}, function(err, data){
    if (err){

      // return (callback) ? callback(err) : console.log(err);;
    } else {
      return (callback) ? callback(data.split('\n')) : data.split('\n');
    }
  });
};

exports.isUrlInList = function(url){
  exports.readListOfUrls(function(array){
    if(_.indexOf(array, url) === -1){
      return false
    } else {
      return true;
    }
  });
};

exports.addUrlToList = function(url){
  fs.writeFile(exports.paths.list,url, {encoding: "utf8"});
};

exports.isURLArchived = function(url){
  fs.readFile(exports.paths.archivedSites + /*'/' + */ url, {encoding :'utf8'}, function(err, data){
    if(err){
      return false;
    } else {
      return true;
    }
  });
};

exports.downloadUrls = function(url){
  httpRequest.get(url, function (err, res) {
  if (err) {
    console.error(err);
    return;
  }
    var fd = fs.open(exports.paths.archivedSites + url, "w");
    fs.close(fd);

    // Write data to the file.
    fs.writeFile(exports.paths.archivedSites + url, res, {encoding:'utf-8'});

    console.log(res.buffer.toString() /*res.code, res.headers, res.buffer.toString()*/);
  });
};




