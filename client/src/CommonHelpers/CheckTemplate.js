module.exports = {
checkUpdateTemplate: function(originalTitle,Title,Description,arrayOfObjects){
  var fieldValidationErrors = {};
  if(!Title){
    fieldValidationErrors.title = "Title Must Have A Value"
  }
  if(!fieldValidationErrors.title){
    for(var i = 0; i < arrayOfObjects.length;i++){
      if(arrayOfObjects[i].Title === Title && originalTitle !== Title){
        fieldValidationErrors.title="Template With that Title already exists"
      }
    }
  }
  if(!Description){
    fieldValidationErrors.description = "Description Must Have A Value"
  }

  return fieldValidationErrors;
},
checkAddTemplate: function(Title,Description,Category, arrayOfTemplateObjects){
  var fieldValidationErrors = {};
  if(!Title){
    fieldValidationErrors.title = "Title Must Have A Value"
  }

  if(!fieldValidationErrors.title){
    for(var i = 0; i < arrayOfTemplateObjects.length;i++){
      if(arrayOfTemplateObjects[i].Title === Title.toUpperCase()){
        fieldValidationErrors.title="Template With that Title already exists"
      }
    }
  }
  if(!Description){
    fieldValidationErrors.description = "Description Must Have A Value"
  }
  if(Category === '--select--'){
    fieldValidationErrors.category = "Select A Category"
  }


  return fieldValidationErrors;
}
}
