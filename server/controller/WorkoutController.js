var mongoose = require('mongoose')
var Exercise = mongoose.model('Exercise');
var Template = mongoose.model('Template');
var Session = mongoose.model('Session');
var User = mongoose.model('User');
var path = require('path');
let fs = require('fs');
//---------new--------------
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
var conn = mongoose.connection
Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);
ObjectId = require('mongodb').ObjectID;
//-------------------------------


module.exports = {

  add: function(req,res){

    var newExercise = new Exercise();
    newExercise.ImageStringId = req.body.image;
    newExercise.Title = req.body.title;
    newExercise.Description = req.body.description;
    newExercise.Metric = req.body.metric;
    newExercise.UsesBodyWeight = req.body.bodyWeightQuestion;
    newExercise._Templates = req.body.templates;
    newExercise._user = req.params.userId
    newExercise.save((err,exercise)=>{
        for(let i = 0; i < req.body.templates.length;i++){
          Template.findOne({_id:req.body.templates[i]},(err,template)=>{
            if(err){
              res.json(err)
            } else {

            template._Exercises.push(exercise._id)
            template.save()
          }
          })
        }

      User.findByIdAndUpdate(
        req.params.userId,
        {$push: {"_exercises":exercise._id}},
        {safe: true, upsert: true}
      )


        res.json(exercise);
      })
  },
  sessionAndExercise: function(req,res){
    var sessionCount = 0;
    var exerciseCount = 0;
    Template.findOne({Title: req.params.title},(err,template)=>{
      if(err){
        res.json(err)
      }else{
        Exercise.count({_Templates:template._id},function(err,count){
          if(err){
            res.json(err)
          }else{
            exerciseCount = count
            Session.count({_Templates:template._id},function(err,secondCount){
              if(err){
                res.json(err)
              }else{
                sessionCount = secondCount
                res.json({
                  sessionCount: sessionCount,
                  exerciseCount: exerciseCount
                })
              }
            })
          }
        })
      }
    })

  },
  removePhoto: function(req,res){
    gfs.collection('fs');
    gfs.files.findOne({_id:new ObjectId(req.params.photoId)},(err,photoFile)=>{

      gfs.remove(photoFile,function(err){
        if(err){
          res.json('error')
        } else {
          res.json('success')
        }
      })
    })

  },
  remove: function(req,res){
    //req.params.exerciseId req.param.userId
    Exercise.remove({_id:req.params.exerciseId},(err)=>{
      if(err){
        res.status(404).json(err);

      } else {
        Template.update({_id:req.params.exerciseId},{$pullAll: [{_Exercises: req.params.exerciseId}]},(err)=>{
          if(err){
            res.status(404).json(err);

          } else {
            Template.find({_user:req.params.userId}).populate('_Exercises').exec((err,templates)=>{
              if(err){
                res.status(404).json(err);

              } else{
                res.json('success')
              }
            })
          }
        })
      }
    })
  },
  update: function(req,res){
    Exercise.findOne({_id: req.body.exerciseId},(err,exercise)=>{
      if(err){
        res.json(err)
      }else{
        Template.find({_id:{$in:exercise._Templates}},(err,templates)=>{
          for(var i = 0; i < templates.length;i++){
            for(var m = 0; m < templates[i]._Exercises.length;m++){

              if(templates[i]._Exercises[m] == req.body.exerciseId){
                templates[i]._Exercises.splice(m,1)
              }
            }
            templates[i].save()
          }

        }).then(()=>{
          exercise.Title = req.body.title;
          exercise.Description = req.body.description;
          exercise.Metric = req.body.metric;
          exercise.UsesBodyWeight = req.body.bodyWeightQuestion;
          exercise._Templates = req.body.templates;
          exercise.ImageStringId = req.body.ImageStringId;
          exercise.save((err,updatedExercise)=>{
            for(let i = 0; i < req.body.templates.length;i++){
              Template.findOne({_id:req.body.templates[i]},(err,template)=>{
                if(err){
                  res.json(err)
                } else {

                template._Exercises.push(updatedExercise._id)
                template.save((err)=>{
                  if(err){
                  }
                })
              }
              })
            }
            //

            if(err){
              res.status(404).json(err);

            }else{
              res.json(updatedExercise)
            }
          })
        })
      }
    })
  },
  specifics: function(req,res){
    Exercise.findOne({Title:req.params.title, _user: req.params.userId}).populate("_Templates").exec((err,exercise)=>{
      if(err){
        res.status(404).json(err);

      } else {

        if(exercise.ImageStringId){
          gfs.collection('fs');
           gfs.files.find({_id:new ObjectId(exercise.ImageStringId)}).toArray(function(err,files){
             console.log(files)
            if(!files || files.length === 0){
              res.json({
                exerciseObject: exercise,
                exerciseImage: ''
              })
            } else {
              let data = [];
              let readstream = gfs.createReadStream({
                filename: files[0].filename
              })
              readstream.on('data',function(chunk){
                data.push(chunk)
              })
              readstream.on('end',function(){
                data = Buffer.concat(data);

                let img =Buffer(data).toString('base64');
                 res.json({
                   exerciseObject: exercise,
                   exerciseImage: img
                 })
              })
              readstream.on('error',function(err){
                throw err;
              })

            }
          })
        } else {
          res.json({
            exerciseObject: exercise,
            exerciseImage: ''
          })
        }
      }
    })
  },
  showAll: function(req,res){
    Exercise.find({_user: req.params.userId}).populate('_Templates').exec((err,exercises)=>{
      if(err){
        res.status(404).json(err);
      } else {
        res.json(exercises)
      }
    })
  },
  multipleAssociate: function(req,res){
    var arrayOfExerciseIds = req.body.arrayOfExerciseIds;
    var arrayOfTemplateIds = req.body.arrayOfTemplateIds;
    Exercise.update({_id: arrayOfExerciseIds},{_Templates: arrayOfTemplateIds},{multi:true},(err)=>{
      if(err){
        res.json(err)
      } else {
        Template.update({_id: arrayOfTemplateIds},{$pushAll: {_Exercises: arrayOfExerciseIds}},{multi:true},(err)=>{
          if(err){
            res.json(err)
          } else {
            Template.find({_user: req.params.userId}).populate('_Exercises').exec((err,templates)=>{
              if(err){
                res.json(err)
              } else{
                Exercise.find({_Templates:[],_user: req.params.userId},(err,exercises)=>{
                  if(err){
                    res.json(err)
                  } else {
                    res.json({templates: templates, exercisesWithoutTemplates: exercises})
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
