var mongo = require('../_mongo');
var Match = require('../../lib/pipes/match')
var assert = require('assert');

suite("Pipes.match", function() {
  setup(function (done) {
    mongo.connect(done);
  });

  suite("invalid DSL", function() {
    test("with $ for field");
  });

  suite("applying pipe", function() {
    suite("simple operator", function() {
      test("single field", function(done) {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var dsl = {user: "arunoda"};
        var m = new Match(dsl);
        var result = m.apply(dataSet);

        mongo.match(dsl, dataSet, function (err, res) {
          if(err) throw err;
          assert.deepEqual(result, res);
          done();
        });
      });

      test("regexp support", function(done) {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var dsl = {user: /ama/};
        var m = new Match(dsl);
        var result = m.apply(dataSet);

        mongo.match(dsl, dataSet, function (err, res) {
          if(err) throw err;
          assert.deepEqual(result, res);
          done();
        });
      });

      test("multi field", function(done) {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var dsl = {user: "arunoda", marks: 200};
        var m = new Match(dsl);

        var result = m.apply(dataSet);

        mongo.match(dsl, dataSet, function (err, res) {
          if(err) throw err;
          assert.deepEqual(result, res);
          done();
        });
      });

      test("multi field", function(done) {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var dsl = {user: "arunoda", marks: 200};
        var m = new Match(dsl);

        var result = m.apply(dataSet);

        mongo.match(dsl, dataSet, function (err, res) {
          if(err) throw err;
          assert.deepEqual(result, res);
          done();
        });
      });

      test("no field", function(done) {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var dsl = {};
        var m = new Match(dsl);

        var result = m.apply(dataSet);

        mongo.match(dsl, dataSet, function (err, res) {
          if(err) throw err;
          assert.deepEqual(result, res);
          done();
        });
      });

    });

    suite("$lt", function() {
      test("for numbers", function(done) {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var dsl = {marks: {$lt: 110}};
        var m = new Match(dsl);
        var result = m.apply(dataSet);

        mongo.match(dsl, dataSet, function (err, res) {
          if(err) throw err;
          assert.deepEqual(result, res);
          done();
        });
      });
    });

    suite("$lte", function() {
      test("for numbers", function(done) {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var dsl = {marks: {$lte: 100}};
        var m = new Match(dsl);
        var result = m.apply(dataSet);

        mongo.match(dsl, dataSet, function (err, res) {
          if(err) throw err;
          assert.deepEqual(result, res);
          done();
        });
      });
    });

    suite("$gt", function() {
      test("for numbers", function(done) {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var dsl = {marks: {$gt: 100}};
        var m = new Match(dsl);
        var result = m.apply(dataSet);

        mongo.match(dsl, dataSet, function (err, res) {
          if(err) throw err;
          assert.deepEqual(result, res);
          done();
        });
      });
    });

    suite("$gte", function() {
      test("for numbers", function(done) {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var dsl = {marks: {$gte: 200}};
        var m = new Match(dsl);
        var result = m.apply(dataSet);

        mongo.match(dsl, dataSet, function (err, res) {
          if(err) throw err;
          assert.deepEqual(result, res);
          done();
        });
      });
    });

    suite("$eq", function() {
      test("for numbers", function(done) {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var dsl = {grade: {$eq: 10}};
        var m = new Match(dsl);
        var result = m.apply(dataSet);

        mongo.match(dsl, dataSet, function (err, res) {
          if(err) throw err;
          assert.deepEqual(result, res);
          done();
        });
      });
    });

    suite("$ne", function() {
      test("for numbers", function(done) {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var dsl = {marks: {$ne: 100}};
        var m = new Match(dsl);
        var result = m.apply(dataSet);

        mongo.match(dsl, dataSet, function (err, res) {
          if(err) throw err;
          assert.deepEqual(result, res);
          done();
        });
      });
    });
  });

});
