var util = require('./util');
var expr = require('./expr');
var Pipe = require('./pipe');

function Match (dsl) {
  Pipe.call(this);
  this.dsl = dsl;
  this.filters = [];
  this._compile();
}

Pipe.extendWith(Match);

Match.prototype._compile = function() {
  var self = this;
  var simpleOperators = [];

  for(var field in self.dsl) {
    var operand = self.dsl[field];
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

    if(isSimpleOperator) {
      simpleOperators.push({
        field: field,
        operand: operand
      });
    } else if(isComplex) {
      var operandValue = operand[firstKey];
      var filter = Match.operators.comparison[firstKey](field, operandValue);
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
        var fieldValue = expr.val('$' + mapping.field, doc);

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
      var value = expr.val('$' + field, doc);
      return value < operand;
    };
  },

  $lte: function(field, operand) {
    return function(doc) {
      var value = expr.val('$' + field, doc);
      return value <= operand;
    };
  },

  $gt: function(field, operand) {
    return function(doc) {
      var value = expr.val('$' + field, doc);
      return value > operand;
    };
  },

  $gte: function(field, operand) {
    return function(doc) {
      var value = expr.val('$' + field, doc);
      return value >= operand;
    };
  },

  $eq: function(field, operand) {
    return function(doc) {
      var value = expr.val('$' + field, doc);
      return value === operand;
    };
  },

  $ne: function(field, operand) {
    return function(doc) {
      var value = expr.val('$' + field, doc);
      return value !== operand;
    };
  }
};

module.exports = Match;
