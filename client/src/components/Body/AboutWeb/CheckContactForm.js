
var Checker = function(state){
  var emailTest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var nameTest = /^([a-zA-Z]+(_[a-zA-Z]+)*)(\s([a-zA-Z]+(_[a-zA-Z]+)*))*$/;
  var fieldValidationErrors = {};
  if(!state.name){
    fieldValidationErrors.name = "Name cannot be empty"
  }
  if(!nameTest.test(state.name) && !fieldValidationErrors.name){
    fieldValidationErrors.name = "Name is must be letters only"
  }
  if(!state.email){
    fieldValidationErrors.email = "Email cannot be empty"
  }
  if(!emailTest.test(state.email) && !fieldValidationErrors.email){
    fieldValidationErrors.email = "Email must be valid"
  }
  if(!state.comment){
    fieldValidationErrors.comment = "comment is empty"
  }
  if(!fieldValidationErrors.comment && state.comment.length < 5){
    fieldValidationErrors.comment = "Comment must have at least 5 letters"
  }
  return fieldValidationErrors
}


 export default Checker
