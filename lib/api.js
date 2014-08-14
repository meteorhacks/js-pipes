var Pipeline = require('./pipes/pipeline');
var connect = require('connect');

module.exports = Api = function Api(app, queryEngine) {
  this.app = app;
  this.queryEngine = queryEngine;
};

Api.prototype.start = function(config) {
  this.config = config;

  this.app.use(connect.json());
  this.app.use(this._processMessages.bind(this));
};

Api.prototype._processMessages = function(req, res) {
  var self = this;

  if(req.url == "/aggregate") {
    req.body = req.body || {};
    var query = req.body.query;
    var stages = req.body.stages;

    if(req.method != "POST") {
      self._sendError(res, 403, "only POST allowed for /aggregate");
    } else if(!query || !stages) {
      self._sendError(res, 403, "query and stages are required");
    } else if (!(stages instanceof Array)) {
      self._sendError(res, 403, "stages must be an array of pipe queries");
    } else {
      self._processAggregate(query, stages, res);
    }

  } else {
    res.writeHead(404);
    res.end();
  }
};

Api.prototype._processAggregate = function(query, stages, res) {
  var self = this;

  this.queryEngine.select(query, function(err, result) {
    if(err) {
      self._sendError(res, 500, err.message);
    } else {
      var pipeline = new Pipeline(stages);
      var error = pipeline.hasErrors();
      if(error) {
        self._sendError(res, 500, error.message);
      } else {
        pipeline.apply(result, onResult);
      }
    }
  });

  function onResult(err, result) {
    if(err) {
      self._sendError(res, 500, err.message);
    } else {
      res.writeHead(200, {"Content-Type": "application/json"});
      res.write(JSON.stringify(result));
      res.end();
    }
  }
};

Api.prototype._sendError = function(res, code, message) {
  res.writeHead(code);
  res.end(message);
}
