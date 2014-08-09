var util = require('./util');
var Pipe = require('./pipe');

module.exports = Group = function(dsl) {
  Pipe.call(this);
  this.dsl = dsl;
  this.idLiteral = false;
  this.idMappings = {}
  this.fieldsMappings = {};

  this._compile();
};

Pipe.extendWith(Group);

Group.prototype.apply = function(docs) {
  var self = this;
  var groupings = {};
  var result = [];

  // grouping
  docs.forEach(function(item) {
    var _id = self._generateId(item);
    var key = JSON.stringify(_id);
    if(!groupings[key]) {
      groupings[key] = {
        _id: _id
      };

      for(var field in self.fieldsMappings) {
        groupings[key][field] = [];
      }
      result.push(groupings[key]);
    }

    var groupedItem = groupings[key];
    for(var field in self.fieldsMappings) {
      var mappings = self.fieldsMappings[field];
      if(mappings.isNumber) {
        groupedItem[field].push(mappings.source);
      } else {
        groupedItem[field].push(item[mappings.source]);
      }
    }
  });

  result.forEach(function(item) {
    for(var field in item) {
      if(field == '_id') continue;
      var values = item[field];
      item[field] = self.fieldsMappings[field].operator(values);
    }
  });

  return result;
};

Group.prototype._generateId = function(doc) {
  var self = this;
  if(self.idLiteral) {
    return doc[self.idLiteral];
  } else {
    var _id = {};
    for(var key in self.idMappings) {
      _id[key] = doc[self.idMappings[key]];
    }
    return _id;
  }
};

Group.prototype._compile = function() {
  var self = this;
  self._compileId();
  if(!(self.hasErrors() instanceof Error)) {
    self._compileFields();
  }
};

Group.prototype._compileId = function() {
  var self = this;
  var id = self.dsl._id;

  if(typeof id == 'string') {
    var error = util.checkErrorForFieldName(id);
    if(error) {
      self._setError(error);
    } else {
      self.idLiteral = id.substr(1);
    }
  } else if(typeof id == 'object') {
    for(var key in id) {
      value = id[key];
      var error = util.checkErrorForFieldName(value);
      if(error) {
        return self._setError(error);
      } else {
        self.idMappings[key] = value.substr(1);
      }
    }
  } else {
    self._setError("_id must contains string or object only")
  }
};

Group.prototype._compileFields = function() {
  var self = this;
  var fields = this.dsl;

  for(var key in fields) {
    var value = fields[key];
    if(key == "_id") continue;

    if(typeof value == 'object') {
      var operators = Object.keys(value);
      if(operators.length === 1) {
        var operatorName = operators[0];
        var operator = Group.operators[operatorName];
        if(operator) {
          var operatorValue = value[operatorName];
          var source = null;
          if(typeof operatorValue == "number") {
            source = operatorValue;
          } else if(typeof operatorValue == "string") {
            var error = util.checkErrorForFieldName(operatorValue);
            if(error) {
              return self._setError(error);
            } else {
              source = operatorValue.substr(1);
            }
          } else {
            return self._setError("operator's field should be either $field or number");
          }

          self.fieldsMappings[key] = {
            operator: operator,
            source: source,
            isNumber: typeof source == 'number'
          };
        } else {
          return self._setError("unsupported operator: " + operators[0]);
        }
      } else {
        return self._setError("only exactly one operator is supported");
      }
    } else {
      return self._setError("field must contain an operator");
    }
  }
};

Group.prototype._exptect$ = function(value) {
  return /^\$/.test(value);
};

Group.operators = {};
Group.operators.$sum = function(data) {
  return data.reduce(function(prev, curr) {
    return (typeof curr == "number")? prev + curr : prev;
  }, 0);
};

Group.operators.$avg = function(data) {
  var total = Group.operators.$sum(data);
  return total/data.length;
};

Group.operators.$max = function(data) {
  var maxItem = data[0];
  for(var lc=0; lc<data.length; lc++) {
    var item = data[lc];
    if(typeof item == "number" && item > maxItem) {
      maxItem = item;
    }
  }

  return maxItem;
};

Group.operators.$min = function(data) {
  var minItem = data[0];
  for(var lc=0; lc<data.length; lc++) {
    var item = data[lc];
    if(typeof item == "number" && item < minItem) {
      minItem = item;
    }
  }

  return minItem;
};
