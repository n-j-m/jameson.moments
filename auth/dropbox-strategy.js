var util = require("util");
var OAuth2Strategy = require("passport-oauth").OAuth2Strategy;
var InternalOAuthError = require("passport-oauth").InternalOAuthError;

function DropboxStrategy(options, verify) {
  options = options || {};
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://www.dropbox.com/1/oauth2/authorize';
  options.tokenURL = options.tokenURL || 'https://api.dropbox.com/1/oauth2/token';
  options.scopeSeparator = options.scopeSeparator || ',';
  options.customHeaders = options.customHeaders || {};

  OAuth2Strategy.call(this, options, verify);
  this.name = 'dropbox-oauth2';
}

util.inherits(DropboxStrategy, OAuth2Strategy);

DropboxStrategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(
    "https://api.dropbox.com/1/account/info",
    accessToken,
    function(err, body, res) {
      if (err) { return done(new InternalOAuthError("failed to fetch user profile", err)); }

      try {
        var json = JSON.parse(body);

        var profile = { provider: "dropbox" };
        profile.id = json.uid;
        profile.displayName = json.display_name;
        profile.emails = [{ value: json.email }];

        profile._raw = body;
        profile._json = json;

        done(null, profile);
      }
      catch(e) {
        done(e);
      }
    }
  );
}

module.exports = DropboxStrategy;
