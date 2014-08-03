module.exports = Group = function(dsl) {
  this.dsl = dsl;
  this.idLiteral = false;
  this.idMappings = {}
  this.fieldsMappings = {};

  this._compile(dsl);
};

Group.prototype.validate = function() {
  return this._error || true;
};

Group.prototype.apply = function(docs) {
  var groupings = {};
  var result = [];

  // grouping
  docs.forEach(function(item) {
    var _id = self._generateId(item);
    var key = JSON.stringify(key);
    if(!groupings[key]) {
      groupings[key] = {
        _id: _id;
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
      var values = item[fields];
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
  if(!(self.validate() instanceof Error)) {
    self._compileFields();
  }
};

Group.prototype._compileId = function() {
  var self = this;
  var id = self.dsl._id;

  if(typeof id == 'string') {
    if(self._expect$(id)) {
      self.idLiteral = id.substr(1);
    } else {
      self._setError("_id requires $ reference");
    }
  } else if(typeof id == 'object') {
    for(var key in id) {
      value = id[key];
      if(self._expect$(value)) {
        self.idMappings[key] = value;
      } else {
        return self._setError("values in _id requires $ reference");
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
        var operator = Group.operators[operators[0]];
        if(operator) {
          var source = null;
          if(typeof value == "number") {
            source = value;
          } else if(self._exptect$(value)) {
            source = value.substr(1);
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

Group.prototype._setError = function(message) {
  this._error = new Error(message);
};

Group.operators = {};
Group.operators.$sum = function(data) {
  return data.reduce(function(prev, curr) {
    return (typeof curr == "number")? prev + curr : prev;
  }, 0);
};

Group.operators.$avg = function(data) {
  var total = Group.operators.sum(data);
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
