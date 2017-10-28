module.exports = {
  DateStringToCommas: function(date){
    var date = new Date(date)
    var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth()).toString();
      var dd  = date.getDate().toString();

      var mmChars = mm.split('');
      var ddChars = dd.split('');

      return yyyy + ',' + (mmChars[1]?mm:"0"+mmChars[0]) + ',' + (ddChars[1]?dd:"0"+ddChars[0]);
  }
}
