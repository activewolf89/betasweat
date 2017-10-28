module.exports = {
  createAccount: function(name,email,password,confirmPassword,bodyWeight){
    var numberTest = /^\d+$/;
    var emailTest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var nameTest = /^([a-zA-Z]+(_[a-zA-Z]+)*)(\s([a-zA-Z]+(_[a-zA-Z]+)*))*$/;
    var fieldValidationErrors = {};
    if(!name){
      fieldValidationErrors.name = "Name cannot be empty"
    }
    if(!nameTest.test(name) && !fieldValidationErrors.name){
      fieldValidationErrors.name = "Name is must be letters only"
    }
    if(!email){
      fieldValidationErrors.email = "Email cannot be empty"
    }
    if(!emailTest.test(email) && !fieldValidationErrors.email){
      fieldValidationErrors.email = "Email must be valid"
    }
    if(!bodyWeight){
      fieldValidationErrors.bodyWeight = "Enter Current Body Weight"
    }
    if(!fieldValidationErrors.bodyWeight && !numberTest.test(bodyWeight)){
      fieldValidationErrors.bodyWeight = "Enter digits only for Body Weight"

    }
    if((Number(bodyWeight) < 50 || Number(bodyWeight) > 500) && !fieldValidationErrors.bodyWeight){
      fieldValidationErrors.bodyWeight = "BodyWeight cannot be greater than 500 or less than 50"
    }
    if(!password){
      fieldValidationErrors.password = "Password cannot be empty"
    }
    if(password.length < 6 && !fieldValidationErrors.password){
      fieldValidationErrors.password = "Password must be at least 6 characters"
    }
    if(password !==confirmPassword){
      fieldValidationErrors.confirmPassword = "Passwords must match"
    }
    return fieldValidationErrors;
  },
  login: function(email,password){
    var emailTest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var fieldValidationErrors = {};
    if(!email){
      fieldValidationErrors.email = "Email cannot be empty"
    }
    if(!emailTest.test(email) && !fieldValidationErrors.email){
      fieldValidationErrors.email = "Email must be valid"
    }
    if(!password){
      fieldValidationErrors.password = "Password cannot be empty"
    }
    if(password.length < 6 && !fieldValidationErrors.password){
      fieldValidationErrors.password = "Password must be at least 6 characters"
    }
    return fieldValidationErrors;
  },
  updatePassword: function(password, passwordMatch){
    var fieldValidationErrors = {};
    if(!password){
      fieldValidationErrors.password = "Password cannot be empty"
    }
    if(password.length < 6 && !fieldValidationErrors.password){
      fieldValidationErrors.password = "Password must be at least 6 characters"
    }
    if(password !==passwordMatch){
      fieldValidationErrors.passwordMatch = "Passwords must match"
    }
    return fieldValidationErrors;
  }
}
