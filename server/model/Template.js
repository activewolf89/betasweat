var mongoose = require('mongoose');
Schema = mongoose.Schema;
var TemplateSchema= new mongoose.Schema({
  Title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [2, "Type has to be more than the min of 2 length"],
      maxlength:[20, "Type has to be less than a max length of 20"],
    },
  Category:{
    type:String,
    required:[true,"Category is required"]
  },
  Description: {
    type: String,
    required: [true, "Description is Required"]
  },
  _Session: [{type: Schema.Types.ObjectId, ref: 'Session'}],
  _Exercises: [{type: Schema.Types.ObjectId, ref: 'Exercise'}],
  _user: {type:Schema.Types.ObjectId,ref: 'User'},
  _reoccurance: [{type: Schema.Types.ObjectId, ref: 'Reoccurance'}],
 },{timestamps: true});


 var Template = mongoose.model('Template', TemplateSchema);
