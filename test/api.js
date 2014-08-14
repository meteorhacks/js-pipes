var Api = require('../lib/api');
var assert = require('assert');
var request = require('request');
var connect = require('connect');
var http = require('http');
var portFinder = require('portfinder');

suite("Api", function() {
  test("accept only on /aggregate", function(done) {
    createApp(function(port, app, close) {
      var api = new Api(app);
      api.start();
      request.post(getUrl('/noroute', port), function(err, res, body) {
        assert.ifError(err);
        assert.equal(res.statusCode, 404);
        close(done);
      });
    });
  });

  suite("/aggregate", function() {
    test("accept only POST requests", function(done) {
      createApp(function(port, app, close) {
        var api = new Api(app);
        api.start();
        request.get(getUrl('/aggregate', port), function(err, res, body) {
          assert.equal(res.statusCode, 403);
          assert.equal(body, 'only POST allowed for /aggregate');
          close(done);
        });
      });
    });

    test("check for query and stages exisistance", function(done) {
      createApp(function(port, app, close) {
        var api = new Api(app);
        api.start();
        request.post(getUrl('/aggregate', port), function(err, res, body) {
          assert.equal(res.statusCode, 403);
          assert.equal(body, 'query and stages are required');
          close(done);
        });
      });
    });

    test("check stages for an array", function(done) {
      createApp(function(port, app, close) {
        var api = new Api(app);
        api.start();
        var options = {
          json: {
            query: "the query",
            stages: "invalid stages"
          }
        };
        request.post(getUrl('/aggregate', port), options, function(err, res, body) {
          assert.equal(res.statusCode, 403);
          assert.equal(body, 'stages must be an array of pipe queries');
          close(done);
        });
      });
    });

    test("queryEngine error", function(done) {
      var error = new Error("the-select-error");
      var queryEngine = {
        select: function(cql, callback) {
          callback(error);
        }
      };

      createApp(function(port, app, close) {
        new Api(app, queryEngine).start();
        var options = {
          json: {
            query: "the query",
            stages: []
          }
        };
        request.post(getUrl('/aggregate', port), options, function(err, res, body) {
          assert.equal(res.statusCode, 500);
          assert.equal(body, error.message);
          close(done);
        });
      });
    });

    test("pipeline error", function(done) {
      var queryEngine = {
        select: function(cql, callback) {
          callback(null, [{aa: 10, bb: 20}]);
        }
      };

      createApp(function(port, app, close) {
        new Api(app, queryEngine).start();
        var options = {
          json: {
            query: "the query",
            stages: [{$boomba: {}}]
          }
        };
        request.post(getUrl('/aggregate', port), options, function(err, res, body) {
          assert.equal(res.statusCode, 500);
          assert.ok(/boomba/.test(body))
          close(done);
        });
      });
    });

    test("correct pipeline", function(done) {
      var queryEngine = {
        select: function(cql, callback) {
          callback(null, [10, 20]);
        }
      };

      createApp(function(port, app, close) {
        new Api(app, queryEngine).start();
        var options = {
          json: {
            query: "the query",
            stages: [{$limit: 1}]
          }
        };
        request.post(getUrl('/aggregate', port), options, function(err, res, body) {
          assert.equal(res.statusCode, 200);
          assert.deepEqual(body, [10]);
          close(done);
        });
      });
    });
  });
});

function getUrl(path, port, host) {
  host = host || "localhost";
  return "http://" + host + ":" + port + path;
}

function createApp(callback) {
  var app = connect();
  var server = http.createServer(app);
  var port;

  portFinder.getPort(function(err, _port) {
    assert.ifError(err);
    port = _port;
    server.listen(port, afterBound);
  });

  function afterBound() {
    callback(port, app, closeServer);
  }

  function closeServer(callback) {
    server.close(callback);
  }
}
