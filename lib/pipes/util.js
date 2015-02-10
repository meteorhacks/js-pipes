exports.checkErrorForFieldName = function(fieldName) {
  if(!exports.isBeginningWith$(fieldName)) {
    return "field must be stated with beginning $ operator";
  }
};

exports.isBeginningWith$ = function(fieldName) {
  return /^\$/.test(fieldName);
};
