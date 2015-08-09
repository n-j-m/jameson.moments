var DropboxStrategy = require("./dropbox-strategy");

var db = require("../db");

var APP_KEY = process.env.DBOX_APP_KEY;
var APP_SECRET = process.env.DBOX_APP_SECRET;

function init(passport, options) {
  passport.serializeUser(function(user, done) {
    // send user since we're using profile directly
    done(null, user);
  });

  passport.deserializeUser(function(id, done) {
    // send back id since we're using profile directly
    done(null, id);
  });

  passport.use(
    "dropbox",
    new DropboxStrategy({
      authorizationURL: options.authorizationURL,
      tokenURL: options.tokenURL,
      clientID: APP_KEY,
      clientSecret: APP_SECRET,
      callbackURL: options.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      console.log("access:", arguments);
      db.set("tokens", profile.id, accessToken)
        .then(function() {
          done(null, profile);
        })
        .catch(function(err) {
          done(err);
        });
    })
  );
}

module.exports = init;
