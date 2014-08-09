var util = require('util');

module.exports = Pipe = function() {
  this._error;
}

Pipe.prototype._setError = function(errorMessage) {
  this._error = new Error(errorMessage);
};

Pipe.prototype.hasErrors = function() {
  return this._error || false;
};

Pipe.extendWith = function(child) {
  util.inherits(child, Pipe);
};
