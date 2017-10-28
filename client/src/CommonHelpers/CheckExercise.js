module.exports = {
  checkAddExercise: function(title,description, arrayOfTitles,arrayOfTemplates){
    var formErrors = {}
    if(arrayOfTemplates.length < 1){
        formErrors.associateTemplate =  "Each Exercise Must Be Associated With At Least One Template"
    }
    if(!description){
      formErrors.description = "Description is Required"
    }
    if(!title){

      formErrors.title = "Title is Required"
    }
    for(let i = 0; i < arrayOfTitles.length;i++){
      if(arrayOfTitles[i] === title){
        formErrors.title = "Title Already Exists"
      }
    }
    return formErrors
  },
  checkUpdateExercise: function(title, originalTitle, description, arrayOfTitles, arrayOfTemplates){
    var formErrors = {}
    if(arrayOfTemplates.length < 1){
        formErrors.associateTemplate =  "Each Exercise Must Be Associated With At Least One Template"
    }
    if(!description){
      formErrors.description = "Description is Required"
    }

    if(!title){
      formErrors.title = "Title is Required"

    }
    for(let i = 0; i < arrayOfTitles.length;i++){
      if(arrayOfTitles[i] === title && title !== originalTitle){
        formErrors.title = "Title Already Exists"
      }
    }
    return formErrors

  }
}
