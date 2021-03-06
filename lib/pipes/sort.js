var util = require('./util');
var expr = require('./expr');
var Pipe = require('./pipe');

function Sort (dsl) {
  Pipe.call(this);
  this.dsl = dsl;
  this.sorters = [];
  this._compile();
}

Pipe.extendWith(Sort);

Sort.prototype._compile = function() {
  var self = this;

  for(var field in self.dsl) {
    var order = self.dsl[field];

    if(util.isBeginningWith$(field)) {
      return self._setError('beginning $ is not needed for sort specifiers');
    } else if([0, 1, -1].indexOf(order) < 0) {
      return self._setError('sort order needs to be either 0, 1 or -1');
    } else {
      self.sorters.push({
        field: field,
        order: order
      });
    }
  }
};


Sort.prototype.apply = function(data) {
  var self = this;

  data.sort(function(a, b) {
    for(var lc=0; lc<self.sorters.length; lc++) {
      var sorter = self.sorters[lc];
      var valueOfA = self._sortableValue(sorter.field, a);
      var valueOfB = self._sortableValue(sorter.field, b);

      if(valueOfA < valueOfB) {
        return -1 * sorter.order;
      } else if(valueOfA > valueOfB) {
        return 1 * sorter.order;
      }
    }

    //seems like all the sorting fieils are the same
    return 0;
  });

  return data;
};


Sort.prototype._sortableValue = function(field, doc) {
  var value = expr.val('$' + field, doc);
  return value;
};


module.exports = Sort;
