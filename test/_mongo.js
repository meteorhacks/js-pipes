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


mongo.eval = function (dsl, data, callback) {
  mongo._set(data, function (err, res) {
    if(err) return callback(err);
    mongo._aggr([{$project: dsl}], function (err, res) {
      if(err) return callback(err);
      res = mongo._removeId(res[0], '_id');
      callback(null, res);
    });
  });
};


mongo.group = function (dsl, data, callback) {
  mongo._set(data, function (err, res) {
    if(err) return callback(err);
    mongo._aggr([{$group: dsl}], function (err, res) {
      if(err) return callback(err);
      callback(null, res);
    });
  });
};


mongo.match = function (dsl, data, callback) {
  mongo._set(data, function (err, res) {
    if(err) return callback(err);
    mongo._aggr([{$match: dsl}], function (err, res) {
      if(err) return callback(err);
      callback(null, res);
    });
  });
};


mongo.sort = function (dsl, data, callback) {
  mongo._set(data, function (err, res) {
    if(err) return callback(err);
    mongo._aggr([{$sort: dsl}], function (err, res) {
      if(err) return callback(err);
      callback(null, res);
    });
  });
};


mongo.limit = function (dsl, data, callback) {
  mongo._set(data, function (err, res) {
    if(err) return callback(err);
    mongo._aggr([{$limit: dsl}], function (err, res) {
      if(err) return callback(err);
      callback(null, res);
    });
  });
};


mongo.project = function (dsl, data, callback) {
  mongo._set(data, function (err, res) {
    if(err) return callback(err);
    mongo._aggr([{$project: dsl}], function (err, res) {
      if(err) return callback(err);
      callback(null, res);
    });
  });
};


mongo.aggregate = function (pipes, data, callback) {
  mongo._set(data, function (err, res) {
    if(err) return callback(err);
    mongo._aggr(pipes, function (err, res) {
      if(err) return callback(err);
      callback(null, res);
    });
  });
};


mongo._set = function (data, callback) {
  mongo._coll.remove({}, function (err, res) {
    if(err) return callback(err);
    mongo._coll.insert(data, callback);
  });
};


mongo._aggr = function (pipes, callback) {
  mongo._coll.aggregate(pipes, callback);
};


mongo._removeId = function (doc) {
  return _.omit(doc, '_id');
};


module.exports = mongo;
