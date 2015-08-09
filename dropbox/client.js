var request = require("superagent");
var Promise = require("bluebird");

var errorBack = require("../utils").errorBack;

var DROPBOX_API_URL = "https://api.dropbox.com/1";

function createUrl(endpoint) {
  return DROPBOX_API_URL + endpoint;
}

function createAuthParams(params, token) {
  params.access_token = token;
  return params;
}

function parseResponse(response) {
  console.log("type:", response.type);
  console.log("body:", response.body);
  console.log("text:", response.text);
  if (response.type === "application/json" && response.body) {
    return response.body;
  }

  try {
    return JSON.parse(response.text);
  }
  catch (e) {
    return {};
  }
}

function post(url, params) {
  console.log("post:", url);
  console.log("post params:", params);
  return new Promise(function(resolve, reject) {
    request
      .post(url)
      .type("form")
      .send(params || {})
      .end(function(err, res) {
        if (err) {
          reject(err);
        }
        else {
          resolve(parseResponse(res));
        }
      });
  });
}

function Client(token) {
  this.token = token;
}

Client.prototype.delta = function (cursor) {
  return post(
    createUrl("/delta"),
    createAuthParams({ cursor: cursor }, this.token)
  );
};

Client.prototype.shares = function (path, options) {
  return post(
    createUrl("/shares/auto/" + path),
    createAuthParams({}, this.token)
  );
};

module.exports = Client;
