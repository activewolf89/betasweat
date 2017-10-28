var mongoose = require('mongoose');
var Reoccurance = mongoose.model('Reoccurance');
var User = mongoose.model('User')
var HelperFunctions = require('./../controller/HelperFunctions.js');

  var checkNotifications = function(){
    User.find({}).populate({path:'_reoccurance',populate:{path:'_template',model:'Template'}}).exec((err,users)=>{
      users.forEach((user)=>{
        var templateArray = [];
        user._reoccurance.forEach((reoccurances)=>{
          var startDate = new Date(reoccurances.StartDate);
          var checkDay = startDate;
          var endDate = new Date(reoccurances.EndDate);
          var today = new Date()
            if(startDate <= today && today <= endDate && reoccurances.EmailNotification){
              while(endDate >= checkDay){
                if(today.toDateString() === checkDay.toDateString()){
                  templateArray.push(reoccurances._template.Title)
                }
                checkDay = new Date(checkDay.setDate(checkDay.getDate()+reoccurances.Frequency))
              }
            }

        })
        if(templateArray.length > 0){
          HelperFunctions.sendSessionReminder(user.email, templateArray)
        }
      })
    })
  };

  module.exports = checkNotifications
