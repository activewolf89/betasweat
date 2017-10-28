var mongoose = require('mongoose');
Schema = mongoose.Schema;
var ExerciseSchema= new mongoose.Schema({
  Title: {
      type: String,
      required: [true, "Title is required"],
      minLength: [1, "Min Length is 1"],
      maxLength: [20, "Max Length is 20"],
      trim: true,
    },
  Description: {
      type: String,
      trim: true,
    },
  UsesBodyWeight: {
    type:Boolean,
    required: [true, 'bodyweight question is required']
  },
  ImageStringId: {
    type: String,
  },
  _Templates: [{type: Schema.Types.ObjectId, ref: 'Template'}],
  _user: {type:Schema.Types.ObjectId, ref: 'User'},
  Metric: {type: Boolean}
 },{timestamps: true});


 var Exercise = mongoose.model('Exercise', ExerciseSchema);
