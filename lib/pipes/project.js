var util = require('./util');
var Pipe = require('./pipe');

module.exports = Project = function (dsl) {
  Pipe.call(this);
  this.dsl = dsl;
  this.mapFields = {};
  this.pickFields = {};
  this._error;

  this._compile(dsl);
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
      } else {
        self.mapFields[value.substr(1)] = key;
      }
    } else if(typeof value == 'number') {
      self.pickFields[key] = true;
    } else {
      return self._setError("value must be either string or number")
    }
  }
}

Project.prototype.apply = function(data) {
  var self = this;

  return data.map(function(doc) {
    var newDoc = {};
    for(var key in doc) {
      if(self.pickFields[key]) {
        newDoc[key] = doc[key];
      } else if(self.mapFields[key]) {
        newDoc[self.mapFields[key]] = doc[key];
      }
    }

    return newDoc;
  });
};
