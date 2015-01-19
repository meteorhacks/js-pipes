var Pipes = {};
Pipes["$match"] = require("./match");
Pipes["$project"] = require("./project");
Pipes["$group"] = require("./group");
Pipes["$sort"] = require("./sort");
Pipes["$limit"] = require("./limit");

Pipe = require("./pipe");

function Pipeline (stages) {
  Pipe.call(this);
  this.stages = stages;
  this.pipes = [];
  this.currentPipeIndex = 0;
  this.result = null;
  this._used = false;
  this._compile();
}

Pipe.extendWith(Pipeline);

Pipeline.prototype._compile = function() {
  var self = this;
  var stages = self.stages;

  for(var lc=0; lc<stages.length; lc++) {
    var stage = stages[lc];
    var firstKey =
      typeof stage == "object" &&
      Object.keys(stage).length == 1 &&
      Object.keys(stage)[0];

    if(!firstKey) {
      return self._setError("single stage can only have exactly one pipe operator");
    } else if(!Pipes[firstKey]) {
      return self._setError("There is no such a pipe operator called: " + firstKey);
    } else {
      var dsl = stage[firstKey];
      var pipe = new (Pipes[firstKey])(dsl);
      var errors = pipe.hasErrors();
      if(errors) {
        return self._setError(errors);
      } else {
        self.pipes.push(pipe);
      }
    }
  }
};

Pipeline.prototype.apply = function(data, callback) {
  var self = this;
  if(self._used) {
    return callback(new Error("already used!"));
  } else {
    self._used = true;
  }

  self.result = data;

  runNextPipe();
  function runNextPipe() {
    var pipe = self.pipes[self.currentPipeIndex++];
    if(pipe) {
      self.result = pipe.apply(self.result);
      setImmediate(runNextPipe);
    } else {
      callback(null, self.result);
    }
  }
};

module.exports = Pipeline;
