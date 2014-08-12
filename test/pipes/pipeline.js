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

  });
});
