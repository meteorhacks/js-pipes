var expr = require('../../lib/pipes/expr')
var assert = require('assert');

suite('Expressions', function () {
  suite('expr', function () {
    test('pick static values', function () {
      var doc = {};
      var dsl = {num: 1, str: 's'};
      var out = expr(dsl, doc);
      assert.deepEqual(out, dsl);
    });

    test('pick document fields', function () {
      var doc = {a: 100, b: {c: 200}};
      var dsl = {d: '$a', e: '$b.c'};
      var out = expr(dsl, doc);
      assert.deepEqual(out, {d: 100, e: 200});
    });
  })


  suite('operations', function () {
    suite('$add', function () {
      test('values and fields', function () {
        var doc = {foo: 120};
        var dsl = {res: {$add: ['$foo', 2, 3]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 125});
      })
    })

    suite('$divide', function () {
      test('values and fields', function () {
        var doc = {foo: 120};
        var dsl = {res: {$divide: ['$foo', 3, 2]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 20});
      })
    })

    suite('$mod', function () {
      test('values and fields', function () {
        var doc = {foo: 120};
        var dsl = {res: {$mod: ['$foo', 25, 3]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 2});
      })
    })

    suite('$multiply', function () {
      test('values and fields', function () {
        var doc = {foo: 120};
        var dsl = {res: {$multiply: ['$foo', 2, 10]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 2400});
      })
    })

    suite('$subtract', function () {
      test('values and fields', function () {
        var doc = {foo: 120};
        var dsl = {res: {$subtract: ['$foo', 2, 3]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 115});
      })
    })

    suite('$and', function () {
      test('values and fields - success', function () {
        var doc = {foo: 120};
        var dsl = {res: {$and: ['$foo', 2, 3]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: true});
      })

      test('values and fields - failure', function () {
        var doc = {foo: 120};
        var dsl = {res: {$and: ['$foo', 0, 3]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: false});
      })
    })

    suite('$not', function () {
      test('values and fields - success', function () {
        var doc = {foo: 120};
        var dsl = {res: {$not: '$foo'}, res2: {$not: 120}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: false, res2: false});
      })

      test('values and fields - failure', function () {
        var doc = {foo: 0};
        var dsl = {res: {$not: '$foo'}, res2: {$not: 0}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: true, res2: true});
      })
    })

    suite('$or', function () {
      test('values and fields - success', function () {
        var doc = {foo: 120};
        var dsl = {res: {$or: ['$foo', 2, 0]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: true});
      })

      test('values and fields - failure', function () {
        var doc = {foo: 0};
        var dsl = {res: {$or: ['$foo', 0]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: false});
      })
    })

    suite('$allElementsTrue', function () {
      test('values and fields - success', function () {
        var doc = {foo: 120};
        var dsl = {res: {$allElementsTrue: ['$foo', 2, 3]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: true});
      })

      test('values and fields - failure', function () {
        var doc = {foo: 120};
        var dsl = {res: {$allElementsTrue: ['$foo', 0]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: false});
      })
    })

    suite('$anyElementTrue', function () {
      test('values and fields - success', function () {
        var doc = {foo: 120};
        var dsl = {res: {$anyElementTrue: ['$foo', 2, 0]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: true});
      })

      test('values and fields - failure', function () {
        var doc = {foo: 0};
        var dsl = {res: {$anyElementTrue: ['$foo', 0]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: false});
      })
    })

    suite('$setDifference', function () {
      test('values and fields', function () {
        var doc = {foo: [1, 2, 3]};
        var dsl = {res: {$setDifference: ['$foo', [2, 4]]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: [1, 3]});
      })
    })

    suite('$setEquals', function () {
      test('values and fields - success', function () {
        var doc = {foo: [1, 2]};
        var dsl = {res: {$setEquals: ['$foo', [1, 2, 2]]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: true});
      })

      test('values and fields - failure', function () {
        var doc = {foo: [1, 2]};
        var dsl = {res: {$setEquals: ['$foo', [1, 3]]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: false});
      })
    })

    suite('$setIntersection', function () {
      test('values and fields', function () {
        var doc = {foo: [1, 2, 3]};
        var dsl = {res: {$setIntersection: ['$foo', [2, 3]]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: [2, 3]});
      })
    })

    suite('$setIsSubset', function () {
      test('values and fields - success', function () {
        var doc = {foo: [1, 2, 3]};
        var dsl = {res: {$setIsSubset: ['$foo', [2, 3]]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: true});
      })

      test('values and fields - success', function () {
        var doc = {foo: [1, 2, 3]};
        var dsl = {res: {$setIsSubset: ['$foo', [2, 4]]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: false});
      })
    })

    suite('$setUnion', function () {
      test('values and fields', function () {
        var doc = {foo: [1, 2, 3]};
        var dsl = {res: {$setUnion: ['$foo', [2, 4]]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: [1, 2, 3, 4]});
      })
    })

    suite('$cmp', function () {
      test('values and fields - equal', function () {
        var doc = {foo: 5};
        var dsl = {res: {$cmp: ['$foo', 5]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 0});
      })

      test('values and fields - greater', function () {
        var doc = {foo: 5};
        var dsl = {res: {$cmp: ['$foo', 4]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 1});
      })

      test('values and fields - less', function () {
        var doc = {foo: 4};
        var dsl = {res: {$cmp: ['$foo', 5]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: -1});
      })
    })

    suite('$eq', function () {
      test('values and fields - success', function () {
        var doc = {foo: 5};
        var dsl = {res: {$eq: ['$foo', 5]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: true});
      })

      test('values and fields - failure', function () {
        var doc = {foo: 5};
        var dsl = {res: {$eq: ['$foo', 4]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: false});
      })
    })

    suite('$gt', function () {
      test('values and fields - success', function () {
        var doc = {foo: 5};
        var dsl = {res: {$gt: ['$foo', 4]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: true});
      })

      test('values and fields - failure', function () {
        var doc = {foo: 5};
        var dsl = {res: {$gt: ['$foo', 6]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: false});
      })
    })

    suite('$gte', function () {
      test('values and fields - success', function () {
        var doc = {foo: 5};
        var dsl = {res: {$gte: ['$foo', 5]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: true});
      })

      test('values and fields - failure', function () {
        var doc = {foo: 5};
        var dsl = {res: {$gte: ['$foo', 6]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: false});
      })
    })

    suite('$lt', function () {
      test('values and fields - success', function () {
        var doc = {foo: 5};
        var dsl = {res: {$lt: ['$foo', 6]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: true});
      })

      test('values and fields - failure', function () {
        var doc = {foo: 5};
        var dsl = {res: {$lt: ['$foo', 4]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: false});
      })
    })

    suite('$lte', function () {
      test('values and fields - success', function () {
        var doc = {foo: 5};
        var dsl = {res: {$lte: ['$foo', 5]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: true});
      })

      test('values and fields - failure', function () {
        var doc = {foo: 5};
        var dsl = {res: {$lte: ['$foo', 4]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: false});
      })
    })

    suite('$ne', function () {
      test('values and fields - success', function () {
        var doc = {foo: 5};
        var dsl = {res: {$ne: ['$foo', 6]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: true});
      })

      test('values and fields - failure', function () {
        var doc = {foo: 5};
        var dsl = {res: {$ne: ['$foo', 5]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: false});
      })
    })

    suite('$concat', function () {
      test('values and fields', function () {
        var doc = {foo: 'hello '};
        var dsl = {res: {$concat: ['$foo', 'world']}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 'hello world'});
      })
    })

    suite('$strcasecmp', function () {
      test('values and fields - equal', function () {
        var doc = {foo: 'b'};
        var dsl = {res: {$strcasecmp: ['$foo', 'b']}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 0});
      })

      test('values and fields - less', function () {
        var doc = {foo: 'a'};
        var dsl = {res: {$strcasecmp: ['$foo', 'b']}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: -1});
      })

      test('values and fields - greater', function () {
        var doc = {foo: 'c'};
        var dsl = {res: {$strcasecmp: ['$foo', 'b']}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 1});
      })
    })

    suite('$substr', function () {
      test('values and fields', function () {
        var doc = {foo: 'abcde'};
        var dsl = {res: {$substr: ['$foo', 1, 2]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 'bc'});
      })
    })

    suite('$toLower', function () {
      test('values and fields', function () {
        var doc = {foo: 'ABcd'};
        var dsl = {res: {$toLower: '$foo'}, res2: {$toLower: 'EFgh'}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 'abcd', res2: 'efgh'});
      })
    })

    suite('$toUpper', function () {
      test('values and fields', function () {
        var doc = {foo: 'ABcd'};
        var dsl = {res: {$toUpper: '$foo'}, res2: {$toUpper: 'EFgh'}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 'ABCD', res2: 'EFGH'});
      })
    })

    suite('$size', function () {
      test('values and fields', function () {
        var doc = {foo: [1, 2, 3]};
        var dsl = {res: {$size: '$foo'}, res2: {$size: [4, 5]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 3, res2: 2});
      })
    })

    suite('$let', function () {
      test('values and fields', function () {
        var doc = {global: 'g'};
        var dsl = {res: {$let: {
          vars: {redir: '$global', local: 'l'},
          in: {local: '$$local', global: '$global', redir: '$$redir'}
        }}};

        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: {local: 'l', global: 'g', redir: 'g'}});
      })
    })

    suite('$map', function () {
      test('values and fields', function () {
        var doc = {arr: [1, 2, 3]};
        var dsl = {res: {$map: {
          input: '$arr',
          as: 'item',
          in: '$$item'
        }}};

        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: [1, 2, 3]});
      })
    })

    suite('$literal', function () {
      test('values and fields', function () {
        var doc = {field: 'lol'};
        var dsl = {res: {$literal: '$field'}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: '$field'});
      })
    })

    suite('$dayOfMonth', function () {
      test('values and fields', function () {
        var doc = {field: new Date(2000, 2, 3, 4, 5, 6, 7)};
        var dsl = {res: {$dayOfMonth: '$field'}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 3});
      })
    })

    suite('$dayOfWeek', function () {
      test('values and fields', function () {
        var doc = {field: new Date(2000, 2, 3, 4, 5, 6, 7)};
        var dsl = {res: {$dayOfWeek: '$field'}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 5});
      })
    })

    suite('$dayOfYear', function () {
      test('values and fields', function () {
        var doc = {field: new Date(2000, 2, 3, 4, 5, 6, 7)};
        var dsl = {res: {$dayOfYear: '$field'}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 62});
      })
    })

    suite('$hour', function () {
      test('values and fields', function () {
        var doc = {field: new Date(2000, 2, 3, 4, 5, 6, 7)};
        var dsl = {res: {$hour: '$field'}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 4});
      })
    })

    suite('$millisecond', function () {
      test('values and fields', function () {
        var doc = {field: new Date(2000, 2, 3, 4, 5, 6, 7)};
        var dsl = {res: {$millisecond: '$field'}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 7});
      })
    })

    suite('$minute', function () {
      test('values and fields', function () {
        var doc = {field: new Date(2000, 2, 3, 4, 5, 6, 7)};
        var dsl = {res: {$minute: '$field'}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 5});
      })
    })

    suite('$month', function () {
      test('values and fields', function () {
        var doc = {field: new Date(2000, 2, 3, 4, 5, 6, 7)};
        var dsl = {res: {$month: '$field'}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 2});
      })
    })

    suite('$second', function () {
      test('values and fields', function () {
        var doc = {field: new Date(2000, 2, 3, 4, 5, 6, 7)};
        var dsl = {res: {$second: '$field'}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 6});
      })
    })

    suite('$week', function () {
      test('values and fields', function () {
        var doc = {field: new Date(2000, 2, 3, 4, 5, 6, 7)};
        var dsl = {res: {$week: '$field'}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 9});
      })
    })

    suite('$year', function () {
      test('values and fields', function () {
        var doc = {field: new Date(2000, 2, 3, 4, 5, 6, 7)};
        var dsl = {res: {$year: '$field'}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 2000});
      })
    })

    suite('$cond - first form', function () {
      test('values and fields - success', function () {
        var doc = {foo: 5};
        var dsl = {res: {$cond: ['$foo', 1, 2]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 1});
      })

      test('values and fields - failure', function () {
        var doc = {foo: 0};
        var dsl = {res: {$cond: ['$foo', 1, 2]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 2});
      })
    })

    suite('$cond - second form', function () {
      test('values and fields - success', function () {
        var doc = {foo: 5};
        var dsl = {res: {$cond: {if: '$foo', then: 1, else: 2}}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 1});
      })

      test('values and fields - failure', function () {
        var doc = {foo: 0};
        var dsl = {res: {$cond: {if: '$foo', then: 1, else: 2}}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 2});
      })
    })

    suite('$ifNull', function () {
      test('values and fields - success', function () {
        var doc = {foo: 5};
        var dsl = {res: {$ifNull: ['$foo', 1]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 5});
      })

      test('values and fields - failure', function () {
        var doc = {foo: null};
        var dsl = {res: {$ifNull: ['$foo', 1]}};
        var out = expr(dsl, doc);
        assert.deepEqual(out, {res: 1});
      })
    })

  })
})
