var Router = require('express').Router;

function init(passport) {
  var router = Router();

  router.get("/auth", passport.authenticate("dropbox"));

  router.get("/dropbox/callback",
    passport.authenticate("dropbox", {
      successRedirect: "/photos",
      failureRedirect: "/welcome"
    })
  );

  return router;
}

module.exports = init;
