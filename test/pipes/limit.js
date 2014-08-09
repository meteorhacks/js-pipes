var Limit = require('../../lib/pipes/limit')
var assert = require('assert');

suite("Pipes.limit", function() {
  suite("invalid DSL", function() {
    test("limit is lower than 1", function() {
      var s = new Limit(-20);
      assert.ok(s.hasErrors().message);
    });
  });

  suite("applying pipe", function() {
    test("limiting", function() {
      var dataSet = [0, 1, 2, 3, 4, 5];

      var l = new Limit(2);
      var result = l.apply(dataSet);

      assert.deepEqual(result, [0, 1]);
    });
  });
});
