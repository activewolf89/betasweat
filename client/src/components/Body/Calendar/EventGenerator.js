var DateFormatters = require('./../../../CommonHelpers/DateFormatter.js') ;

module.exports = {
  Generate: function(inputArray,inputOfSessions){
    var arrayOfEvents = [];
    var arrayOfIds = [];
    inputArray.forEach((reminder)=>{
      arrayOfIds.push(reminder._template._id)
      var startingPoint = reminder.StartDate;
      var endingPoint = reminder.EndDate;
      var startingPointDate =new Date(startingPoint)
      var endingPointDate =new Date(endingPoint)

      while(endingPointDate - startingPointDate >=0){
        var reminderObject = {title:'',allDay:true,start:'',end:'',id:'',templateObject:{}};
        reminderObject.templateObject = reminder._template;
        reminderObject.id = reminder._id;
        reminderObject.title =reminder._template.Title;
        reminderObject.start = startingPointDate.getTime()
        reminderObject.end = startingPointDate.getTime()


        arrayOfEvents.push(reminderObject)
        startingPointDate =  new Date(startingPointDate.setTime(startingPointDate.getTime()+(reminder.Frequency )* 86400000))
      }
    })
    inputOfSessions.forEach((session)=>{
      if(arrayOfIds.some((id)=>{return id === session._Template._id})){
        var secondReminderObject = {title:'',allDay:true,start:'',end:'',sessionId:''}
        secondReminderObject.title = "SESSION " + session._Template.Title
        secondReminderObject.session= session;
        secondReminderObject.start =session.updatedAt
        secondReminderObject.end =session.updatedAt
        arrayOfEvents.push(secondReminderObject)
      }
    })
    return (
      arrayOfEvents
    )
  }
}
