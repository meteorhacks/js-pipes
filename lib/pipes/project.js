module.exports = Project = function (dsl) {
  this.dsl = dsl;
  this.mapFields = {};
  this.pickFields = {};
  this._error;

  this._compile(dsl);
};

// currently only supported direct field mapping and picking only
Project.prototype.validate = function() {
  return this._error || true;
};

Project.prototype._compile = function() {
  var self = this;

  for(var key in this.dsl) {
    var value = this.dsl[key];

    if(typeof value == 'string') {
      if(/\./.test(value)) {
        return setError("value does not supported nested fields with dot(.)");
      } else if(!/^\$/.test(value)) {
        return setError("value must contail $ operator");
      } else {
        self.mapFields[value.substr(1)] = key;
      }
    } else if(typeof value == 'number') {
      self.pickFields[key] = true;
    } else {
      return setError("value must be either string or number")
    }
  }

  function setError(message) {
    self._error = new Error(message);
    self.apply = function() {
      throw new Error('unsupported dsl for project: ' + message);
    };
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
