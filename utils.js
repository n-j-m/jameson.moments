var crypto = require("crypto");

var APP_SECRET = process.env.DBOX_APP_SECRET;

function toArray(arrayLike) {
  return Array.prototype.slice.call(arrayLike, 0);
}

function errorBack(resolve, reject, defaultValue) {
  return function(err) {
    var args = toArray(arguments);
    // remove err arg
    args.shift();
    // add defaultValue if supplied and necessary
    if (!args.length && defaultValue) {
      args.unshift(defaultValue);
    }

    if (err) {
      reject(err);
    }
    else {
      resolve.apply(null, args);
    }
  }
}

function verifySignature(req, res, buf) {
  if (req.method.toLowerCase() === "post" && req.path.indexOf("webhook") >= 0) {
    // validate that the request is properly signed by Dropbox
    var signature = req.get("X-Dropbox-Signature");
    var hash = crypto.createHmac("sha256", APP_SECRET)
      .update(buf.toString())
      .digest("hex");
    var verified = signature === hash;

    if (!verified) {
      throw new Error("Invalid signature");
    }
  }
}

module.exports = {
  toArray: toArray,
  errorBack: errorBack,
  verifySignature: verifySignature
};
