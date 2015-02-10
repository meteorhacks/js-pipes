var _ = require('lodash');
var util = require('./util');
var expr = require('./expr');
var Pipe = require('./pipe');

function Group (dsl) {
  Pipe.call(this);
  this.dsl = dsl;
  this._fieldsMappings = {};
  this._compile();
}

Pipe.extendWith(Group);

Group.prototype.apply = function(docs) {
  var self = this;
  var groupings = {};
  var _idDsl = this.dsl._id;

  docs.forEach(function (doc) {
    var _id;

    if(typeof _idDsl === 'string') {
      _id = expr.evalExpr(_idDsl, doc);
    } else if(typeof _idDsl === 'object') {
      _id = expr.evalObject(_idDsl, doc);
    }

    var _idString = JSON.stringify(_id);
    var group = groupings[_idString];
    var key;

    if(!group) {
      group = {_id: _id};
      groupings[_idString] = group;

      for(key in self.dsl) {
        if(key !== '_id') {
          group[key] = [];
        }
      }
    }

    for(key in self.dsl) {
      if(key !== '_id') {
        var valDsl = self._fieldsMappings[key].dsl;
        var value = expr.evalExpr(valDsl, doc);
        group[key].push(value);
      }
    }
  });

  var results = [];
  for(var groupId in groupings) {
    var group = groupings[groupId];

    for(var field in group) {
      if(field !== '_id') {
        var values = group[field];
        group[field] = this._fieldsMappings[field].operator(values);
      }
    }

    results.push(group);
  }

  return results;
};


Group.prototype._compile = function() {
  var self = this;
  self._compileId();
  if(!(self.hasErrors() instanceof Error)) {
    self._compileFields();
  }
};


Group.prototype._compileId = function() {
  var id = this.dsl._id;
  var error;

  if(typeof id === 'string') {
    error = util.checkErrorForFieldName(id);
  } else if(typeof id === 'object') {
    for(var key in id) {
      value = id[key];
      error = util.checkErrorForFieldName(value);

      if(error) {
        break;
      }
    }
  } else {
    error = '_id must contains string or object only';
  }

  if(error) {
    this._setError(error);
  }
};


Group.prototype._compileFields = function() {
  var fields = this.dsl;

  for(var key in fields) {
    if(key === '_id') {
      continue;
    }

    var dsl = fields[key];
    if(typeof dsl !== 'object') {
      return this._setError('field must contain an operator');
    }

    var operators = Object.keys(dsl);
    if(operators.length !== 1) {
      return this._setError('only exactly one operator is supported');
    }

    var operatorName = operators[0];
    var operator = Group.ops[operatorName];
    if(!operator) {
      return this._setError('unsupported operator: ' + operators[0]);
    }

    var valueDsl = dsl[operatorName];
    var isValid = this._isValidValue(valueDsl);
    if(!isValid) {
      return this._setError('invalid expression for ' + key);
    }

    this._fieldsMappings[key] = {
      operator: operator,
      dsl: dsl[operatorName],
    };
  }
};


Group.prototype._isValidValue = function(dsl) {
  if(typeof dsl === 'number') {
    return true;
  }

  if(typeof dsl === 'string') {
    var error = util.checkErrorForFieldName(dsl);
    if(error) {
      return false;
    }

    return true;
  }

  // TODO => support mongo expressions in $group stage ($add, etc.)
  //         expression support can be enabled if it can be validated
  return false;
};


Group.ops = {};


Group.ops.$sum = function(data) {
  return data.reduce(function(prev, curr) {
    return (typeof curr === 'number')? prev + curr : prev;
  }, 0);
};


Group.ops.$avg = function(data) {
  var total = Group.ops.$sum(data);
  return total/data.length;
};


Group.ops.$max = function(data) {
  var maxItem = data[0];
  for(var lc=0; lc<data.length; lc++) {
    var item = data[lc];
    if(typeof item === 'number' && item > maxItem) {
      maxItem = item;
    }
  }

  return maxItem;
};


Group.ops.$min = function(data) {
  var minItem = data[0];
  for(var lc=0; lc<data.length; lc++) {
    var item = data[lc];
    if(typeof item === 'number' && item < minItem) {
      minItem = item;
    }
  }

  return minItem;
};


Group.ops.$addToSet = function(data) {
  return _.uniq(data);
};


Group.ops.$first = function(data) {
  return _.first(data);
};


Group.ops.$last = function(data) {
  return _.last(data);
};


Group.ops.$push = function(data) {
  return data;
};


module.exports = Group;
