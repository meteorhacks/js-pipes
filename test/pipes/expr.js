var mongo = require('../_mongo');
var expr = require('../../lib/pipes/expr');
var assert = require('assert');

suite('Expressions', function () {
  setup(function (done) {
    mongo.connect(done);
  });


  suite('expr', function () {
    test('pick document fields', function (done) {
      var doc = {a: 100, b: {c: 200}, d: 300};
      var dsl = {e: '$a', f: '$b.c', d: 1};
      var out = expr(dsl, doc);
      mongo.eval(dsl, doc, function (err, res) {
        if(err) throw err;
        assert.deepEqual(out, res);
        done();
      });
    });
  })


  suite('operations', function () {
    suite('$add', function () {
      test('values and fields', function (done) {
        var doc = {foo: 120};
        var dsl = {res: {$add: ['$foo', 2, 3]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$divide', function () {
      test('values and fields', function (done) {
        var doc = {foo: 120};
        var dsl = {res: {$divide: ['$foo', 3]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$mod', function () {
      test('values and fields', function (done) {
        var doc = {foo: 120};
        var dsl = {res: {$mod: ['$foo', 25]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$multiply', function () {
      test('values and fields', function (done) {
        var doc = {foo: 120};
        var dsl = {res: {$multiply: ['$foo', 2, 10]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$subtract', function () {
      test('values and fields', function (done) {
        var doc = {foo: 120};
        var dsl = {res: {$subtract: ['$foo', 2]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$and', function () {
      test('values and fields - success', function (done) {
        var doc = {foo: 120};
        var dsl = {res: {$and: ['$foo', 2, 3]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - failure', function (done) {
        var doc = {foo: 120};
        var dsl = {res: {$and: ['$foo', 0, 3]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$not', function () {
      test('values and fields - success', function (done) {
        var doc = {foo: 120};
        var dsl = {res: {$not: '$foo'}, res2: {$not: 120}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - failure', function (done) {
        var doc = {foo: 0};
        var dsl = {res: {$not: '$foo'}, res2: {$not: 0}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$or', function () {
      test('values and fields - success', function (done) {
        var doc = {foo: 120};
        var dsl = {res: {$or: ['$foo', 2, 0]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - failure', function (done) {
        var doc = {foo: 0};
        var dsl = {res: {$or: ['$foo', 0]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$allElementsTrue', function () {
      test('values and fields - success', function (done) {
        var doc = {foo: [1, 2, 3]};
        var dsl = {res: {$allElementsTrue: '$foo'}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - failure', function (done) {
        var doc = {foo: [0, 1, 2, 3]};
        var dsl = {res: {$allElementsTrue: '$foo'}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$anyElementTrue', function () {
      test('values and fields - success', function (done) {
        var doc = {foo: [0, 1, undefined, null]};
        var dsl = {res: {$anyElementTrue: '$foo'}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - failure', function (done) {
        var doc = {foo: [0, undefined, null]};
        var dsl = {res: {$anyElementTrue: '$foo'}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$setDifference', function () {
      test('values and fields', function (done) {
        var doc = {foo: [1, 2, 3]};
        var dsl = {res: {$setDifference: ['$foo', [2, 4]]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$setEquals', function () {
      test('values and fields - success', function (done) {
        var doc = {foo: [1, 2]};
        var dsl = {res: {$setEquals: ['$foo', [1, 2, 2]]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - failure', function (done) {
        var doc = {foo: [1, 2]};
        var dsl = {res: {$setEquals: ['$foo', [1, 3]]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$setIntersection', function () {
      test('values and fields', function (done) {
        var doc = {foo: [1, 2, 3]};
        var dsl = {res: {$setIntersection: ['$foo', [2, 3]]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$setIsSubset', function () {
      test('values and fields - success', function (done) {
        var doc = {foo: [1, 2]};
        var dsl = {res: {$setIsSubset: ['$foo', [1, 2, 3]]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - success', function (done) {
        var doc = {foo: [1, 2, 3]};
        var dsl = {res: {$setIsSubset: ['$foo', [2, 4]]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$setUnion', function () {
      test('values and fields', function (done) {
        var doc = {foo: [1, 2, 3]};
        var dsl = {res: {$setUnion: ['$foo', [2, 4]]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          var sorter = function (a, b) { return a > b; }
          out.res.sort(sorter);
          res.res.sort(sorter);
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$cmp', function () {
      test('values and fields - equal', function (done) {
        var doc = {foo: 5};
        var dsl = {res: {$cmp: ['$foo', 5]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - greater', function (done) {
        var doc = {foo: 5};
        var dsl = {res: {$cmp: ['$foo', 4]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - less', function (done) {
        var doc = {foo: 4};
        var dsl = {res: {$cmp: ['$foo', 5]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$eq', function () {
      test('values and fields - success', function (done) {
        var doc = {foo: 5};
        var dsl = {res: {$eq: ['$foo', 5]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - failure', function (done) {
        var doc = {foo: 5};
        var dsl = {res: {$eq: ['$foo', 4]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$gt', function () {
      test('values and fields - success', function (done) {
        var doc = {foo: 5};
        var dsl = {res: {$gt: ['$foo', 4]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - failure', function (done) {
        var doc = {foo: 5};
        var dsl = {res: {$gt: ['$foo', 6]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$gte', function () {
      test('values and fields - success', function (done) {
        var doc = {foo: 5};
        var dsl = {res: {$gte: ['$foo', 5]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - failure', function (done) {
        var doc = {foo: 5};
        var dsl = {res: {$gte: ['$foo', 6]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$lt', function () {
      test('values and fields - success', function (done) {
        var doc = {foo: 5};
        var dsl = {res: {$lt: ['$foo', 6]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - failure', function (done) {
        var doc = {foo: 5};
        var dsl = {res: {$lt: ['$foo', 4]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$lte', function () {
      test('values and fields - success', function (done) {
        var doc = {foo: 5};
        var dsl = {res: {$lte: ['$foo', 5]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - failure', function (done) {
        var doc = {foo: 5};
        var dsl = {res: {$lte: ['$foo', 4]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$ne', function () {
      test('values and fields - success', function (done) {
        var doc = {foo: 5};
        var dsl = {res: {$ne: ['$foo', 6]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - failure', function (done) {
        var doc = {foo: 5};
        var dsl = {res: {$ne: ['$foo', 5]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$concat', function () {
      test('values and fields', function (done) {
        var doc = {foo: 'hello '};
        var dsl = {res: {$concat: ['$foo', 'world']}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$strcasecmp', function () {
      test('values and fields - equal', function (done) {
        var doc = {foo: 'b'};
        var dsl = {res: {$strcasecmp: ['$foo', 'b']}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - less', function (done) {
        var doc = {foo: 'a'};
        var dsl = {res: {$strcasecmp: ['$foo', 'b']}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - greater', function (done) {
        var doc = {foo: 'c'};
        var dsl = {res: {$strcasecmp: ['$foo', 'b']}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$substr', function () {
      test('values and fields', function (done) {
        var doc = {foo: 'abcde'};
        var dsl = {res: {$substr: ['$foo', 1, 2]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$toLower', function () {
      test('values and fields', function (done) {
        var doc = {foo: 'ABcd'};
        var dsl = {res: {$toLower: '$foo'}, res2: {$toLower: 'EFgh'}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$toUpper', function () {
      test('values and fields', function (done) {
        var doc = {foo: 'ABcd'};
        var dsl = {res: {$toUpper: '$foo'}, res2: {$toUpper: 'EFgh'}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$size', function () {
      test('values and fields', function (done) {
        var doc = {foo: [1, 2, 3]};
        var dsl = {res: {$size: '$foo'}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$let', function () {
      test('values and fields', function (done) {
        var doc = {global: 'g'};
        var dsl = {res: {$let: {
          vars: {redir: '$global', local: 'l'},
          in: {local: '$$local', global: '$global', redir: '$$redir'}
        }}};

        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$map', function () {
      test('values and fields', function (done) {
        var doc = {arr: [1, 2, 3]};
        var dsl = {res: {$map: {
          input: '$arr',
          as: 'item',
          in: '$$item'
        }}};

        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$literal', function () {
      test('values and fields', function (done) {
        var doc = {field: 'lol'};
        var dsl = {res: {$literal: '$field'}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$dayOfMonth', function () {
      test('values and fields', function (done) {
        var doc = {field: new Date(Date.UTC(2015, 0, 2, 3, 4, 5,  6))};
        var dsl = {res: {$dayOfMonth: '$field'}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$dayOfWeek', function () {
      test('values and fields', function (done) {
        var doc = {field: new Date(Date.UTC(2015, 0, 2, 3, 4, 5,  6))};
        var dsl = {res: {$dayOfWeek: '$field'}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$dayOfYear', function () {
      test('values and fields', function (done) {
        var doc = {field: new Date(Date.UTC(2015, 0, 2, 3, 4, 5,  6))};
        var dsl = {res: {$dayOfYear: '$field'}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$hour', function () {
      test('values and fields', function (done) {
        var doc = {field: new Date(Date.UTC(2015, 0, 2, 3, 4, 5,  6))};
        var dsl = {res: {$hour: '$field'}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$millisecond', function () {
      test('values and fields', function (done) {
        var doc = {field: new Date(Date.UTC(2015, 0, 2, 3, 4, 5,  6))};
        var dsl = {res: {$millisecond: '$field'}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$minute', function () {
      test('values and fields', function (done) {
        var doc = {field: new Date(Date.UTC(2015, 0, 2, 3, 4, 5,  6))};
        var dsl = {res: {$minute: '$field'}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$month', function () {
      test('values and fields', function (done) {
        var doc = {field: new Date(Date.UTC(2015, 0, 2, 3, 4, 5,  6))};
        var dsl = {res: {$month: '$field'}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$second', function () {
      test('values and fields', function (done) {
        var doc = {field: new Date(Date.UTC(2015, 0, 2, 3, 4, 5,  6))};
        var dsl = {res: {$second: '$field'}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$week', function () {
      test('values and fields', function (done) {
        var doc = {field: new Date(Date.UTC(2015, 0, 2, 3, 4, 5,  6))};
        var dsl = {res: {$week: '$field'}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$year', function () {
      test('values and fields', function (done) {
        var doc = {field: new Date(Date.UTC(2015, 0, 2, 3, 4, 5,  6))};
        var dsl = {res: {$year: '$field'}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$cond - first form', function () {
      test('values and fields - success', function (done) {
        var doc = {foo: 5};
        var dsl = {res: {$cond: ['$foo', 1, 2]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - failure', function (done) {
        var doc = {foo: 0};
        var dsl = {res: {$cond: ['$foo', 1, 2]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$cond - second form', function () {
      test('values and fields - success', function (done) {
        var doc = {foo: 5};
        var dsl = {res: {$cond: {if: '$foo', then: 1, else: 2}}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - failure', function (done) {
        var doc = {foo: 0};
        var dsl = {res: {$cond: {if: '$foo', then: 1, else: 2}}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

    suite('$ifNull', function () {
      test('values and fields - success', function (done) {
        var doc = {foo: 5};
        var dsl = {res: {$ifNull: ['$foo', 1]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })

      test('values and fields - failure', function (done) {
        var doc = {foo: null};
        var dsl = {res: {$ifNull: ['$foo', 1]}};
        var out = expr(dsl, doc);
        mongo.eval(dsl, doc, function (err, res) {
          if(err) throw err;
          assert.deepEqual(out, res);
          done();
        })
      })
    })

  })
})
