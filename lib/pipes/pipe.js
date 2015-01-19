var util = require('util');

function Pipe () {
  this._error = null;
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

module.exports = Pipe;
