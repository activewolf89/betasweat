var mongoose = require('mongoose');
Schema = mongoose.Schema;
var ReoccuranceSchema= new mongoose.Schema({
Frequency: {
    type: Number,
    required: [true, "Frequency is required"],
  },
  StartDate:{
    type:Date,
    required:[true,"StartDate is required"]
  },
  EndDate: {
    type: Date,
    required: [true, "EndDate is Required"]
  },
  EmailNotification: {
    type: Boolean,
    required: [true, 'email notify is required']
  },
  _template: {type: Schema.Types.ObjectId, ref: 'Template'},
  _user: {type: Schema.Types.ObjectId, req: 'User'}
 },{timestamps: true});


 var Template = mongoose.model('Reoccurance', ReoccuranceSchema);
