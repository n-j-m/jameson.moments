var Firebase = require("firebase");
var Promise = require("bluebird");

var Utils = require("./utils");
var toArray = Utils.toArray;
var errorBack = Utils.errorBack;

var momentsRef = new Firebase("https://jameson-moments.firebaseio.com/");

var db = {
  get: function(/*...path*/) {
    var args = toArray(arguments);
    return new Promise(function(resolve, reject) {
      momentsRef.child(args.join("/"))
        .once("value", function(snap) {
          resolve(snap.val());
        }, reject);
    });
  },

  set: function(/*...path, value*/) {
    var args = toArray(arguments);
    var value = args.pop();
    console.log("args:", args);
    console.log("value:", value);
    return new Promise(function(resolve, reject) {
      momentsRef.child(args.join("/"))
        .set(value, errorBack(resolve, reject, value));
    });
  },

  remove: function(/*...path*/) {
    var args = toArray(arguments);
    return new Promise(function(resolve, reject) {
      momentsRef.child(args.join("/"))
        .remove(errorBack(resolve, reject));
    });
  }
}

module.exports = db;
