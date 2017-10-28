module.exports = {
  Add: function(startDate,endDate,templateId,frequency){

    var formErrors = {}
    var toDate = parseDate(startDate);
    var lastDate = parseDate(endDate);
        lastDate.setDate(lastDate.getDate() + 1);
    function parseDate(input) {
      var parts = input.split('-');
      // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])

      return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
    }
    if(startDate == '' ){
      formErrors.startDate = "Start Date cannot be blank"
    }
    if(endDate == ''){
      formErrors.endDate = "End Date cannot be blank"
    }
    if(toDate > lastDate && (!formErrors.endDate && !formErrors.startDate)){
      formErrors.startDate = "Start Date Cannot be after End Date"
      formErrors.endDate = "Start Date Cannot be after End Date"
    }
    if(templateId == ''){
      formErrors.templateId = "Template Must Be Selected"
    }
    if(frequency == ''){
      formErrors.frequency = "Frequency Must Be Selected"

    }
    return formErrors;
  },
  ConvertDateString: function(input){
        var parts = input.split('-');
        // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])

        return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
      }
}
