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
    test("simple single field", function() {
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

    test("simple multi field", function() {
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

    test("simple no field", function() {
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
});
