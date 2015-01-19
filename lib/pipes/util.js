exports.checkErrorForFieldName = function(fieldName) {
  if(exports.haveNestedFields(fieldName)) {
    return "does not supported nested fields with dot(.)";
  } else if(!exports.isBeginningWith$(fieldName)) {
    return "field must be stated with beginning $ operator";
  }
};

exports.haveNestedFields = function(fieldName) {
  return /\./.test(fieldName);
};

exports.isBeginningWith$ = function(fieldName) {
  return /^\$/.test(fieldName);
};
