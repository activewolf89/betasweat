var WorkRoute = require('./../controller/WorkoutController.js')
var SessionRoute = require('./../controller/SessionController.js')
var UserRoute = require('./../controller/UserController.js')
var TemplateRoute = require('./../controller/TemplateController.js')
var ProgressRoute = require('./../controller/ProgressController.js')
var CalendarRoute = require('./../controller/CalendarController.js')
var jwt = require('express-jwt');
var auth = jwt({
  secret:  "ninthNinja",
  userProperty: 'payload'
});

var mongoose = require('mongoose');
var conn = mongoose.connection;
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);
ObjectId = require('mongodb').ObjectID;

var storage = new GridFsStorage({
  url: 'mongodb://localhost/Session',
  file: (req, file) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
  } else {
    return null;
  }
}
});
var upload = multer({
  storage: storage
}).single('myFile')

module.exports = function(app){

app.post('/addimage',function(req,res){
  upload(req,res,function(err){
    if(err){
      console.log(err)
      res.json({fileId: ''})
    } else {
      console.log(req.files)
      res.json({fileId: req.file.id})
    }
  })
})
app.post('/profile/image/before/:userId',function(req,res){
  upload(req,res,function(err){
    if(err){
      res.json({fileId:''})
    } else {
      UserRoute.updateBeforeImage(req,res);
    }
  })
})
app.get('/profile/swapimages/:userId',function(req,res){
  UserRoute.swapImages(req,res);
})
app.post('/profile/image/after/:userId',function(req,res){
  upload(req,res,function(err){
    if(err){
      res.json({fileId:''})
    } else {
      UserRoute.updateAfterImage(req,res);
    }
  })
})
app.post('/upload', function (req, res) {

  upload(req,res,function(err){
    if(err){
      res.json({success:false,'message': "file had error"})
    } else {
      res.json({success:true,'message':'file was uploaded',fileId: req.file.id})
    }
  })
})

app.get('/getimage/:imageId',(req,res)=>{
  gfs.collection('Photo');
  gfs.files.find({_id:new ObjectId('59e028f1178fc8362037d24f')}).toArray(function(err,files){

    if(!files || files.length === 0){
    } else {
      console.log(files)
      // var readstream = gfs.createReadStream({
      //   filename: files[0].filename,
      //   root: "photos"
      // })

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
        res.end(img);
      })
      readstream.on('error',function(err){
        console.log('error has occured',err);
        throw err;
      })
      // /** set the proper content type */
      // res.set('Content-Type', files[0].contentType)
      // /** return response */
      // return readstream.pipe(res);
    }
  })
  // req.params.imageId
})
// -----------------Workout Routes --------------------
app.get('/train/exercises/showAll/:userId',(req,res)=>{
  WorkRoute.showAll(req,res);
})
app.get('/removePhotoFromDatabase/:photoId',(req,res)=>{
  WorkRoute.removePhoto(req,res);
})
app.get('/train/templates/SessionAndExerciseCount/:title',(req,res)=>{
  WorkRoute.sessionAndExercise(req,res);
})
app.post('/train/exercises/add/:userId',(req,res)=>{
  WorkRoute.add(req,res)
})
app.post('/train/exercises/update',(req,res)=>{
  WorkRoute.update(req,res)
})

