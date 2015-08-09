var async = require("async");

var Client = require("./dropbox/client");
var db = require("./db");

function processEntry(client, uid, entry, nextEntry) {
  var path = entry[0],
    metadata = entry[1];
  var dbPromise;

  console.log("process entry:", entry);

  if (metadata.is_deleted) {
    // delete photo
    dbPromise = db.remove("photos", uid, path);
  }
  else {
    // create share and save
    dbPromise = client.shares(path)
      .then(function(fileData, response) {
        return db.set("photos", uid, fileData.rev, response.url);
      }.bind(null, metadata));
  }

  dbPromise.then(function() {
    console.log("finished processing entry");
    nextEntry();
  })
  .catch(nextEntry);
}

function processCursor(client, uid) {

  return new Promise(function(resolve, reject) {
    var hasMore = true;

    async.whilst(
      function() {
        return hasMore;
      },
      function(nextWhilst) {
        db.get("cursors", uid)
          .then(function(cursor) {
            console.log("process cursor");
            return client.delta(cursor);
          })
          .then(function(reply) {
            var entries = reply.entries;
            console.log("delta reply:", reply);

            async.each(
              entries,
              processEntry.bind(null, client, uid),
              function(err) {
                console.log("finished processing entries");
                if (err) {
                  // exit processCursor with error
                  console.log("error processing entries:", err);
                  nextWhilst(err);
                }
              }
            );

            hasMore = reply.has_more;
            db.set("cursors", uid, reply.cursor)
              .then(function() {
                nextWhilst();
              })
              .catch(nextWhilst);
          });
      },
      function(err) {
        if (err) {
          return reject(err);
        }
        resolve();
      }
    );
  });
}

function processUser(uid) {
  console.log("process user:", uid);
  return db.get("tokens", uid)
    .then(function(token) {
      console.log("found token:", token);
      return Promise.all([
        Promise.resolve(new Client(token)),
        db.get("cursors", uid)
      ]);
    })
    .then(function(clientAndCursor) {
      var client = clientAndCursor[0],
        cursor = clientAndCursor[1];

      console.log("got client and cursor:", clientAndCursor);

      return processCursor(client, uid);
    });
}

module.exports = {
  processUser: processUser
};
