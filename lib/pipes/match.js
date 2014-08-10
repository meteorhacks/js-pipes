var util = require('./util');
var Pipe = require('./pipe');

module.exports = Match = function (dsl) {
  Pipe.call(this);
  this.dsl = dsl;

  this.filters = [];

  this._compile();
};

Pipe.extendWith(Match);

Match.prototype._compile = function() {
  var self = this;
  var simpleFields = [];

  for(var field in self.dsl) {
    var operand = self.dsl[field];
    var fieldError = util.checkErrorForFieldName(field);

    if(fieldError) {
      return self._setError(fieldError);
    } else {
      simpleFields.push({
        field: field.substr(1),
        operand: operand
      });
    }
  }

  // add simple fields at the end
  self.filters.push(Match.operators.simple(simpleFields));
}

Match.prototype.apply = function(data) {
  var self = this;

  return data.filter(function(doc) {
    for(var lc=0; lc<self.filters.length; lc++) {
      var filter = self.filters[lc];
      var accepted = filter(doc);
      if(!accepted) {
        return false;
      }
    }

    return true;
  });
};

Match.operators = {
  simple: function(fieldMappings) {
    return function(doc) {
      return fieldMappings.reduce(function(prev, mapping) {
        return (doc[mapping.field] == mapping.operand) && prev;
      }, true);
    };
  }
};
