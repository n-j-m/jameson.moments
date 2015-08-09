var express = require('express');
var ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;

var APP_KEY = process.env.DBOX_APP_KEY;

function routes() {
  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  router.get("/done",
    ensureLoggedIn("/welcome"),
    function(req, res) {
      res.render("done");
    }
  );

  router.get("/photos",
    ensureLoggedIn("/welcome"),
    function(req, res) {
      res.render("photos");
    }
  );

  router.get("/welcome", function(req, res) {
    res.render("welcome", {
      redirect_url: "/oauth_callback",
      webhook_url: "/webhook",
      home_url: "/",
      app_key: APP_KEY
    });
  });

  return router;
}

module.exports = routes;
