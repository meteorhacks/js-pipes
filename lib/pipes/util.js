exports.checkErrorForFieldName = function(fieldName) {
  if(/\./.test(fieldName)) {
    return "does not supported nested fields with dot(.)";
  } else if(!/^\$/.test(fieldName)) {
    return "field must be stated with beginning $ operator";
  }
};
