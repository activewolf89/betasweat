var mongoose = require('mongoose');
var Session = mongoose.model('Session');
var User = mongoose.model('User');
var Template = mongoose.model('Template');
var Reoccurance = mongoose.model('Reoccurance');
var CheckAdd = require('./../../client/src/CommonHelpers/CheckReoccurance.js')

module.exports = {
add: function(req,res){
  var checkResults = CheckAdd.Add(req.body.startDate,req.body.endDate,req.body.templateId,req.body.frequency)
  if(Object.keys(checkResults).length === 0){
    Reoccurance.create({
      Frequency: Number(req.body.frequency),
      StartDate: CheckAdd.ConvertDateString(req.body.startDate),
      EndDate: CheckAdd.ConvertDateString(req.body.endDate),
      _template: req.body.templateId,
      _user: req.body.userId,
      EmailNotification: req.body.emailNotification

    },(err,reoccurance)=>{
      if(err){
        res.status(404).json(err)
      } else {
        Template.findByIdAndUpdate(
          req.body.templateId,
          {$push: {"_reoccurance":reoccurance._id}},
          {safe: true, upsert: true},
          (err)=>{
            if(err){
              res.status(404).json(err);

            } else {
              User.findByIdAndUpdate(
                req.body.userId,
                {$push: {"_reoccurance":reoccurance._id}},
                {safe: true, upsert: true},
                (err)=>{
                  if(err){
                    res.status(404).json(err);

                  } else {
                    res.json(reoccurance)
                  }
                }
              )
            }
          }
        )
      }
    })
  } else {
    res.status(404).json(err)
  }

},
edit: function(req,res){
  Reoccurance.findOne({_id:req.body.reoccuranceId},(err,reoccurance)=>{
    if(err){
      res.status(404).json(err)
    } else {
      if(reoccurance._template !== req.body.templateId){
        Template.findByIdAndUpdate(
          reoccurance._template,
          {$pull:{"_reoccurance":reoccurance._template}},
          (err)=>{
            if(err){
              res.status(404).json(err);
            }
          }
        )
      }
    }
  })
  Reoccurance.update({_id:req.body.reoccuranceId},{
    Frequency: Number(req.body.frequency),
    StartDate: CheckAdd.ConvertDateString(req.body.startDate),
    EndDate: CheckAdd.ConvertDateString(req.body.endDate),
    EmailNotification: req.body.emailNotification,
    _template: req.body.templateId,
  },(err,reoccurance)=>{
    if(err){
      res.status(404).json(err)
    } else {
      res.json(reoccurance)
    }
  })
},
remove: function(req,res){
  Reoccurance.remove({_id:req.params.reoccuranceId},(err)=>{
    if(err){
      res.status(404).json(err);
    } else {
      User.update({_id:req.params.userId},{$pull:{"_reoccurance":req.params.reoccuranceId}},(err)=>{
        if(err){
          res.status(404).json(err)
        } else {
          Template.update({_id:req.params.templateId},{$pull:{"_reoccurance":req.params.reoccuranceId}},(err)=>{
            if(err){
              res.status(404).json(err)
            } else {
              res.json('removed')
            }
        })
    }
  })
    }
})
},
showAll: function(req,res){
  Reoccurance.find({_user: req.params.userId}).populate({path:'_template',populate:{path:'_Session',model:'Session'}}).exec((err,reoccurances)=>{
    if(err){
      res.status(404).json(err);
    } else {
      res.json(reoccurances)
    }
  })
}
}
