module.exports = {
  CriteriaSubmit: function(template,arrayOfTemplates){


    var formErrors = {};
    for(var i = 0; i < arrayOfTemplates.length;i++){
      if(arrayOfTemplates[i].Title === template){
        if(arrayOfTemplates[i]._Exercises.length < 1){
          formErrors.exercises = "Add at least one exercise before starting a session"
        }
      }
    }
    if(template === ""){
      formErrors.template = "Add a template and exercise before starting a session"
    }
    return formErrors;
  },
  CheckIfSessions: function(template,arrayOfTemplates){
    for(var i = 0; i < arrayOfTemplates.length;i++){
      if(arrayOfTemplates[i].Title === template){
        if(arrayOfTemplates[i]._Session.length < 1){
          return false
        } else {
          return arrayOfTemplates[i]._Session[arrayOfTemplates[i]._Session.length -1]
        }
      }
    }
  }
}
