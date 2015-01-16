var mongo = require('../_mongo');
var Project = require('../../lib/pipes/project')
var assert = require('assert');

suite("Pipes.project", function() {
  setup(function (done) {
    mongo.connect(done);
  });

  suite("invalid DSL", function() {
    test("without $ in values", function() {
      var p = new Project({abc: "hmm"});
      var validated = p.hasErrors();
      assert.ok(validated.message);
    });

    test("dot(.) in values", function() {
      var p = new Project({abc: "$hmm.aa"});
      var validated = p.hasErrors();
      assert.ok(validated.message);
    });
  });

  suite("applying pipe", function() {
    test("pickFields", function(done) {
      var dsl = {name: 1, age: 1, _id: false};
      var p = new Project(dsl);
      var input = [
        {name: "Arunoda", age: 25, dd: 33},
        {name: "Kuma", age: 40, aaa: 45}
      ];

      var output = p.apply(input);
      mongo.project(dsl, input, function (err, res) {
        if(err) throw err;
        assert.deepEqual(output, res);
        done();
      });
    });

    test("mapFields", function(done) {
      var dsl = {nama: "$name", wayasa: "$age", _id: false};
      var p = new Project(dsl);
      var input = [
        {name: "Arunoda", age: 25, dd: 33},
        {name: "Kuma", age: 40, aaa: 45}
      ];

      var output = p.apply(input);
      mongo.project(dsl, input, function (err, res) {
        if(err) throw err;
        assert.deepEqual(output, res);
        done();
      });
    });

    test("pick and map", function(done) {
      var dsl = {name: 1, wayasa: "$age", _id: false};
      var p = new Project(dsl);

      var input = [
        {name: "Arunoda", age: 25, dd: 33},
        {name: "Kuma", age: 40, aaa: 45}
      ];

      var output = p.apply(input);
      mongo.project(dsl, input, function (err, res) {
        if(err) throw err;
        assert.deepEqual(output, res);
        done();
      });
    });
  });
});
