var mongoose = require('mongoose')
var Session = mongoose.model('Session');
var User = mongoose.model('User');
var Template = mongoose.model('Template');
var Exercise = mongoose.model('Exercise');
module.exports = {
  getSession: function(req,res){
    Template.findOne({Title:req.params.title,_user: req.params.userId},(err,template)=>{
      if(err){
        res.status(404).json(err)

      } else{
        Session.findOne({_Template:template._id}).sort({'createdAt':-1}).populate('_Template').exec((err,session)=>{
          if(err){
            res.status(404).json(err)

          } else {
            res.json({session:session,template:template})
          }
        })
      }
    })
  },
  removeSession: function(req,res){
    Session.remove({_id:req.params.sessionId},(err)=>{
      if(err){
        res.status(404).json(err);

      } else {
        res.json('deleted')
      }
    })
  },
  showAll: function(req,res){
    //req.params.userId
    Session.find({_user:req.params.userId},{},{sort:{'createdAt':-1}}).populate('_Template').exec((err,sessions)=>{
        if(err){
          console.log(err)
          res.status(404).json(err);
        } else {
          res.json(sessions)
        }
    })

  },
  editSession: function(req,res){
    // req.params.userId
    Template.findOne({Title:req.body.title,_user: req.params.userId},(err,template)=>{
      if(err){
        res.status(404).json(err)
      } else {
        Session.findByIdAndUpdate(
          req.body.sessionId,
          {
            BenchMark: req.body.benchMark,
            EstimatedTime: req.body.estimatedTime,
            ArrayOfExercises: req.body.sessionArray,
            CurrentWeight: req.body.currentWeight,
            Strength: req.body.strength,
            _Template: template._id,
            keyMetricWeight: req.body.keyMetricWeight,
            keyMetricReps: req.body.keyMetricReps
                  },
          {safe: true, upsert: true},
          (err)=>{
            if(err){
              res.status(404).json(err);

            } else {
              res.json('ok')
            }
          }
        )
      }
    })

  },
  getExercises: function(req,res){
    //req.params.title
    Template.findOne({Title: req.params.title, _user:req.params.userId}).populate('_Exercises').exec((err,template)=>{
      if(err){
        res.status(404).json(err)

      } else {

        res.json(template)
      }
    })

  },
  addSession: function(req,res){
    // strength:runningStrengthTotal,
    // strength_To_Weight:
    Template.findOne({Title:req.body.title,_user: req.params.userId},(err,template)=>{
      if(err){
        res.json(err)
      } else{
        Session.create({
          BenchMark: req.body.benchMark,
          EstimatedTime: req.body.estimatedTime,
          ArrayOfExercises: req.body.sessionArray,
          CurrentWeight: req.body.currentWeight,
          Strength: req.body.strength,
          _Template: template._id,
          keyMetricWeight: req.body.keyMetricWeight,
          keyMetricReps: req.body.keyMetricReps,
          _user: req.params.userId
        },(err,session)=>{
          if(err){
            res.status(404).json(err)
          } else{
            template._Session.push(session._id);
            template.save((err,template)=>{
              if(err){
                res.status(404).json(err)
              } else{
                User.findByIdAndUpdate(
                  req.params.userId,
                  {$push: {"_sessions":session._id}},
                  {safe: true, upsert: true},
                  (err)=>{
                    if(err){
                      res.status(404).json(err);

                    } else {
                      Session.findOne({_Template:template._id}).sort('-createdAt').limit(1).populate('_Template').exec((err,sessions)=>{
                        if(err){
                          res.status(404).json(err)
                        } else {
                          res.json(sessions)
                        }
                      })
                    }
                  }
                )
              }
            })
          }
        })
      }
    })
  },
}
