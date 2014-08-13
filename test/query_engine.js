var QueryEngine = require('../lib/query_engine.js');
var assert = require('assert');

suite('QueryEngine', function() {
  suite('select', function() {
    test("not a select query", function(done) {
      var qe = new QueryEngine();
      qe.select("UPDATE abc SET aa='10'", function(err) {
        assert.ok(err.message.match('only accept'));
        done();
      });
    });

    test("client error", function(done) {
      var error = {};
      var client = {
        execute: function(query, callback) {
          callback(error);
        }
      };
      var qe = new QueryEngine(client);
      qe.select("SELECT * FROM abc", function(err) {
        assert.equal(err, error);
        done();
      });
    });

    test("removing columns", function(done) {
      var error = {};
      var client = {
        execute: function(query, callback) {
          callback(null, {rows: [
            {columns: {}, aa: 10, bb: 20},
            {columns: {}, aa: 20, bb: 40},
          ]});
        }
      };
      var qe = new QueryEngine(client);
      qe.select("SELECT * FROM abc", function(err, result) {
        assert.ifError(err);
        assert.deepEqual(result, [
          {columns: undefined, aa: 10, bb: 20},
          {columns: undefined, aa: 20, bb: 40}
        ]);
        done();
      });
    });

  });
});
