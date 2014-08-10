var Match = require('../../lib/pipes/match')
var assert = require('assert');

suite("Pipes.match", function() {
  suite("invalid DSL", function() {
    test("without $ for field", function() {
      var m = new Match({"name": "kuma"});
      assert.ok(m.hasErrors().message);
    });

    test("with nested fields", function() {
      var m = new Match({"$address.city": "colombo"});
      assert.ok(m.hasErrors().message);
    });
  });

  suite("applying pipe", function() {
    suite("simple operator", function() {
      test("single field", function() {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var m = new Match({"$user": "arunoda"});
        var result = m.apply(dataSet);

        assert.deepEqual(result, [
          {user: "arunoda", marks: 200},
          {user: "arunoda", marks: 100, grade: 10},
        ]);
      });

      test("regexp support", function() {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var m = new Match({"$user": /ama/});
        var result = m.apply(dataSet);

        assert.deepEqual(result, [
          {user: "kamal", marks: 100, grade: 20},
        ]);
      });

      test("multi field", function() {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var m = new Match({
          "$user": "arunoda",
          "$marks": 200
        });

        var result = m.apply(dataSet);

        assert.deepEqual(result, [
          {user: "arunoda", marks: 200}
        ]);
      });

      test("multi field", function() {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var m = new Match({
          "$user": "arunoda",
          "$marks": 200
        });

        var result = m.apply(dataSet);

        assert.deepEqual(result, [
          {user: "arunoda", marks: 200}
        ]);
      });

      test("no field", function() {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var m = new Match({});

        var result = m.apply(dataSet);

        assert.deepEqual(result, [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ]);
      });

    });

    suite("$lt", function() {
      test("for numbers", function() {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var m = new Match({"$marks": {$lt: 110}});
        var result = m.apply(dataSet);

        assert.deepEqual(result, [
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ]);
      });
    });

    suite("$lte", function() {
      test("for numbers", function() {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var m = new Match({"$marks": {$lte: 100}});
        var result = m.apply(dataSet);

        assert.deepEqual(result, [
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ]);
      });
    });

    suite("$gt", function() {
      test("for numbers", function() {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var m = new Match({"$marks": {$gt: 100}});
        var result = m.apply(dataSet);

        assert.deepEqual(result, [
          {user: "arunoda", marks: 200},
        ]);
      });
    });

    suite("$gte", function() {
      test("for numbers", function() {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var m = new Match({"$marks": {$gte: 200}});
        var result = m.apply(dataSet);

        assert.deepEqual(result, [
          {user: "arunoda", marks: 200},
        ]);
      });
    });

    suite("$eq", function() {
      test("for numbers", function() {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var m = new Match({"$grade": {$eq: 10}});
        var result = m.apply(dataSet);

        assert.deepEqual(result, [
          {user: "arunoda", marks: 100, grade: 10},
        ]);
      });
    });

    suite("$ne", function() {
      test("for numbers", function() {
        var dataSet = [
          {user: "arunoda", marks: 200},
          {user: "kamal", marks: 100, grade: 20},
          {user: "arunoda", marks: 100, grade: 10},
        ];

        var m = new Match({"$marks": {$ne: 100}});
        var result = m.apply(dataSet);

        assert.deepEqual(result, [
          {user: "arunoda", marks: 200},
        ]);
      });
    });

  });
});
