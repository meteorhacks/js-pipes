var Group = require('../../lib/pipes/group')
var assert = require('assert');

suite('Pipes.Group', function() {
  suite("invalid DSL", function() {
    test("_id with boolean", function() {
      var g = new Group({_id: true});
      assert.ok(g.validate() instanceof Error);
    });

    test("_id contains sourceField without $", function() {
      var g = new Group({_id: "abc"});
      assert.ok(g.validate() instanceof Error);
    });

    test("_id contains sourceField with .", function() {
      var g = new Group({_id: "$aa.aa"});
      assert.ok(g.validate() instanceof Error);
    });

    test("_id object contains sourceField without $", function() {
      var g = new Group({_id: {"abc": "aa"}});
      assert.ok(g.validate() instanceof Error);
    });

    test("_id object contains sourceField with .", function() {
      var g = new Group({_id: {"abc": "$aa.dd"}});
      assert.ok(g.validate() instanceof Error);
    });

    test("field without operator", function() {
      var g = new Group({_id: "$hello", aa: {}});
      assert.ok(g.validate() instanceof Error);
    });

    test("field syntax other than an object", function() {
      var g = new Group({_id: "$hello", aa: 10});
      assert.ok(g.validate() instanceof Error);
    });

    test("field with multiple operators", function() {
      var g = new Group({_id: "$hello", aa: {
        $sum: "$aa",
        $avg: "$bb"
      }});
      assert.ok(g.validate() instanceof Error);
    });

    test("field with unsupported operator", function() {
      var g = new Group({_id: "$hello", aa: {
        $sd: "$aa"
      }});
      assert.ok(g.validate() instanceof Error);
    });

    test("field contains sourceField without $", function() {
      var g = new Group({_id: "$hello", aa: {
        $sum: "aa"
      }});
      assert.ok(g.validate() instanceof Error);
    });
    test("field contains sourceField with .", function() {
      var g = new Group({_id: "$hello", aa: {
        $sum: "$aa.ff"
      }});
      assert.ok(g.validate() instanceof Error);
    });
  });

  suite("applying pipe", function() {
    test("string _id based sum", function() {
      var g = new Group({_id: "$user", total: {
        $sum: "$marks"
      }});
      var dataSet = [
        {user: "arunoda", marks: 100, sub: "maths"},
        {user: "arunoda", marks: 200, sub: "science"},
        {user: "kamal", marks: 400, sub: "science"},
      ];
      var result = g.apply(dataSet);
      assert.deepEqual(result, [
        {_id: "arunoda", total: 300},
        {_id: "kamal", total: 400},
      ]);
    });

    test("object _id (2 fields) based sum", function() {
      var g = new Group({_id: {
        user: "$user",
        sub: "$sub"
      }, total: {
        $sum: "$marks"
      }});

      var dataSet = [
        {user: "arunoda", marks: 100, sub: "maths", type: "part1"},
        {user: "arunoda", marks: 300, sub: "maths", type: "part2"},
        {user: "arunoda", marks: 500, sub: "science", type: "part2"},
        {user: "kamal", marks: 200, sub: "science", type: "part2"},
      ];
      var result = g.apply(dataSet);
      assert.deepEqual(result, [
        {_id: {user: "arunoda", sub: "maths"}, total: 400},
        {_id: {user: "arunoda", sub: "science"}, total: 500},
        {_id: {user: "kamal", sub: "science"}, total: 200},
      ]);
    });

    test("sum and max at the same time", function() {
      var g = new Group({
        _id: "$user",
        total: {$sum: "$marks"},
        mean: {$avg: "$marks"}
      });

      var dataSet = [
        {user: "arunoda", marks: 100, sub: "maths"},
        {user: "arunoda", marks: 200, sub: "science"},
        {user: "kamal", marks: 400, sub: "science"},
      ];
      var result = g.apply(dataSet);
      assert.deepEqual(result, [
        {_id: "arunoda", total: 300, mean: 150},
        {_id: "kamal", total: 400, mean: 400},
      ]);
    });
  });

  suite("operators", function() {
    test("$sum", function() {
      var dataSet = [10, 20, 20, 10];
      var result = Group.operators.$sum(dataSet);
      assert.equal(result, 60);
    });

    test("$avg", function() {
      var dataSet = [10, 20, 20, 10];
      var result = Group.operators.$avg(dataSet);
      assert.equal(result, 15);
    });

    test("$min", function() {
      var dataSet = [-1, 20, 20, 3];
      var result = Group.operators.$min(dataSet);
      assert.equal(result, -1);
    });

    test("$max", function() {
      var dataSet = [10, 20, 20, 3];
      var result = Group.operators.$max(dataSet);
      assert.equal(result, 20);
    });
  });
});
