var Project = require('../../lib/pipes/project')
var assert = require('assert');

suite("Pipes.project", function() {
  suite("invalid DSL", function() {
    test("with object as values", function() {
      var p = new Project({abc: {}});
      var validated = p.validate();
      assert.ok(validated.message);
    });

    test("without $ in values", function() {
      var p = new Project({abc: "hmm"});
      var validated = p.validate();
      assert.ok(validated.message);
    });

    test("dot(.) in values", function() {
      var p = new Project({abc: "$hmm.aa"});
      var validated = p.validate();
      assert.ok(validated.message);
    });
  });

  suite("applying pipe", function() {
    test("pickFields", function() {
      var p = new Project({name: 1, age: 1});
      var input = [
        {name: "Arunoda", age: 25, dd: 33},
        {name: "Kuma", age: 40, aaa: 45}
      ];

      var output = p.apply(input);
      assert.deepEqual(output, [
        {name: "Arunoda", age: 25},
        {name: "Kuma", age: 40}
      ]);
    });

    test("mapFields", function() {
      var p = new Project({
        nama: "$name",
        wayasa: "$age"
      });
      var input = [
        {name: "Arunoda", age: 25, dd: 33},
        {name: "Kuma", age: 40, aaa: 45}
      ];

      var output = p.apply(input);
      assert.deepEqual(output, [
        {nama: "Arunoda", wayasa: 25},
        {nama: "Kuma", wayasa: 40}
      ]);
    });

    test("pick and map", function() {
      var p = new Project({
        name: 1,
        wayasa: "$age"
      });

      var input = [
        {name: "Arunoda", age: 25, dd: 33},
        {name: "Kuma", age: 40, aaa: 45}
      ];

      var output = p.apply(input);
      assert.deepEqual(output, [
        {name: "Arunoda", wayasa: 25},
        {name: "Kuma", wayasa: 40}
      ]);
    });
  });
});
