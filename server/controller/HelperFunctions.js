const nodemailer = require('nodemailer');

module.exports = {
  sendForgotPassword: function(email,token){

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: false,
      port: 25,
      auth: {
        user: "sweatingbeta@gmail.com",
        pass: "SweatingBeta89"
      },
      tls:{
        rejectUnauthorized: false
      }
    });
    let HelperOptions = {
      from: "'BetaSweat'<sweatingbeta@gmail.com>",
      to: email,
      subject: 'Password Retrieval',
      text: `click link to be create your new password, betasweat.com/createpassword/${token}`
    }

    transporter.sendMail(HelperOptions,(error,info)=>{
      if(error){
         return false
      } else {
        return true
      }
    });

  },
  sendToBetaSweat: function(name,email,comment){
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: false,
      port: 25,
      auth: {
        user: "sweatingbeta@gmail.com",
        pass:"SweatingBeta89"
      },
      tls:{
        rejectUnauthorized: false
      }
    });
    let HelperOptions = {
      from: `${email}`,
      to: 'sweatingbeta@gmail.com',
      subject: 'Comment On Website',
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${comment}`
    }

    transporter.sendMail(HelperOptions,(error,info)=>{
      if(error){
         return true
      } else {
        return false
      }
    });
  },
  sendSessionReminder: function(email,arrayOfTemplateTitles){

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: false,
      port: 25,
      auth: {
        user: "sweatingbeta@gmail.com",
        pass: "SweatingBeta89"
      },
      tls:{
        rejectUnauthorized: false
      }
    });
    let HelperOptions = {
      from: "'BetaSweat'<sweatingbeta@gmail.com>",
      to: email,
      subject: 'You Have a scheduled session today',
      text: `You have scheduled to be reminded of the following sessions for today: ${arrayOfTemplateTitles}
       click www.betasweat.com/sessions/add/ to be redirected to session`
    }

    transporter.sendMail(HelperOptions,(error,info)=>{
      if(error){
         return false
      } else {
        return true
      }
    });

  },
  sendAdminNotice: function(numberOfNewUsers,numberOfSessions){

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: false,
      port: 25,
      auth: {
        user: "sweatingbeta@gmail.com",
        pass: "SweatingBeta89"
      },
      tls:{
        rejectUnauthorized: false
      }
    });
    let HelperOptions = {
      from: "'BetaSweat'<sweatingbeta@gmail.com>",
      to: 'sweatingbeta@gmail.com',
      subject: 'The Weekly Numbers',
      text: `There have been ${numberOfNewUsers} new users since last week and there have been a total of ${numberOfSessions} sessions`
    }

    transporter.sendMail(HelperOptions,(error,info)=>{
      if(error){
         return false
      } else {
        return true
      }
    });

  }
}
