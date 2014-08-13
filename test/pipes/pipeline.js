var Pipeline = require('../../lib/pipes/pipeline')
var assert = require('assert');

suite("Pipeline", function() {
  suite("invalid DSL", function() {
    test("with more than one pipe type in a single stage", function() {
      var pipeline = new Pipeline([
        {$sort: {aa: 1}, $limit: 1}
      ]);
      var error = pipeline.hasErrors();
      assert.ok(error.message);
    });

    test("invalid pipe type", function() {
      var pipeline = new Pipeline([
        {$anemanda: 10}
      ]);
      var error = pipeline.hasErrors();
      assert.ok(error.message);
    });

    test("pipe level error", function() {
      var pipeline = new Pipeline([
        {$sort: {"$aa": 1}}
      ]);
      var error = pipeline.hasErrors();
      assert.ok(error.message);
    });
  });

  suite("applying pipe", function() {
    test("simple pipeline", function(done) {
      var stages = [
        {$group: {_id: "$username", marks: {$sum: "$marks"}}},
        {$sort: {marks: -1}},
        {$limit: 1},
        {$project: {username: "$_id"}}
      ];

      var dataSet = [
        {username: 'arunoda', marks: 90, subject: "maths"},
        {username: 'arunoda', marks: 100, subject: "english"},
        {username: 'kuma', marks: 90, subject: "maths"},
      ];

      var pipeline = new Pipeline(stages);
      assert.ok(!pipeline.hasErrors());

      pipeline.apply(dataSet, function(err, result) {
        assert.deepEqual(result, [
          {username: "arunoda"}
        ])
        done();
      });
    });

    test("reusing pipeline", function(done) {
      var stages = [
        {$limit: 1},
      ];

      var dataSet = [
        {username: 'arunoda', marks: 90, subject: "maths"},
        {username: 'arunoda', marks: 100, subject: "english"},
        {username: 'kuma', marks: 90, subject: "maths"},
      ];

      var pipeline = new Pipeline(stages);
      assert.ok(!pipeline.hasErrors());

      pipeline.apply(dataSet, function(err, result) {
        assert.ifError(err);
        pipeline.apply(dataSet, function(err) {
          assert.ok(err.message);
          done();
        });
      });
    });
  });
});
