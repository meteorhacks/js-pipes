module.exports = QueryEngine = function QueryEngine(client) {
  this.client = client;
};

QueryEngine.prototype.select = function(cql, callback) {
  var self = this;
  if(!/^select/i.test(cql)) {
    return callback(new Error("only accept CQL SELECT queries"));
  }

  self.client.execute(cql, function(err, result) {
    if(err) {
      callback(err);
    } else {
      var rows = result.rows || [];
      rows.forEach(function(row) {
        row.columns = undefined;
      });
      callback(null, rows);
    }
  });
};
