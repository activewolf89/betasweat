var mongoose = require('mongoose')
var Template = mongoose.model('Template');
var Session = mongoose.model('Session');
var Exercise = mongoose.model('Exercise');
var User = mongoose.model('User');
var Reoccurance = mongoose.model('Reoccurance')
var TemplateFieldValidations = require('./../../client/src/CommonHelpers/CheckTemplate.js')

module.exports = {
add: (req,res)=>{
  var inputErrorObjects = TemplateFieldValidations.checkAddTemplate(req.body.title.toUpperCase(), req.body.description, req.body.category, req.body.arrayOfTemplateObjects)
  if(Object.keys(inputErrorObjects).length === 0){
    Template.create({Title:req.body.title,Category: req.body.category, Description:req.body.description,_user: req.body.userId},(err,template)=>{
      if(err){
        res.status(404).json(err);
      } else {
        User.findByIdAndUpdate(
          req.body.userId,
          {$push: {"_templates":template._id}},
          {safe: true, upsert: true},
          (err)=>{
            if(err){
              res.status(404).json(err);

            } else {
              Template.find({_user:req.body.userId},(err,templates)=>{
                if(err){
                  res.status(404).json(err);
                }else{
                  res.json(templates);
                }
              })
            }
          }
        )
      }
    })
  }else {
  res.status(404).json(inputErrorObjects)
}
},
update:(req,res)=>{
      Template.findByIdAndUpdate(
        req.body.templateId,
        {Title: req.body.title.toUpperCase(), Category: req.body.category,  Description: req.body.description },
        (err)=>{
          if(err){
            res.status(404).json(err);

          } else {
            Template.find({_user:req.body.userId},(err,templates)=>{
              if(err){
                res.status(404).json(err);
              }else{
                res.json(templates);
              }
            })

          }
        }
      )

  },
showAll: (req,res)=>{
  Template.find({_user: req.params.userId}).populate('_Session').populate('_Exercises').exec((err,templates)=>{
    if(err){
      res.status(404).json(err);

    } else{
      res.json(templates)
    }
  })
},
showAllWithExercises: (req,res)=>{
  Template.find({_user: req.params.userId}).populate('_Exercises').exec((err,templates)=>{
    if(err){
      res.status(404).json(err);

    } else{
      Exercise.find({_user: req.params.userId,_Templates:[]},(err,exercises)=>{
        if(err){
          res.json(err)
        } else {
          res.json({templates: templates, exercisesWithoutTemplates: exercises})
        }
      })
    }
  })
},

remove: (req,res)=>{
  Template.remove({_id:req.params.templateId},(err)=>{
    if(err){
      res.status(404).json(err);
    } else{
      Session.find({_Template:req.params.templateId},(err,sessions)=>{

        if(err){
          res.status(404).json(err);
        } else {
          var listOfIds = []
          for(var i = 0; i < sessions.length;i++){
            listOfIds.push(sessions[i]._id)
          }
          User.findByIdAndUpdate(
            req.params.userId,
            {$pullAll: {"_sessions":listOfIds}},
            (err)=>{
              if(err){
                res.status(404).json(err);
              } else {
                Session.remove({_Template: req.params.templateId},(err)=>{
                  if(err){
                    res.status(404).json(err);

                  } else {
                    Exercise.update({_Templates: req.params.templateId},{"$pull":{"_Templates":req.params.templateId}},{multi: true},(err)=>{
                      if(err){
                        res.status(404).json(err);

                      } else {
                        Reoccurance.remove({_template:req.params.templateId},(err)=>{
                          if(err){
                            res.status(404).json(err);

                          } else {
                            Template.find({_user: req.params.userId}).populate('_Exercises').exec((err,templates)=>{
                              if(err){
                                res.status(404).json(err);

                              } else{

                                res.json(templates)
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            }
          )
        }
      })
    }
  })
},

}
