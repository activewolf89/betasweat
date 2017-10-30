var mongoose = require('mongoose')
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserRegSchema= new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    validate: {
          validator: function(v, cb) {
            User.find({email: v}, function(err,docs){
               cb(docs.length == 0);
            });
          },
          message: 'User already exists!'
        },
    unique: true,
    required: true
  },
  beforeImageId: {
    type: String
  },
  afterImageId: {
    type: String
  },
  bodyWeight: {
    type: Array
  },
  hash: String,
  salt: String,
  _templates: [{type: Schema.Types.ObjectId, ref: 'Template'}],
  _exercises: [{type:Schema.Types.ObjectId, ref: 'Exercise'}],
  _sessions: [{type:Schema.Types.ObjectId, ref: 'Session'}],
  _reoccurance: [{type:Schema.Types.ObjectId, ref: 'Reoccurance'}],
  resetPasswordToken: String,
  resetPasswordExpires: Date,

 },{timestamps: true});

UserRegSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,"sha512").toString('hex');
}
UserRegSchema.methods.setPasswordToken = function(password){
  salt = crypto.randomBytes(16).toString('hex');
  resetPasswordToken = crypto.pbkdf2Sync(password, salt, 1000, 64,"sha512").toString('hex');
  return resetPasswordToken
}
UserRegSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,"sha512").toString('hex');
  return this.hash === hash;
};
UserRegSchema.methods.generateJwtForReset = function(){
  var expiry = new Date();
  expiry.setDate(expiry.getDate()+7);

  return jwt.sign({
    email: this.email,
    token:this.resetPasswordToken,
    exp: parseInt(expiry.getTime() / 1000),
}, "ninthNinja");
}

UserRegSchema.methods.generateJwt = function(){
  var expiry = new Date();
  expiry.setDate(expiry.getDate()+7);
  return jwt.sign({
  _id: this._id,
  email: this.email,
  name: this.name,
  exp: parseInt((expiry) / 1000),
}, "ninthNinja");
}
 var User = mongoose.model('User', UserRegSchema);
