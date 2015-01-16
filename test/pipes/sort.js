var mongo = require('../_mongo');
var Sort = require('../../lib/pipes/sort')
var assert = require('assert');

suite("Pipes.sort", function() {
  setup(function (done) {
    mongo.connect(done);
  });

  suite("invalid DSL", function() {
    test("with nested fields", function() {
      var s = new Sort({
        "aa.bb": 1
      });
      assert.ok(s.hasErrors().message);
    });

    test("with beginning $", function() {
      var s = new Sort({
        "$aabb": 1
      });
      assert.ok(s.hasErrors().message);
    });

    test("order without 0, 1 or -1", function() {
      var s = new Sort({
        "aa": 0,
        "bb": 1,
        "cc": -1
      });
      assert.ok(!s.hasErrors());

      s = new Sort({
        "aa": 10,
      });
      assert.ok(s.hasErrors().message);
    });
  });

  suite("applying pipe", function() {
    test("sort ascending", function(done) {
      var dataSet = [
        {user: "arunoda", marks: 100},
        {user: "kamal", marks: 400},
        {user: "arunoda", marks: 200},
      ];

      var dsl = {"marks": 1};
      var s = new Sort(dsl);
      var result = s.apply(dataSet);

      mongo.sort(dsl, dataSet, function (err, res) {
        if(err) throw err;
        assert.deepEqual(result, res);
        done();
      });
    });

    test("sort descending", function(done) {
      var dataSet = [
        {user: "arunoda", marks: 100},
        {user: "kamal", marks: 400},
        {user: "arunoda", marks: 200},
      ];

      var dsl = {"marks": -1};
      var s = new Sort(dsl);
      var result = s.apply(dataSet);

      mongo.sort(dsl, dataSet, function (err, res) {
        if(err) throw err;
        assert.deepEqual(result, res);
        done();
      });
    });

    test("sort with multiple fields", function(done) {
      var dataSet = [
        {user: "arunoda", marks: 200},
        {user: "kamal", marks: 100, grade: 20},
        {user: "arunoda", marks: 100, grade: 10},
      ];

      var dsl = {"marks": 1, "grade": 1};
      var s = new Sort(dsl);
      var result = s.apply(dataSet);

      mongo.sort(dsl, dataSet, function (err, res) {
        if(err) throw err;
        assert.deepEqual(result, res);
        done();
      });
    });

    test("sort with different orders", function(done) {
      var dataSet = [
        {user: "arunoda", marks: 200},
        {user: "kamal", marks: 100, grade: 20},
        {user: "arunoda", marks: 100, grade: 10},
      ];

      var dsl = {"marks": 1, "grade": -1};
      var s = new Sort(dsl);
      var result = s.apply(dataSet);

      mongo.sort(dsl, dataSet, function (err, res) {
        if(err) throw err;
        assert.deepEqual(result, res);
        done();
      });
    });
  });
});
