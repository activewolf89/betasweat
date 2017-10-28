var mongoose = require('mongoose');
var Reoccurance = mongoose.model('Reoccurance');
var User = mongoose.model('User')
var Session = mongoose.model('Session')
var HelperFunctions = require('./../controller/HelperFunctions.js');

  var NotifyAdmin = function(){
    var numberOfNewUsers,numberOfSessions = 0;
    var d = new Date();
    d.setDate(d.getDate()-7);
    User.find({createdAt:{$gte:d}},(err,users)=>{
      if(users){
        numberOfNewUsers = users.length;
        Session.find({},(err,sessions)=>{
          if(sessions){
            numberOfSessions = sessions.length;
            HelperFunctions.sendAdminNotice(numberOfNewUsers,numberOfSessions)
          }
        })
      }
    })
  };

  module.exports = NotifyAdmin
