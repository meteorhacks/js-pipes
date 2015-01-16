var mongo = require('../_mongo');
var Limit = require('../../lib/pipes/limit')
var assert = require('assert');

suite("Pipes.limit", function() {
  setup(function (done) {
    mongo.connect(done);
  });

  suite("invalid DSL", function() {
    test("limit is lower than 1", function() {
      var s = new Limit(-20);
      assert.ok(s.hasErrors().message);
    });
  });

  suite("applying pipe", function() {
    test("limiting", function(done) {
      var dataSet = [{n: 0}, {n: 1}, {n: 2}, {n: 3}, {n: 4}];

      var dsl = 2;
      var l = new Limit(dsl);
      var result = l.apply(dataSet);

      mongo.limit(2, dataSet, function (err, res) {
        if(err) throw err;
        assert.deepEqual(result, res);
        done();
      });
    });
  });
});
