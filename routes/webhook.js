var async = require("async");
var Router = require("express").Router;
var processUser = require("../processor").processUser;

function routes() {
  var router = Router();

  router.get("/webhook", function(req, res) {
    res.send(req.query.challenge);
  });

  router.post("/webhook", function(req, res) {
    // recieve a list of changed user IDs from Dropbox and process each.
    console.log("webhook handler:", req.body);
    var uids = req.body.delta.users;

    uids.forEach(function(uid) {
      async.nextTick(processUser.bind(null, uid));
    });

    res.send("");
  });

  return router;
}

module.exports = routes;
