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
    var callbackSave = callback;
    console.log('readlistofurls this: ', this);
  fs.readFile(exports.paths.list, {encoding:'utf8'}, function(err, data){
    if (err){
      // return (callback) ? callback(err) : console.log(err);;
    } else {
        console.log('inside read file', this);
      return (this.test) ? this.test(data.toString().split('\n')) : data.toString().split('\n');
    }
  }.bind(this));
};

// Is url in list function not working it seems...
exports.isUrlInList = function(url, callbackFirst){
  //maybe return?
  var truthy = false;
  console.log("type of callback "+ (typeof callbackFirst))
  console.log("callback in isURLInLIst: ", callbackFirst);
  console.log("here is url in archives "+ url)

  var callbackFirstSave = {test: callbackFirst};

  exports.readListOfUrls(function(array){
      console.log('callback in anonymous function: ', callbackFirstSave);
    console.log(array, url.toString(), _.contains(array, 'www.yahoo.com'));
    truthy = _.contains(array, url);
    this.test(truthy);
  }.bind(callbackFirstSave));

  // callback(truthy);
};

exports.addUrlToList = function(url){
  fs.appendFile(exports.paths.list, url.toString() + "\n");
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
  httpRequest.get(url, exports.paths.archivedSites + '/' + url, function (err, res) {
  if (err) {
    console.error(err);
    return;
  }
    // var fd = fs.open(exports.paths.archivedSites + url, "w");
    // fs.close(fd);

    // // Write data to the file.
    // fs.writeFile(exports.paths.archivedSites + url, res, {encoding:'utf-8'});

  });
};




