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
  var simpleOperators = [];

  for(var field in self.dsl) {
    var operand = self.dsl[field];
    var fieldError = util.checkErrorForFieldName(field);
    var isSimpleOperator =
      ["string", "number", "boolean", "undefined"].indexOf(typeof operand) >= 0 ||
      operand === null ||
      operand instanceof RegExp;

    var firstKey =
      typeof operand == "object" &&
      Object.keys(operand).length == 1 && Object.keys(operand)[0];
    var isComplex =
      firstKey && util.isBeginningWith$(firstKey) &&
      Match.operators.comparison[firstKey];

    if(fieldError) {
      return self._setError(fieldError);
    } else if(isSimpleOperator) {
      simpleOperators.push({
        field: field.substr(1),
        operand: operand
      });
    } else if(isComplex) {
      var operandValue = operand[firstKey];
      var filter = Match.operators.comparison[firstKey](field.substr(1), operandValue);
      self.filters.push(filter);
    }
  }

  // add simple fields at the end
  self.filters.push(Match.operators.comparison.simple(simpleOperators));
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

Match.operators = {};
Match.operators.comparison = {
  simple: function(fieldMappings) {
    return function(doc) {
      return fieldMappings.reduce(function(prev, mapping) {
        var fieldValue = doc[mapping.field];

        if(mapping.operand instanceof RegExp) {
          return mapping.operand.test(fieldValue);
        } else {
          return (fieldValue == mapping.operand) && prev;
        }
      }, true);
    };
  },

  $lt: function(field, operand) {
    return function(doc) {
      return doc[field] < operand;
    };
  },

  $lte: function(field, operand) {
    return function(doc) {
      return doc[field] <= operand;
    };
  },

  $gt: function(field, operand) {
    return function(doc) {
      return doc[field] > operand;
    };
  },

  $gte: function(field, operand) {
    return function(doc) {
      return doc[field] >= operand;
    };
  },

  $eq: function(field, operand) {
    return function(doc) {
      return doc[field] === operand;
    }
  },

  $ne: function(field, operand) {
    return function(doc) {
      return doc[field] !== operand;
    }
  }
};
