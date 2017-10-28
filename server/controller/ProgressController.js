var mongoose = require('mongoose');
var Session = mongoose.model('Session');
var User = mongoose.model('User');
var Template = mongoose.model('Template');

module.exports = {
  templateTitles: function(req,res){
    //we need to find the Template titles and match with session
    Template.find({_user: req.params.userId},(err,templates)=>{
      if(err){
        res.json(err)
      } else{
        res.json(templates)
      }
    })
  },
  templateData: function(req,res){
    //req.params.userId
    //req.params.singleTemplate
    Template.findOne({Title:req.params.singleTemplate,_user: req.params.userId})
    .populate('_Session')
    .populate('_Session._Template')
    .exec((err,templateWithSession)=>{
      if(err){
        res.json(err)
      } else{
        res.json(templateWithSession)
      }
    })

  }
}
