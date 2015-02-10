var _ = require('lodash');

function expr (dsl, doc) {
  var result = {};
  for(var field in dsl) {
    result[field] = expr.evalString(dsl[field], doc, field);
  }

  return result;
}


expr.evalString = function (dsl, doc, field) {
  // just a number or an array
  if(field && dsl === 1 || dsl === true) {
    return expr.val('$'+field, doc);
  }

  // just a number or an array
  if(typeof dsl === 'number' || Array.isArray(dsl)) {
    return dsl;
  }

  // just a simple string
  if(typeof dsl === 'string' && dsl[0] !== '$') {
    return dsl;
  }

  // get value from a document field
  if(typeof dsl === 'string' && dsl[0] === '$') {
    return expr.val(dsl, doc);
  }

  //
  if(typeof dsl === 'object') {
    var operation = Object.keys(dsl)[0];
    var operands = dsl[operation];
    var opFunction = expr.ops[operation];

    if(!opFunction) {
      return null;
    }

    return opFunction(operands, doc);
  }
};


expr.evalArray = function (dsls, doc) {
  return dsls.map(function (dsl) {
    return expr.evalString(dsl, doc);
  });
};


// dsl: '$path.to.property'
// doc: mongo document
expr.val = function (dsl, doc) {
  var field = dsl.substr(1);
  var parts = field.split('.');
  var value = doc;

  for(var i=0; i<parts.length; ++i) {
    var part = parts[i];

    if(typeof value !== 'object' || value === null) {
      return null;
    } else if(value[part] === undefined) {
      return null;
    }

    value = value[part];
  }

  return value;
};


expr.ops = {};

expr.ops.$add = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return values.reduce(function (prev, curr) {

    if(prev === undefined) {
      return curr;
    }

    return prev + curr;
  });
};

expr.ops.$divide = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return values.reduce(function (prev, curr) {

    if(prev === undefined) {
      return curr;
    }

    return prev / curr;
  });
};

expr.ops.$mod = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return values.reduce(function (prev, curr) {

    if(prev === undefined) {
      return curr;
    }

    return prev % curr;
  });
};

expr.ops.$multiply = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return values.reduce(function (prev, curr) {

    if(prev === undefined) {
      return curr;
    }

    return prev * curr;
  });
};

expr.ops.$subtract = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return values.reduce(function (prev, curr) {

    if(prev === undefined) {
      return curr;
    }

    return prev - curr;
  });
};

expr.ops.$and = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return !!values.reduce(function (prev, curr) {

    if(prev === undefined) {
      return curr;
    }

    return prev && curr;
  });
};

expr.ops.$not = function (operand, doc) {
  var value = expr.evalString(operand, doc);
  return !value;
};

expr.ops.$or = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return !!values.reduce(function (prev, curr) {

    if(prev === undefined) {
      return curr;
    }

    return prev || curr;
  });
};

expr.ops.$allElementsTrue = function (operand, doc) {
  var value = expr.evalString(operand, doc);
  return _.every(value);
};

expr.ops.$anyElementTrue = function (operand, doc) {
  var value = expr.evalString(operand, doc);
  return _.some(value);
};

expr.ops.$setDifference = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return _.difference.apply(_, values);
};

expr.ops.$setEquals = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  var common = _.union.apply(_, values);
  return _.isEqual(common, _.uniq(values[0]));
};

expr.ops.$setIntersection = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return _.intersection.apply(_, values);
};

expr.ops.$setIsSubset = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  var common = _.intersection.apply(_, values);
  return _.isEqual(common, _.uniq(values[0]));
};

expr.ops.$setUnion = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return _.union.apply(_, values);
};

expr.ops.$cmp = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  if(values[0] === values[1]) {
    return 0;
  } else if(values[0] > values[1]) {
    return 1;
  } else if(values[0] < values[1]) {
    return -1;
  }
};

expr.ops.$eq = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return values[0] === values[1];
};

expr.ops.$gt = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return values[0] > values[1];
};

expr.ops.$gte = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return values[0] >= values[1];
};

expr.ops.$lt = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return values[0] < values[1];
};

expr.ops.$lte = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return values[0] <= values[1];
};

expr.ops.$ne = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return values[0] !== values[1];
};

expr.ops.$concat = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return values.join('');
};

expr.ops.$strcasecmp = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return values[0].toUpperCase().localeCompare(values[1].toUpperCase());
};

expr.ops.$substr = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return values[0].substr(values[1], values[2]);
};

expr.ops.$toLower = function (operand, doc) {
  var value = expr.evalString(operand, doc);
  return value.toLowerCase();
};

expr.ops.$toUpper = function (operand, doc) {
  var value = expr.evalString(operand, doc);
  return value.toUpperCase();
};

expr.ops.$size = function (operand, doc) {
  var value = expr.evalString(operand, doc);
  return value.length;
};

expr.ops.$let = function (operand, doc) {
  var scope = _.cloneDeep(doc);

  for(var field in operand.vars) {
    scope['$'+field] = expr.evalString(operand.vars[field], scope);
  }

  return expr(operand.in, scope);
};

expr.ops.$map = function (operand, doc) {
  var array = expr.evalString(operand.input, doc);
  return array.map(function (item) {
    var scope = _.cloneDeep(doc);
    scope['$'+operand.as] = item;
    return expr.evalString(operand.in, scope);
  });
};

expr.ops.$literal = function (operand) {
  return operand;
};

expr.ops.$dayOfMonth = function (operand, doc) {
  var value = expr.evalString(operand, doc);
  return value.getUTCDate();
};

expr.ops.$dayOfWeek = function (operand, doc) {
  var value = expr.evalString(operand, doc);
  return value.getUTCDay() + 1;
};

expr.ops.$dayOfYear = function (operand, doc) {
  var value = expr.evalString(operand, doc);
  var start = new Date(value.getUTCFullYear(), 0, 1).getTime();
  var days = (value.getTime() - start)/(1000*60*60*24);
  return Math.floor(days) + 1;
};

expr.ops.$hour = function (operand, doc) {
  var value = expr.evalString(operand, doc);
  return value.getUTCHours();
};

expr.ops.$millisecond = function (operand, doc) {
  var value = expr.evalString(operand, doc);
  return value.getUTCMilliseconds();
};

expr.ops.$minute = function (operand, doc) {
  var value = expr.evalString(operand, doc);
  return value.getUTCMinutes();
};

expr.ops.$month = function (operand, doc) {
  var value = expr.evalString(operand, doc);
  return value.getUTCMonth() + 1;
};

expr.ops.$second = function (operand, doc) {
  var value = expr.evalString(operand, doc);
  return value.getUTCSeconds();
};

expr.ops.$week = function (operand, doc) {
  var value = expr.evalString(operand, doc);
  var start = new Date(value.getUTCFullYear(), 0, 1 - value.getUTCDay());
  var weeks = Math.floor((value - start)/(1000*60*60*24*7));
  return weeks;
};

expr.ops.$year = function (operand, doc) {
  var value = expr.evalString(operand, doc);
  return value.getUTCFullYear();
};

expr.ops.$cond = function (operands, doc) {
  if(!Array.isArray(operands)) {
    operands = [operands.if, operands.then, operands.else];
  }

  var values = expr.evalArray(operands, doc);
  return values[0] ? values[1] : values[2];
};

expr.ops.$ifNull = function (operands, doc) {
  var values = expr.evalArray(operands, doc);
  return values[0] === null ? values[1] : values[0];
};


module.exports = expr;
