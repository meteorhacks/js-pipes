var _ = require('lodash');
var MongoClient = require('mongodb').MongoClient;
var MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost/test';

var mongo = {
  _db: null,
  _coll: null,
  _url: MONGO_URL,
};


mongo.connect = function (callback) {
  if(mongo._db) {
    return callback();
  }

  MongoClient.connect(mongo._url, function (err, res) {
    if(err) throw err;
    if(res) {
      mongo._db = res;
      mongo._coll = mongo._db.collection('test');
    }

    callback();
  });
};


mongo.eval = function (dsl, doc, callback) {
  mongo._coll.remove({}, function (err, res) {
    if(err) throw err;
    mongo._coll.insert(doc, function () {
      if(err) throw err;
      mongo._coll.aggregate([{$project: dsl}], function (err, res) {
        if(err) throw err;
        callback(_.omit(res[0], '_id'));
      })
    })
  })
};


module.exports = mongo;
