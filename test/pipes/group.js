var _ = require('lodash');
var mongo = require('../_mongo');
var Group = require('../../lib/pipes/group')
var assert = require('assert');

suite('Pipes.group', function() {
  setup(function (done) {
    mongo.connect(done);
  });

  suite("invalid DSL", function() {
    test("_id with boolean", function() {
      var g = new Group({_id: true});
      assert.ok(g.hasErrors() instanceof Error);
    });

    test("_id contains sourceField without $", function() {
      var g = new Group({_id: "abc"});
      assert.ok(g.hasErrors() instanceof Error);
    });

    test("_id contains sourceField with .", function() {
      var g = new Group({_id: "$aa.aa"});
      assert.ok(g.hasErrors() instanceof Error);
    });

    test("_id object contains sourceField without $", function() {
      var g = new Group({_id: {"abc": "aa"}});
      assert.ok(g.hasErrors() instanceof Error);
    });

    test("_id object contains sourceField with .", function() {
      var g = new Group({_id: {"abc": "$aa.dd"}});
      assert.ok(g.hasErrors() instanceof Error);
    });

    test("field without operator", function() {
      var g = new Group({_id: "$hello", aa: {}});
      assert.ok(g.hasErrors() instanceof Error);
    });

    test("field syntax other than an object", function() {
      var g = new Group({_id: "$hello", aa: 10});
      assert.ok(g.hasErrors() instanceof Error);
    });

    test("field with multiple operators", function() {
      var g = new Group({_id: "$hello", aa: {
        $sum: "$aa",
        $avg: "$bb"
      }});
      assert.ok(g.hasErrors() instanceof Error);
    });

    test("field with unsupported operator", function() {
      var g = new Group({_id: "$hello", aa: {
        $sd: "$aa"
      }});
      assert.ok(g.hasErrors() instanceof Error);
    });

    test("field contains sourceField without $", function() {
      var g = new Group({_id: "$hello", aa: {
        $sum: "aa"
      }});
      assert.ok(g.hasErrors() instanceof Error);
    });
    test("field contains sourceField with .", function() {
      var g = new Group({_id: "$hello", aa: {
        $sum: "$aa.ff"
      }});
      assert.ok(g.hasErrors() instanceof Error);
    });
  });

  suite("applying pipe", function() {
    test("string _id based sum", function(done) {
      var dsl = {_id: "$user", total: {$sum: "$marks"}};
      var g = new Group(dsl);
      var dataSet = [
        {user: "arunoda", marks: 100, sub: "maths"},
        {user: "arunoda", marks: 200, sub: "science"},
        {user: "kamal", marks: 400, sub: "science"},
      ];
      var result = g.apply(dataSet);
      mongo.group(dsl, dataSet, function (err, res) {
        if(err) throw err;
        assert.deepEqual(_.sortBy(result, '_id'), _.sortBy(res, '_id'));
        done();
      });
    });

    test("object _id (2 fields) based sum", function(done) {
      var dsl = {_id: {user: "$user", sub: "$sub"}, total: {$sum: "$marks"}};
      var g = new Group(dsl);

      var dataSet = [
        {user: "arunoda", marks: 100, sub: "maths", type: "part1"},
        {user: "arunoda", marks: 300, sub: "maths", type: "part2"},
        {user: "arunoda", marks: 500, sub: "science", type: "part2"},
        {user: "kamal", marks: 200, sub: "science", type: "part2"},
      ];
      var result = g.apply(dataSet);
      mongo.group(dsl, dataSet, function (err, res) {
        if(err) throw err;
        assert.deepEqual(_.sortBy(result, 'total'), _.sortBy(res, 'total'));
        done();
      });
    });

    test("sum and max at the same time", function(done) {
      var dsl = {_id: "$user", total: {$sum: "$marks"}, avg: {$avg: "$marks"}};
      var g = new Group(dsl);

      var dataSet = [
        {user: "arunoda", marks: 100, sub: "maths"},
        {user: "arunoda", marks: 200, sub: "science"},
        {user: "kamal", marks: 400, sub: "science"},
      ];
      var result = g.apply(dataSet);
      mongo.group(dsl, dataSet, function (err, res) {
        if(err) throw err;
        assert.deepEqual(_.sortBy(result, '_id'), _.sortBy(res, '_id'));
        done();
      });
    });
  });

  suite("operators", function() {
    test("$sum", function(done) {
      var dsl = {_id: {}, val: {$sum: '$num'}};
      var g = new Group(dsl);
      var dataSet = [{num: 10}, {num: 20}, {num: 20}, {num: 10}];
      var result = g.apply(dataSet);
      mongo.group(dsl, dataSet, function (err, res) {
        if(err) throw err;
        assert.deepEqual(_.sortBy(result, '_id'), _.sortBy(res, '_id'));
        done();
      });
    });

    test("$avg", function(done) {
      var dsl = {_id: {}, val: {$avg: '$num'}};
      var g = new Group(dsl);
      var dataSet = [{num: 10}, {num: 20}, {num: 20}, {num: 10}];
      var result = g.apply(dataSet);
      mongo.group(dsl, dataSet, function (err, res) {
        if(err) throw err;
        assert.deepEqual(_.sortBy(result, '_id'), _.sortBy(res, '_id'));
        done();
      });
    });

    test("$min", function(done) {
      var dsl = {_id: {}, val: {$min: '$num'}};
      var g = new Group(dsl);
      var dataSet = [{num: -1}, {num: 20}, {num: 20}, {num: 3}];
      var result = g.apply(dataSet);
      mongo.group(dsl, dataSet, function (err, res) {
        if(err) throw err;
        assert.deepEqual(_.sortBy(result, '_id'), _.sortBy(res, '_id'));
        done();
      });
    });

    test("$max", function(done) {
      var dsl = {_id: {}, val: {$max: '$num'}};
      var g = new Group(dsl);
      var dataSet = [{num: 10}, {num: 20}, {num: 20}, {num: 3}];
      var result = g.apply(dataSet);
      mongo.group(dsl, dataSet, function (err, res) {
        if(err) throw err;
        assert.deepEqual(_.sortBy(result, '_id'), _.sortBy(res, '_id'));
        done();
      });
    });

    test("$addToSet", function(done) {
      var dsl = {_id: {}, val: {$addToSet: '$num'}};
      var g = new Group(dsl);
      var dataSet = [{num: 10}, {num: 20}, {num: 20}, {num: 3}];
      var result = g.apply(dataSet);
      mongo.group(dsl, dataSet, function (err, res) {
        if(err) throw err;
        result[0].val.sort();
        res[0].val.sort();
        assert.deepEqual(_.sortBy(result, '_id'), _.sortBy(res, '_id'));
        done();
      });
    });

    test("$first", function(done) {
      var dsl = {_id: {}, val: {$first: '$num'}};
      var g = new Group(dsl);
      var dataSet = [{num: 10}, {num: 20}, {num: 20}, {num: 3}];
      var result = g.apply(dataSet);
      mongo.group(dsl, dataSet, function (err, res) {
        if(err) throw err;
        assert.deepEqual(_.sortBy(result, '_id'), _.sortBy(res, '_id'));
        done();
      });
    });

    test("$last", function(done) {
      var dsl = {_id: {}, val: {$last: '$num'}};
      var g = new Group(dsl);
      var dataSet = [{num: 10}, {num: 20}, {num: 20}, {num: 3}];
      var result = g.apply(dataSet);
      mongo.group(dsl, dataSet, function (err, res) {
        if(err) throw err;
        assert.deepEqual(_.sortBy(result, '_id'), _.sortBy(res, '_id'));
        done();
      });
    });
  });
});
