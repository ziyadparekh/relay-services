'use strict';

let mongodb = require('mongodb');
let Collection = mongodb.Collection;

class MongoCollection {

  constructor(mongoCollection) {
    this._mongoCollection = mongoCollection;
  }

  // Does a find with "smart indexing".
  // Currently this just means, if it needs a geoindex and there is
  // none, then build hte geoindex.
  // This could be improved a lot but it's not clear if that's a good 
  // idea. Or even if this behavior is a good idea.
  find(query, opts) {
    return this._rawFind(query, opts)
      .catch(error => {
        // Check for "no geoindex" error
        if (error.code != 17007 ||
          !error.message.match(/unable to find index for .geoNear/)) {
          throw error;
        }
        // Figure out what key needs an index
        let key = error.message.match(/field=([A-Za-z_0-9]+) /)[1];
        if (!key) {
          throw error;
        }

        var index = {};
        index[key] = '2d';
        // TODO: consider moving index creation logic into Schema.js
        return this._mongoCollection.createIndex(index)
          // Retry, but just once.
          .then(() => this._rawFind(query, opts));
      });
  }

  _rawFind(query, opts) {
    return this._mongoCollection
      .find(query, opts)
      .toArray();
  }

  count(query, opts) {
    return this._mongoCollection.count(query, opts);
  }

  // Atomically finds and updates an object based on query.
  // The result is the promise with an object that was in the database
  // !AFTER! changes.
  findOneAndUpdate(query, update) {
    // arguments: query, sort, update, options(optional)
    // Setting `new` option to true makes it return the adter document
    // not the before one
    return this._mongoCollection.findAndModify(query, [], update, { new: true }).then(document => {
      // Value is the object where mongo returns multiple fields.
      return document.value;
    });
  }

  // Atomically find and delete an object based on query.
  // The result is the promise with an object that was in the database 
  // before deleting.
  findOneAndDelete(query) {
    // arguments: query, sort
    return this._mongoCollection.findAndRemove(query, []).then(document => {
      // Value is the object where mongo returns multiple fields
      return document.value;
    });
  }

  drop() {
    this._mongoCollection.drop();
  }
}

module.exports = MongoCollection;