require('dotenv').config()
var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
require("./config/mongoose.js");
require("./config/passport.js");
var schedule = require('node-schedule');
 var rule = new schedule.RecurrenceRule();
 var EmailNotify = require('./config/automaticEmail.js')
 var NotifyAdmin = require('./config/NotifyAdmin.js')
 app.use(express.static(path.join(__dirname, 'build')));

rule.hour = 6;
rule.minute = 30;
var j = schedule.scheduleJob(rule,EmailNotify);
var rule2 = new schedule.RecurrenceRule();

var m = schedule.scheduleJob({hour: 12, minute: 0, dayOfWeek: 0}, NotifyAdmin);

app.use(bodyParser());
app.use(passport.initialize());
// app.use(function(req, res, next) { //allow cross origin requests
//     res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
//     res.header("Access-Control-Allow-Origin", "http://localhost:3001");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Credentials", true);
//     next();
// });
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

route_app = require("./config/configRoute.js")
route_app(app)
app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, 'build', 'index.html'));
 });

const port = 3001
app.listen(port, ()=>{
  console.log(`listening on ${port}`)
})