app.get('/train/exercise/details/:title/:userId',(req,res)=>{
  WorkRoute.specifics(req,res);
})
app.get('/train/exercises/remove/:exerciseId/:userId',(req,res)=>{
  WorkRoute.remove(req,res);
})
app.post('/train/exercises/multiAssociate/:userId',(req,res)=>{
  WorkRoute.multipleAssociate(req,res);
})
//----------------------------------------------------
//------------------Progress Routes -------------------
app.get('/train/progress/templateTitles/:userId',(req,res)=>{
  ProgressRoute.templateTitles(req,res);
})
app.get('/train/progress/:singleTemplate/:userId',(req,res)=>{
  ProgressRoute.templateData(req,res);
})
//----------------------------------------------------
//------------------Calendar Routes ------------------
app.post('/train/calendar/add',(req,res)=>{
  CalendarRoute.add(req,res);
})
app.post('/train/calendar/update',(req,res)=>{
  CalendarRoute.edit(req,res);
})
app.get('/train/calendar/showAll/:userId',(req,res)=>{
  CalendarRoute.showAll(req,res);
})
app.get('/train/calendar/remove/:reoccuranceId/:userId/:templateId',(req,res)=>{
  CalendarRoute.remove(req,res);
})
//---------------------------------------------------
//-------------------Template Routes -----------------

app.get('/seetemplate/show/:userId',(req,res)=>{
  TemplateRoute.showAll(req,res);
})
app.get('/train/showAllWithExercises/:userId',(req,res)=>{
  TemplateRoute.showAllWithExercises(req,res);
})

app.post('/train/templates/add',(req,res)=>{
  TemplateRoute.add(req,res);
})
app.post('/train/template/update',(req,res)=>{

  TemplateRoute.update(req,res);
})

app.get('/train/templates/remove/:templateId/:userId',(req,res)=>{
  TemplateRoute.remove(req,res);
})

//-----------------------------------------------------
//------------------Session Routes ----------------------
app.post('/train/session/add/:userId',(req,res)=>{
    SessionRoute.addSession(req,res)
})
app.post('/train/session/edit/:userId',(req,res)=>{
    SessionRoute.editSession(req,res)
})
app.get('/train/session/remove/:sessionId',(req,res)=>{
  SessionRoute.removeSession(req,res)
})
app.get('/train/criteria/:title/:userId',(req,res)=>{
  SessionRoute.getSession(req,res)
})
app.get('/train/session/show/:userId',(req,res)=>{
  SessionRoute.showAll(req,res);
})
app.get('/train/session/exercises/:title/:userId',(req,res)=>{
  SessionRoute.getExercises(req,res)
})
// ------------------------------------------------------
//-------------------User Routes -----------------------
app.get('/user/checkvalidation/:email/:token',(req,res)=>{
  UserRoute.checkValidation(req,res);
})
app.post('/user/updatePassword',(req,res)=>{
  UserRoute.updatePassword(req,res);
})
app.post('/update/name/:userId',(req,res)=>{
  UserRoute.updatename(req,res);
})
app.post('/update/bodyWeight/:userId',(req,res)=>{
  UserRoute.updateweight(req,res);
})
app.get('/check/useremail/:email',(req,res)=>{
  UserRoute.checkemail(req,res);
})
app.post('/update/useremail/:userId',(req,res)=>{
  UserRoute.updateemail(req,res);
})
app.get('/user/email/:emailAddress',(req,res)=>{
  UserRoute.retrieveEmail(req,res);
})
app.post('/user/add',(req,res)=>{
  UserRoute.add(req,res);
})
app.get('/user/weight/:userId',(req,res)=>{
  UserRoute.weight(req,res);
})
app.post('/user/login',(req,res)=>{
  UserRoute.login(req,res)
})
app.get('/profile', auth, (req,res)=>{
  UserRoute.show(req,res)
})
app.post('/user/update/bodyWeight/:userId',(req,res)=>{
  UserRoute.updateBodyWeight(req,res);
})
app.get('/user/images/:userId',(req,res)=>{
  UserRoute.retrieveImages(req,res);
})
app.get('/profile/removeBeforeImage/:userId',(req,res)=>{
  UserRoute.removeBeforeImage(req,res);
})
app.get('/profile/removeAfterImage/:userId',(req,res)=>{
  UserRoute.removeAfterImage(req,res);
})
app.post('/contact',(req,res)=>{
  UserRoute.contact(req,res);
})
//-----------------------------------------------------

}
