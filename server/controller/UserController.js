var mongoose = require('mongoose')
var User = mongoose.model('User');
var passport = require('passport');
var UserFieldValidations =require('./../../client/src/components/Body/User/UserFieldValidations.js')
var HelperFunctions = require('./HelperFunctions.js');
var crypto = require('crypto');
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
var conn = mongoose.connection
Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);
ObjectId = require('mongodb').ObjectID;
module.exports = {
checkValidation: function(req,res){
// /user/checkvalidation/:email/:token
User.findOne({email: req.params.email,resetPasswordToken: req.params.token},(err,user)=>{
  if(err){
    res.status(404).json(err)
  } else {
    res.json(user)
  }
})

},
removeBeforeImage: function(req,res){
  User.findByIdAndUpdate(
    req.params.userId,
    {beforeImageId: null},
    (err)=>{
      if(err){
        res.json('err')
      } else {
        res.json('got it')
        User.find({_id:req.params.userId},(err,users)=>{
        })
      }
    }
  )
},
removeAfterImage: function(req,res){
  User.findByIdAndUpdate(
    req.params.userId,
    {afterImageId: null},
    (err)=>{
      if(err){
        res.json('err')
      } else {
        res.json('got it')
        User.find({_id:req.params.userId},(err,users)=>{
        })
      }
    }
  )
},
retrieveImages: function(req,res){

  User.findOne({_id:req.params.userId},(err,user)=>{
    if(err){
      res.status(404).json(err)
    } else {
      gfs.collection('fs');
       gfs.files.find({_id:new ObjectId(user.beforeImageId)}).toArray(function(err,files1){
        if(!files1 || files1.length === 0){
            gfs.files.find({_id:new ObjectId(user.afterImageId)}).toArray(function(err,afterfiles1){
              if(!afterfiles1 || afterfiles1.length === 0){
                res.json({beforeImage:'',afterImage: ''})
              } else {
                let data = [];
                let readstream = gfs.createReadStream({
                  filename: afterfiles1[0].filename
                })
                readstream.on('data',function(chunk){
                  data.push(chunk)
                })
                readstream.on('end',function(){
                  data = Buffer.concat(data);

                  let img =Buffer(data).toString('base64');
                  res.json({beforeImage:'',afterImage: img})
                })
                readstream.on('error',function(err){
                  throw err;
                })
              }
            })
        } else {
          let data = [];
          let readstream = gfs.createReadStream({
            filename: files1[0].filename
          })
          readstream.on('data',function(chunk){
            data.push(chunk)
          })
          readstream.on('end',function(){
            data = Buffer.concat(data);

            let img =Buffer(data).toString('base64');
            gfs.files.find({_id:new ObjectId(user.afterImageId)}).toArray(function(err,afterFiles2){
              if(!afterFiles2 || afterFiles2.length === 0){
                res.json({beforeImage:img,afterImage: ''})
              } else {
                let data = [];
                let readstream = gfs.createReadStream({
                  filename: afterFiles2[0].filename
                })
                readstream.on('data',function(chunk){
                  data.push(chunk)
                })
                readstream.on('end',function(){
                  data = Buffer.concat(data);

                  let afterImage =Buffer(data).toString('base64');
                  res.json({beforeImage:img,afterImage: afterImage})
                })
                readstream.on('error',function(err){
                  throw err;
                })
              }
            })


          })
          readstream.on('error',function(err){
            throw err;
          })

        }
      })
    }
  })
},
updateBeforeImage: function(req,res){
  User.findByIdAndUpdate(
    req.params.userId,
    {beforeImageId: req.file.id},
    function(err){
      if(err){
        res.json(err)
      } else {
        res.json('good')

      }
    }
  )
},
updateAfterImage: function(req,res){
  User.findByIdAndUpdate(
    req.params.userId,
    {afterImageId: req.file.id},
    function(err){
      if(err){
        res.json(err)
      } else {
        res.json('good')

      }
    }
  )
},
swapImages: function(req,res){
  User.findOne({_id:req.params.userId},(err,user)=>{
    if(err){
      res.status(404).json('err')
    } else {
      var beforeImageId = user.beforeImageId
      var afterImageId = user.afterImageId
      User.findByIdAndUpdate(
        req.params.userId,
        {beforeImageId: afterImageId, afterImageId:beforeImageId},
        function(err){
          if(err){
            res.json(err)
          } else {
            res.json('good')
          }
        }
      )
    }
  })
},
updatename: function(req,res){
  User.findByIdAndUpdate(
    req.params.userId,
    {name: req.body.name},
    function(err){
      if(err){
        res.json(err)
      } else {
        res.json('good')
      }
    }
  )
},
updateweight: function(req,res){
  User.findByIdAndUpdate(
    req.params.userId,
    { $push: { bodyWeight: req.body.bodyWeight }},
    function(err){
      if(err){
        res.json(err)
      } else {
        res.json('good')
      }
    }
  )
},
checkemail: function(req,res){
  User.findOne({email: req.params.email},(err,email)=>{
    if(err){
      res.json(err)
    } else {
      res.json(email)
    }
  })
},
updateemail: function(req,res){

  User.update({_id:req.params.userId},{email: req.body.email},(err,user)=>{
    if(err){
      res.json(err)
    } else {
      User.find({},(err,users)=>{
        res.json(users)
      })
    }
  })
},
updatePassword: function(req,res){
  User.findByIdAndUpdate(
    req.params.userId,
    { $push: { bodyWeight: req.body.bodyWeight }},
    function(err){
      if(err){
        res.json(err)
      } else {
        res.json('good')
      }
    }
  )
},
retrieveEmail: function(req,res){

  User.findOne({email:req.params.emailAddress.toLowerCase()},(err,user)=>{
    if(err){
      res.status(404).json(err);
    } else {
      if(user){
        User.findByIdAndUpdate({_id: user._id},{
          resetPasswordToken: user.setPasswordToken(req.params.emailAddress.toLowerCase()),
          resetPasswordExpires: new Date()
        },{new:true},(err,updatedUser)=>{
          if(err){
            res.status(404).json(err)
          } else {
            token = updatedUser.generateJwtForReset();
              if(HelperFunctions.sendForgotPassword(req.params.emailAddress.toLowerCase(),token)){
                res.status(404).json('failure')
              } else {
                res.json('success')
              }

          }
        })
      } else {
        res.status(404).json(err)
      }

    }
  })
},
add: function(req,res){

      var user = new User();
      user.name = req.body.name;
      user.email = req.body.email;
      user.bodyWeight.push(req.body.bodyWeight);
      user.setPassword(req.body.password);
      user.save((err)=>{

        var token;
        token = user.generateJwt();
        console.log(token)
          res.json({
          "token" : token
        });
      })


},
  weight: function(req,res){
    User.findOne({_id: req.params.userId},(err,user)=>{
      if(err){
        res.status(401).json(err);

      } else {
        res.json(user)
      }
    })
  },
  updateBodyWeight: function(req,res){
    User.findByIdAndUpdate(
      req.params.userId,
      {$push: {"bodyWeight":req.body.bodyWeight}},
      {safe: true, upsert: true},(err,user)=>{
        if(err){
        } else {
        }
      }
    )
  },
  login: function(req,res){
    var resultingFormErrors = UserFieldValidations.login(req.body.email,req.body.password);
    if(Object.keys(resultingFormErrors).length !== 0){
      res.json(resultingFormErrors)
    } else {

      passport.authenticate('local', function(err, user, info){
        var token;

        // If Passport throws/catches an error
        if (err) {
          res.status(404).json(err);
          return;
        }

        // If a user is found
        if(user){
          token = user.generateJwt();
          res.status(200);
          res.json({
            "token" : token
          });
        } else {
          // If user is not found
          res.status(401).json(info);
        }
      })(req, res);
    }
  },
  show: function(req,res){
    // If no user ID exists in the JWT return a 401
if (!req.payload._id) {
  res.status(401).json({
    "message" : "UnauthorizedError: private profile"
  });
} else {
  // Otherwise continue
  User
    .findById(req.payload._id)
    .exec(function(err, user) {
      res.status(200).json(user);
    });
}
  },
  updatePassword: function(req,res){
    // password: this.state.password,
    // passwordMatch: this.state.passwordMatch,
    // userId: this.state.userId
    var salt = crypto.randomBytes(16).toString('hex');
    var hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64).toString('hex');

    User.findByIdAndUpdate({_id:req.body.userId},{
      resetPasswordToken: null,
      resetPasswordExpires: null,
      salt: salt,
      hash: hash
    },{new:true},(err,updatedUser)=>{
      if(err){
        res.status(404).json(err)
      } else {
        token = updatedUser.generateJwt();
        res.status(200).json({token:token})
      }
    })
  },
    contact: function(req,res){
      if(!HelperFunctions.sendToBetaSweat(req.body.name,req.body.email,req.body.comment)){
        res.json('success')
    } else {
      res.status(404).json('not successful')
    }
  }
}
