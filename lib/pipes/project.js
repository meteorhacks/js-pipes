var util = require('./util');
var expr = require('./expr');
var Pipe = require('./pipe');

function Project (dsl) {
  Pipe.call(this);
  this.dsl = dsl;
  this._compile();
}

Pipe.extendWith(Project);

Project.prototype._compile = function() {
  var self = this;

  for(var key in this.dsl) {
    var value = this.dsl[key];

    if(typeof value === 'string') {
      var error = util.checkErrorForFieldName(value);
      if(error) {
        return self._setError(error);
      }
    }
  }
};


Project.prototype.apply = function(data) {
  var self = this;
  var result = data.map(function(doc) {
    return expr(self.dsl, doc);
  });

  if(this.dsl._id === false || this.dsl._id === 0) {
    return result.map(function (doc) {
      delete doc._id;
      return doc;
    });
  } else {
    return result;
  }
};


module.exports = Project;
