var axios = require('axios');

module.exports = {
  updateProfileName: function(name,userId){
    var fieldValidationErrors = {}
    var nameTest = /^([a-zA-Z]+(_[a-zA-Z]+)*)(\s([a-zA-Z]+(_[a-zA-Z]+)*))*$/;
    if(!name){
      fieldValidationErrors.name = "Name cannot be empty"
    }
    if(!nameTest.test(name) && !fieldValidationErrors.name){
      fieldValidationErrors.name = "Name is must be letters only"
    }
    if(Object.keys(fieldValidationErrors).length ===0 ){
      axios({
        method: 'post',
        url: '/update/name/'+ userId,
        data: {
          name: name
        }
      })

    }
    return fieldValidationErrors

  },
  updateProfileBodyWeight: function(bodyWeight,userId){
    var fieldValidationErrors = {}
    var numberTest = /^\d+$/;
    if(!bodyWeight){
      fieldValidationErrors.bodyWeight = "Enter Current Body Weight"
    }
    if(!fieldValidationErrors.bodyWeight && !numberTest.test(bodyWeight)){
      fieldValidationErrors.bodyWeight = "Enter digits only for Body Weight"
    }
    if((Number(bodyWeight) < 50 || Number(bodyWeight) > 500) && !fieldValidationErrors.bodyWeight){
      fieldValidationErrors.bodyWeight = "BodyWeight cannot be greater than 500 or less than 50"
    }
    if(Object.keys(fieldValidationErrors).length ===0 ){
      axios({
        method: 'post',
        url: '/update/bodyWeight/'+ userId,
        data: {
          bodyWeight: bodyWeight
        }
      }).then((res)=>{
        console.log(res)
      })

    }
    return fieldValidationErrors

  },
  updateProfileEmail:  function(email,userId,cb,cb2){
    var fieldValidationErrors = {}
    var emailTest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!email){
      fieldValidationErrors.email = "Email cannot be empty"
    }
    if(!emailTest.test(email) && !fieldValidationErrors.email){
      fieldValidationErrors.email = "Email must be valid"
    }
    if(Object.keys(fieldValidationErrors).length === 0){

      axios.get('/check/useremail/'+email).then((res)=>{
        if(res.data){
          fieldValidationErrors.email ="Email already exists"
          cb(fieldValidationErrors)
        } else {
          axios({
            method: 'post',
            data: {email: email},
            url: '/update/useremail/'+userId
          }).then((res)=>{
            cb2('success')
          })
        }
      })
      return fieldValidationErrors
    } else {
      return fieldValidationErrors
    }

  },
  updateProfilePassword: function(password,passwordMatch,userId){
    var fieldValidationErrors = {}

    if(!password){
      fieldValidationErrors.password = "Password cannot be empty"
    }
    if(password.length < 6 && !fieldValidationErrors.password){
      fieldValidationErrors.password = "Password must be at least 6 characters"
    }
    if(password !==passwordMatch){
      fieldValidationErrors.passwordMatch = "Passwords must match"
    }
    if(Object.keys(fieldValidationErrors).length ===0 ){
      axios({
        method: 'post',
        url: '/user/updatePassword',
        data: {
          userId: userId,
          password: password
        }
      })

    }
    return fieldValidationErrors

  }
}
