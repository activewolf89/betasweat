var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SessionSchema = new mongoose.Schema({

  ArrayOfExercises: {
    type: Array,
    required: [true,"Array is required"]
  },
  CurrentWeight: {
    type: Number,
    required: [true, "Weight is required"],
  },
  Strength: {
    type: Number,
    required: [true, "Strength is required"],
  },
  EstimatedTime: {
    type: Number,
    required: [true,'estimate time is required']
  },
  BenchMark: {
    type: Boolean,
    required: [true, 'benchmark is required']
  },
  keyMetricWeight: {
    type:Number,
    required: [true, "KeyMetric is required"]
  },
  keyMetricReps: {
    type:Number,
    required: [true, "KeyMetric is required"]
  },
  _Template: {type: Schema.Types.ObjectId, ref: 'Template'},
  _user: {type:Schema.Types.ObjectId, ref: 'User'}


},{timestamps:true})

var Session = mongoose.model('Session', SessionSchema);
