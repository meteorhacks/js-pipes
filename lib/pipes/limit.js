var util = require('./util');
var Pipe = require('./pipe');

module.exports = Limit = function (dsl) {
  Pipe.call(this);
  this.limit = dsl;

  this._compile();
};

Pipe.extendWith(Limit);

Limit.prototype._compile = function() {
  var self = this;
  if(self.limit <= 0) {
    return self._setError("limit value needs to be greter than 0");
  }
}

Limit.prototype.apply = function(data) {
  var self = this;
  return data.slice(0, self.limit);
};
