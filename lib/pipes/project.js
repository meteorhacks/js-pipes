var util = require('./util');
var expr = require('./expr');
var Pipe = require('./pipe');

module.exports = Project = function (dsl) {
  Pipe.call(this);
  this.dsl = dsl;
  this._error;

  this._compile();
};

Pipe.extendWith(Project);

Project.prototype._compile = function() {
  var self = this;

  for(var key in this.dsl) {
    var value = this.dsl[key];

    if(typeof value == 'string') {
      var error = util.checkErrorForFieldName(value);
      if(error) {
        return self._setError(error);
      }
    }
  }
}

Project.prototype.apply = function(data) {
  var self = this;

  return data.map(function(doc) {
    return expr(self.dsl, doc);
  });
};
