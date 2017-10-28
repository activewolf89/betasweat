  import React,{Component} from "react";
  import axios from 'axios';
  import {Button,Grid,Row,Col,Modal} from 'react-bootstrap';
  import TrainSet from './TrainSet.js';
  import CriteriaHeader from './CriteriaHeader.js';
  import ParentTimer from './ParentTimer.js';
  import AddExercise from './AddExercise.js';
  import TemplateAdd from './TemplateAdd';
  import {Redirect} from 'react-router-dom';
  import ExerciseReadOnly from './ExerciseReadOnly.js';
  import {Icon} from 'react-fa'
  require('./../../../css/styles.css')
  class TrainingSession extends Component{
    //top
    constructor(props){
      super(props);
      this.state = {
        workOutObjects: [],
        timerModal: false,
        workOuts: [],
        criteriaOptions: [],
        weight: '0',
        reps: '0',
        sessionExercises: [],
        defaultSessionExercises: {submitErrors: [], key:1, strength_to_weight:"",strength:"", isMetric: false, repTakes:'7', restBetweenReps:"8", restBetweenSets:"2", restBetweenExercises:"2", exerciseId:"", title:"--select--", sets:[{submitErrors: [], prevDiff:"",key:1, goalinlbs:"", goalinreps:"",reps:"7",res:"0",difficulty:"average"}]},
        defaultObject: {submitErrors: [], prevDiff:"",key:1, goalinlbs:"", goalinreps:"",reps:"7",res:"0",difficulty:"average"},
        criteria: false,
        criteriaTitle:"",
        currentBodyWeight: '0',
        runningStrengthTotal: 0,
        originalBodyWeight:0,
        timerForExercise: "",
        RequiredFieldsForExerciseTimer: "",
        keyMetrics: [],
        establishSubmit: false,
        sessionMessage: "",
        triggerExercise:false,
        exercisesCurrentlySelect: [],
        currentinSession: 0,
        disableTheseWorkouts: [],
        quickAddTemplate: false,
        quickAddExercise: false,
        benchMark: false,
        estimatedTime: '',
        firstSession: false,
        timeInSession: 0,
        redirectToSuccess: false,
        redirectToEdit: false,
        redirectToPerformance: false,
        successSessionArray: [],
        exNum: 0,
        exTotal: 0,
        sessionEditObject: '',
        openExerciseDetails: false,
        specificExercise: {}
      }
      this.handleQuickAddTemplate = this.handleQuickAddTemplate.bind(this);
      this.handleExerciseReturn = this.handleExerciseReturn.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChangeInput = this.handleChangeInput.bind(this);
      this.handleAddingGroupSet = this.handleAddingGroupSet.bind(this);
      this.handleAddingSetOfExercise = this.handleAddingSetOfExercise.bind(this);
      this.handleCriteriaSubmit = this.handleCriteriaSubmit.bind(this);
      this.handleRemoveExercise = this.handleRemoveExercise.bind(this);
      this.handleExerciseSessionMinus = this.handleExerciseSessionMinus.bind(this);
      this.handleTimerModal = this.handleTimerModal.bind(this);
      this.hideModal = this.hideModal.bind(this);
      this.handleCriteriaClear = this.handleCriteriaClear.bind(this);
      this.handleWorkOutShow = this.handleWorkOutShow.bind(this);
      this.checkExerciseMetric = this.checkExerciseMetric.bind(this);
      this.checkSession = this.checkSession.bind(this);
      this.strengthToWeightUpdate = this.strengthToWeightUpdate.bind(this);
      this.handleWeightChange = this.handleWeightChange.bind(this);
      this.handleTemplateChange = this.handleTemplateChange.bind(this);
      this.initiatePost = this.initiatePost.bind(this);
      this.getDateDifference = this.getDateDifference.bind(this);
      this.handleExerciseOnFly = this.handleExerciseOnFly.bind(this);
      this.returnToSession = this.returnToSession.bind(this);
      this.handleCheckValue = this.handleCheckValue.bind(this);
      this.handleMoveUp = this.handleMoveUp.bind(this);
      this.handleMoveDown = this.handleMoveDown.bind(this);
      this.handleQuickAddExercise = this.handleQuickAddExercise.bind(this);
      this.handleBenchmark = this.handleBenchmark.bind(this);
      this.convertSecondsToTimeString = this.convertSecondsToTimeString.bind(this);
      this.handleTickClock = this.handleTickClock.bind(this);
      this.handleRemoveSession = this.handleRemoveSession.bind(this);
      this.handleOpenExerciseDetails = this.handleOpenExerciseDetails.bind(this);
    }
    componentDidMount(){
      if(!this.props.params.location.templateObject && !this.props.params.location.sessionObject){

        axios.get('/seetemplate/show/'+this.props.payLoad._id).then((res)=>{
          if(res.data.length > 0){
            this.setState({
              criteriaOptions: res.data,
              criteriaTitle: res.data[0].Title,
              estimatedTime: !res.data || res.data[0]._Session.length ===0 ?0: this.convertSecondsToTimeString(res.data[0]._Session[res.data[0]._Session.length-1].EstimatedTime),
              weight: !res.data || res.data[0]._Session.length === 0 ? 0 : res.data[0]._Session[res.data[0]._Session.length-1].keyMetricWeight,
              reps: !res.data || res.data[0]._Session.length === 0 ? 0 : res.data[0]._Session[res.data[0]._Session.length-1].keyMetricReps,
            })
          }
          return axios.get('/user/weight/'+ this.props.payLoad._id).then((res)=>{
            this.setState({
              currentBodyWeight: res.data.bodyWeight[res.data.bodyWeight.length -1],
              originalBodyWeight: res.data.bodyWeight[res.data.bodyWeight.length -1],
            })
          })
        })
      } else {
        if(this.props.params.location.sessionObject){
          axios.get('/seetemplate/show/'+this.props.payLoad._id).then((res)=>{
            const {sessionObject} = this.props.params.location;
            var title = '';
            if(typeof(sessionObject._Template)=== "string"){
              for(var i = 0; i < res.data.length;i++){
                if(res.data[i]._id === sessionObject._Template){
                  title = res.data[i].Title
                }
              }
            } else {
              title = sessionObject._Template.Title
            }
            this.setState({
              criteriaOptions: res.data,
              sessionEditObject: this.props.params.location.sessionObject,
              criteriaTitle: title,
              estimatedTime: sessionObject ? this.convertSecondsToTimeString(sessionObject.EstimatedTime):'',
              reps: sessionObject ? sessionObject.keyMetricReps:0,
              weight: sessionObject ? sessionObject.keyMetricWeight:0,
              originalBodyWeight:sessionObject ? sessionObject.CurrentWeight: 0,
              currentBodyWeight:sessionObject ? sessionObject.CurrentWeight: 0,
              benchMark: sessionObject ? sessionObject.BenchMark: false
            })
          })
        }
        if(this.props.params.location.templateObject){
          axios.get('/seetemplate/show/'+this.props.payLoad._id).then((res)=>{
            if(res.data.length > 0){
              const {templateObject} =this.props.params.location
              this.setState({
                criteriaOptions: res.data,
                criteriaTitle: templateObject.Title,
                estimatedTime: templateObject._Session.length === 0 ? 0: this.convertSecondsToTimeString(templateObject._Session[templateObject._Session.length-1].EstimatedTime),
                weight: templateObject._Session.length === 0 ? 0 : templateObject._Session[templateObject._Session.length-1].keyMetricWeight,
                reps: templateObject._Session.length === 0 ? 0 : templateObject._Session[templateObject._Session.length-1].keyMetricReps,
              })
            }
            return axios.get('/user/weight/'+ this.props.payLoad._id).then((res)=>{
              this.setState({
                currentBodyWeight: res.data.bodyWeight[res.data.bodyWeight.length -1],
                originalBodyWeight: res.data.bodyWeight[res.data.bodyWeight.length -1],
              })
            })
          })
        }
        if(!this.props.params.location){
          this.setState({
            redirectToEdit: true
          })
        }

      }
    }
    handleOpenExerciseDetails(specificExercise){
      this.setState({
        openExerciseDetails: true,
        specificExercise: specificExercise
      })

    }
    handleTickClock(){
      this.setState({
        timeInSession: this.state.timeInSession + 1
      })
    }
    convertSecondsToTimeString(seconds){
      var sec_num = parseInt(seconds, 10); // don't forget the second param
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return hours+':'+minutes+':'+seconds;
    }
    handleRemoveSession(){
      axios.get('/train/session/remove/'+ this.props.params.location.sessionObject._id).then((res)=>{
        this.setState({
          redirectToPerformance: true
        })
      }).catch((err)=>{
        this.setState({
          sessionMessage: err
        })
      })
    }
    handleBenchmark(){
      this.setState({
        benchMark: this.state.benchMark ? false: true
      })
    }
    handleQuickAddExercise(){
      this.setState({
        triggerExercise: true
      })
    }
    handleMoveUp(index){
      var copyOfSessionExercise = this.state.sessionExercises.slice();
      var temp = copyOfSessionExercise[index]
      for(var i = 0; i < copyOfSessionExercise.length;i++){
        if(i === index){
          copyOfSessionExercise[i].key = copyOfSessionExercise[i].key - 1
          copyOfSessionExercise[i-1].key = copyOfSessionExercise[i - 1].key + 1
        }
      }
      copyOfSessionExercise[index] = copyOfSessionExercise[index - 1]
      copyOfSessionExercise[index-1] = temp;
      this.setState({
        sessionExercises: copyOfSessionExercise
      })
    }
    handleMoveDown(index){
      var copyOfSessionExercise = this.state.sessionExercises.slice();
      var temp = copyOfSessionExercise[index]
      for(var i = 0; i < copyOfSessionExercise.length;i++){
        if(i === index){
          copyOfSessionExercise[i].key = copyOfSessionExercise[i].key + 1
          copyOfSessionExercise[i+1].key = copyOfSessionExercise[i + 1].key - 1
        }
      }
      copyOfSessionExercise[index] = copyOfSessionExercise[index + 1]
      copyOfSessionExercise[index + 1] = temp;
      this.setState({
        sessionExercises: copyOfSessionExercise
      })
    }
    handleCheckValue(name,value){
      var exerciseNumber = "";
      var exerciseInput = "";
      var exerciseSet = "";
      var triggeredStartOfTitle = false;
      var copyOfSessionExercise = this.state.sessionExercises.slice();
      for(let i = 0; i < name.length;i++){
        if(isNaN(name[i]) === false && triggeredStartOfTitle===false){
          exerciseNumber += name[i];
        }
        if(isNaN(name[i]) === true){
          triggeredStartOfTitle = true;
          exerciseInput += name[i];
        }
        if(isNaN(name[i]) === false && triggeredStartOfTitle ===true){
          exerciseSet += name[i];
        }
      }
      for(let i = 0; i < copyOfSessionExercise.length;i++){
        if(copyOfSessionExercise[i].repTakes === "" || Number(copyOfSessionExercise[i].repTakes) < 0){
          if(copyOfSessionExercise[i-1]){
            copyOfSessionExercise[i].repTakes = copyOfSessionExercise[i-1].repTakes;
          } else {
            copyOfSessionExercise[i].repTakes = "7";
          }
        }
        if(copyOfSessionExercise[i].restBetweenReps === "" || Number(copyOfSessionExercise[i].restBetweenReps) < 0){
          if(copyOfSessionExercise[i-1]){
            copyOfSessionExercise[i].restBetweenReps = copyOfSessionExercise[i-1].restBetweenReps;
          } else {
            copyOfSessionExercise[i].restBetweenReps = "8";
          }
        }
        if(copyOfSessionExercise[i].restBetweenExercises === "" || Number(copyOfSessionExercise[i].restBetweenExercises) < 0){
          if(copyOfSessionExercise[i-1]){
            copyOfSessionExercise[i].restBetweenExercises = copyOfSessionExercise[i-1].restBetweenExercises;
          } else {
            copyOfSessionExercise[i].restBetweenExercises = "2";
          }
        }
        if(copyOfSessionExercise[i].restBetweenSets === "" || Number(copyOfSessionExercise[i].restBetweenSets) < 0){
          if(copyOfSessionExercise[i-1]){
            copyOfSessionExercise[i].restBetweenSets = copyOfSessionExercise[i-1].restBetweenSets;
          } else {
            copyOfSessionExercise[i].restBetweenSets = "2";
          }
        }
        for(var m = 0; m < copyOfSessionExercise[i].sets.length;m++){
          if(!copyOfSessionExercise[i].sets[m].reps || Number(copyOfSessionExercise[i].sets[m].reps) < 1){
            if(copyOfSessionExercise[i].sets[m-1]){
              copyOfSessionExercise[i].sets[m].reps =copyOfSessionExercise[i].sets[m-1].reps;
            } else {
              copyOfSessionExercise[i].sets[m].reps = "7"

            }
          }
          if(!copyOfSessionExercise[i].sets[m].res){
            if(copyOfSessionExercise[i].sets[m-1]){
              copyOfSessionExercise[i].sets[m].res = copyOfSessionExercise[i].sets[m-1].res;
            } else {
              copyOfSessionExercise[i].sets[m].res = "0"

            }
          }
        }
        this.setState({
          sessionExercises: copyOfSessionExercise
        })
      }

    }
    returnToSession(){
      axios.get('/seetemplate/show/'+this.props.payLoad._id).then((res)=>{

        if(res.data.length > 0){
          this.setState({
            criteriaOptions: res.data,
            criteriaTitle: !this.state.criteriaTitle ? res.data[0].Title:this.state.criteriaTitle,
            quickAddTemplate: false,
          })
        }
      })
    }
    handleQuickAddTemplate(){
      this.setState({
        quickAddTemplate: true
      })
    }
    handleExerciseReturn(){
      this.setState({
        triggerExercise:false
      },this.handleWorkOutShow)
    }
    handleExerciseOnFly(){
      this.setState({
        triggerExercise: true
      })
    }
    getDateDifference(time){
      var today = new Date();
      var before = new Date(time);
      var elapsed = today - before;
      elapsed = elapsed / 1000
      // Calculate the number of days left
      var days = Math.floor(elapsed / 86400);
      // After deducting the days calculate the number of hours left
      var hours = Math.floor((elapsed - (days * 86400 ))/3600)
      // After days and hours , how many minutes are left
      // var minutes = Math.floor((elapsed - (days * 86400 ) - (hours *3600 ))/60)
      // Finally how many seconds left after removing days, hours and minutes.
      // var secs = Math.floor((elapsed - (days * 86400 ) - (hours *3600 ) - (minutes*60)))
      if(days > 1){
        if(hours > 1){
          return days + " days " + hours + "hours ago"
        } else {
          return (days + " days " + hours + "hour ago")
        }

      }
      if(days === 1){
        if(hours > 1){
          return days + " day " + hours + "hours ago"
        } else {
          return days + " day " + hours + "hour  ago"
        }
      }
      if(days === 0){
        if(hours > 1){
          return hours + " hours ago"
        }
        if(hours === 1){
          return hours + " ago"
        }
        if(hours === 0){
          return "less than an hour ago"
        }
      }

    }
    initiatePost(){
      if(Number(this.state.currentBodyWeight) !== Number(this.state.originalBodyWeight)){
        axios({
          method: 'post',
          data: {
            bodyWeight: this.state.currentBodyWeight
          },
          url: '/user/update/bodyWeight/' + this.props.payLoad._id
        })
      }
      var sessions = this.state.sessionExercises;
      var totalInSeconds = 0;
      for(var i = 0; i < sessions.length;i++){
        var totalPerRep =  Number(sessions[i].repTakes) + Number(sessions[i].restBetweenReps);
        var totalForRest = (Number(sessions[i].restBetweenExercises) * 60) + (Number(sessions[i].restBetweenSets) * 60);
        totalInSeconds = totalInSeconds + totalForRest

        var sets = sessions[i].sets;
        for(var m = 0; m < sets.length;m++){
          var reps = Number(sets[m].reps);
          totalInSeconds = totalInSeconds + (reps * totalPerRep)
        }
      }
      var sessionObjects = this.state.sessionExercises;
      var count = 0;
      sessionObjects.forEach((session)=>{
        if(session.isMetric){
          count++;
        }
      })
      if(count === 0){
        count = 1
      }
      if(this.props.params.location.sessionObject){
        axios({
          method:'post',
          url: '/train/session/edit/' + this.props.payLoad._id,
          data: {
            title: this.state.criteriaTitle,
            estimatedTime: totalInSeconds,
            sessionArray: this.state.sessionExercises,
            strength:Math.round((this.state.runningStrengthTotal/count)*100)/100,
            keyMetricWeight: this.state.weight,
            currentWeight: this.state.currentBodyWeight,
            keyMetricReps: this.state.reps,
            benchMark: this.state.benchMark,
            sessionId: this.props.params.location.sessionObject._id
          }
        }).then((res)=>{
          this.setState({
              redirectToEdit: true
          })
        }).catch((err)=>{
          this.setState({
              sessionMessage:err
          })
        })
      } else {

        axios({
          method: 'post',
          url: "/train/session/add/" + this.props.payLoad._id,
          data: {
            title:this.state.criteriaTitle,
            estimatedTime: totalInSeconds,
            sessionArray: this.state.sessionExercises,
            currentWeight: this.state.currentBodyWeight,
            strength:Math.round((this.state.runningStrengthTotal/count)*100)/100,
            keyMetricWeight: this.state.weight,
            keyMetricReps: this.state.reps,
            benchMark: this.state.benchMark
          }
        }).then((res)=>{
          this.setState({
            redirectToSuccess: true,
            successSessionArray:res.data
          })
        })
      }
    }
    handleTemplateChange(name,value){

      var object = null;
      for(var i = 0; i < this.state.criteriaOptions.length;i++){
        if(value === this.state.criteriaOptions[i].Title){
          object = this.state.criteriaOptions[i]
        }
      }
      if(object){
        this.setState({
          weight: object._Session.length > 0 ? object._Session[object._Session.length - 1].keyMetricWeight: 0,
          reps: object._Session.length > 0 ? object._Session[object._Session.length - 1].keyMetricReps: 0,
        })
        if(object._Session.length > 0){
          this.setState({
            estimatedTime: this.convertSecondsToTimeString(object._Session[object._Session.length-1].EstimatedTime ? object._Session[object._Session.length-1].EstimatedTime:""),
          })
        } else {
          this.setState({
            estimatedTime: "To Be Determined"
          })
        }
      }
      this.setState({
        criteriaTitle: value
      })
    }
    handleWeightChange(name,value){

      this.setState({
        [name]:value
      })
    }
    strengthToWeightUpdate(){
      function adjustRepMath(reps){
        var runningTotal = .65;
        while (reps > 0){
          if(reps > 12){
            runningTotal += .02
            reps = reps - 1;
          } else {
            runningTotal += .04;
            reps = reps - 1;
          }
        }
        return runningTotal

      }
      //update strength to weight on every single exercise in session
      //have a running total for the current template
      //useful states we need: this.state.currentBodyWeight, this.state.runningStrengthTotal

      var copyOfSessionExercises = this.state.sessionExercises.slice();
      var bodyWeight = Number(this.state.currentBodyWeight);
      var exercises = copyOfSessionExercises;
      var runningStrength = 0;
      for(var i = 0; i < exercises.length;i++){
        var currentStrength = 0;
        var pastStrength = 0;
        var sets = copyOfSessionExercises[i].sets;
        for(var m = 0; m < sets.length;m++){
          var currentReps = Number(exercises[i].sets[m].reps)
          var adjustedCurrentReps = adjustRepMath(currentReps)
          var currentResIncludesBody = (Number((exercises[i].sets[m].res)) + bodyWeight)/bodyWeight;
          var currentResNotIncludeBody = (Number(exercises[i].sets[m].res))/bodyWeight;
          var pastReps =  Number(exercises[i].sets[m].goalinreps) === 0 ? currentReps: Number(exercises[i].sets[m].goalinreps);
          var adjustedPastReps = adjustRepMath(pastReps)
          var pastResIncludesBody = Number(exercises[i].sets[m].goalinreps) === 0 ? currentResIncludesBody: (Number((exercises[i].sets[m].goalinlbs)) + bodyWeight)/bodyWeight
          var pastResNotIncludeBody = Number(exercises[i].sets[m].goalinreps) === 0 ? currentResNotIncludeBody: (Number(exercises[i].sets[m].goalinlbs))/bodyWeight
          if(exercises[i].exerciseByWeight){
            currentStrength = currentStrength + adjustedCurrentReps * currentResIncludesBody;
            pastStrength += adjustedPastReps * pastResIncludesBody;
          } else {
            currentStrength += adjustedCurrentReps * currentResNotIncludeBody;
            pastStrength += adjustedPastReps * pastResNotIncludeBody;
          }
        }
        exercises[i].currentStrength = currentStrength/sets.length;
        runningStrength += exercises[i].currentStrength
        exercises[i].pastStrength = pastStrength/sets.length;

      }

      this.setState({
        sessionExercises: exercises,
        runningStrengthTotal:runningStrength
      },this.initiatePost)
    }
    checkSession(){
      if(this.state.currentBodyWeight < 50){
        this.setState({
          sessionMessage: "Error: BodyWeight Must Be Above 50"
        })
        return false;
      }
      if(this.state.currentBodyWeight > 400){
        this.setState({
          sessionMessage: "Error: BodyWeight Must Be Below 400"
        })
        return false;
      }
      var copyOfSessionExercises = this.state.sessionExercises.slice();
      //check first if: there isn't any exercises currently within.
      if(copyOfSessionExercises.length < 1){
        this.setState({
          sessionMessage: "Error: Must have at least one filled out Exercise For Session Submit"
        })
        return false;
      }
      var foundErrors = false;
      for(var i = 0; i < copyOfSessionExercises.length;i++){
        if(copyOfSessionExercises[i].title ==="--select--"){
          foundErrors = true;
          copyOfSessionExercises[i].submitErrors.push(i+"title")
        }
        for(var m = 0; m < copyOfSessionExercises[i].sets.length;m++){
          if(copyOfSessionExercises[i].sets[m].reps ===""){
            foundErrors = true;
            copyOfSessionExercises[i].sets[m].submitErrors.push(i+"reps"+m)
          }
          if(copyOfSessionExercises[i].sets[m].res ===""){
            foundErrors = true;
            copyOfSessionExercises[i].sets[m].submitErrors.push(i+"res"+m)

          }

        }
      }
      if(foundErrors){
        this.setState({
          sessionExercises: copyOfSessionExercises,
          sessionMessage: "Error: Fill Out All Required Fields"
        })
        return false
      } else {

        return true;
      }
    }
    checkExerciseMetric(title){
      for(var i = 0; i < this.state.keyMetrics.length;i++){
        if(title === this.state.keyMetrics[i]){
          return true;
        }
      }
      return false;
    }

    handleWorkOutShow(){
      axios.get("/train/session/exercises/"+this.state.criteriaTitle + '/' + this.props.payLoad._id).then((res)=>{
        //we need to check if any exercises were deleted update our sessionExercises;
        var count = 0;
        var totalExercises = this.state.sessionExercises;
        var countOfExercises = totalExercises.length;
        for(let m = 0; m < totalExercises.length;m++){
          var deleted = true;
          for(let i = 0; i < res.data._Exercises.length;i++){
            if(totalExercises[m].exerciseId === res.data._Exercises[i]._id){
                deleted = false;
            }
          }
          if(deleted){
            count++;
            // this.handleRemoveExercise(totalExercises[m].key)
          }
        }
        //this will pull all exercises with this criteriaTitle and display as options within the selection
        if(res.data._Exercises.length > 0){
          var arrayOfTitles = [];
          var metricTitles = [];
          for(let i = 0; i < res.data._Exercises.length;i++){
            arrayOfTitles.push(res.data._Exercises[i].Title)
            if(res.data._Exercises[i].Metric){
              metricTitles.push(res.data._Exercises[i].Title)
            }

          }
          this.setState({
            keyMetrics: metricTitles,
            workOuts: arrayOfTitles,
            workOutObjects: res.data._Exercises
          })
          if(this.state.firstSession){
            var newObject = this.state.sessionExercises[0];
            newObject.exerciseByWeight = res.data._Exercises[0].UsesBodyWeight
            newObject.exerciseId = res.data._Exercises[0]._id
            newObject.isMetric = res.data._Exercises[0].Metric
            newObject.title = res.data._Exercises[0].Title

            this.setState({
              sessionExercises: [newObject],
            })
          }
          if(count ===countOfExercises && !this.state.firstSession){
            var copyOfSessionExercises = this.state.defaultSessionExercises;
            copyOfSessionExercises.exerciseByWeight = this.state.workOutObjects[0].UsesBodyWeight;
            copyOfSessionExercises.title = this.state.workOutObjects[0].Title;
            copyOfSessionExercises.exerciseId = this.state.workOutObjects[0]._id;
            this.setState({
              sessionExercises: [copyOfSessionExercises],
              disableTheseWorkouts: [...this.state.disableTheseWorkouts,copyOfSessionExercises.title]

            })
          }
        } else {
          this.setState({
            workOuts: [],
            workOutObjects: []
          })
        }
      })

    }
    handleCriteriaClear(){

      this.setState({
        criteria:false,
        establishSubmit: false,
        sessionMessage: "",
        disableTheseWorkouts: [],
        sessionExercises: [this.state.defaultSessionExercises],
      })
    }
    hideModal(){
      this.setState({
        modalForTimerSuccess: false
      })
    }
    handleTimerModal(exNum){
      var copyOfSessionExercise = this.state.sessionExercises.slice();
      if(copyOfSessionExercise.length < exNum){
        return 'no more'
      }

      this.setState({
          sessionExercises: copyOfSessionExercise
      })
      var identifiedSessionExercise;
      for(var z =0; z < this.state.sessionExercises.length;z++){
        if(this.state.sessionExercises[z].key === exNum){
          identifiedSessionExercise = this.state.sessionExercises[z];
        }
      }
      this.setState({
        timerForExercise: identifiedSessionExercise,
        timerModal: true,
        exNum: exNum,
        exTotal: this.state.sessionExercises.length

      })
    }
    handleExerciseSessionMinus(exerciseNumber,exerciseSet){

      var CopyOfSessionExercise = this.state.sessionExercises.slice();
      for(var i = 0; i < CopyOfSessionExercise.length;i++){
        if(CopyOfSessionExercise[i].key === exerciseNumber){
          for(var m = 0; m < CopyOfSessionExercise[i].sets.length;m++){
            if(CopyOfSessionExercise[i].sets[m].key === exerciseSet){
              CopyOfSessionExercise[i].sets.splice(m,1);
              for(var x = m; x < CopyOfSessionExercise[i].sets.length;x++){
                CopyOfSessionExercise[i].sets[x].key = CopyOfSessionExercise[i].sets[x].key - 1;
              }
            }
          }
        }
      }

      this.setState({
        sessionExercises: CopyOfSessionExercise
      })
    }
    handleRemoveExercise(keyNumber){
      var arrayOfSessionExercises = this.state.sessionExercises.slice();
      var removedTitle = ""
      for(var i = 0; i < arrayOfSessionExercises.length;i++){
        if(arrayOfSessionExercises[i].key === keyNumber){
          removedTitle = arrayOfSessionExercises[i].title
          //this is where we remove this particular exercise//
          arrayOfSessionExercises.splice(i,1)
          for(var m = i; m < arrayOfSessionExercises.length;m++){
            arrayOfSessionExercises[m].key = arrayOfSessionExercises[m].key -1
          }
        }
      }
      var newArray = this.state.disableTheseWorkouts.slice();
      for(let x = 0; x < newArray.length;x++){
        if(newArray[x] === removedTitle){
          newArray.splice(x,1)
        }
      }

      this.setState({
        disableTheseWorkouts: newArray,
        currentinSession: this.state.currentinSession === 0 ? this.state.currentinSession: this.state.currentinSession -1,
        sessionExercises: arrayOfSessionExercises
      })
    }

    handleCriteriaSubmit(template,currentBodyWeight){
      function CalculateReps(originalReps,modifiedReps){
        if(modifiedReps < 0){
          if(originalReps + modifiedReps <=0){
            return 1
          } else {
            return originalReps + modifiedReps;
          }
        } else {
          return originalReps + modifiedReps;
        }
      }
      if(!this.props.params.location.sessionObject || this.props.params.location.templateObject){
        if(template === ""){
          this.setState({
            sessionMessage: "Add A Template In Template Options"
          })

        }else if(currentBodyWeight < 50 || currentBodyWeight > 400){
          this.setState({
            sessionMessage: "Bodyweight must between 50 & 400 lbs"
          })

        }else {

          axios.get('/train/criteria/'+template + '/' + this.props.payLoad._id).then((res)=>{
            return axios.get("/train/session/exercises/"+this.state.criteriaTitle + '/' + this.props.payLoad._id).then((response)=>{
              var allExercisesFromTemplate = response.data._Exercises;
              if(response.data._Exercises.length === 0){
                this.setState({
                  sessionMessage: "Add At least one exercise before starting a session",
                  quickAddExercise: true
                })
              } else {
                if(!res.data.session){
                  this.setState({
                    sessionMessage: "This is your first Session, Benchmark is auto triggered",
                    firstSession: true,
                    establishSubmit: true,
                    sessionExercises: [this.state.defaultSessionExercises],
                    benchMark:true,
                    criteriaTitle: template,
                    currentBodyWeight: currentBodyWeight,
                    criteria: true,
                  },this.handleWorkOutShow)
                } else{
                  var arrayOfExercises = res.data.session.ArrayOfExercises;
                  var exerciseTitlesSelected = []
                  // template,weight,currentBodyWeight
                  for(var x = 0; x < arrayOfExercises.length;x++){
                    for(var y = 0; y < allExercisesFromTemplate.length;y++){
                      if(arrayOfExercises[x].exerciseId === allExercisesFromTemplate[y]._id){
                        arrayOfExercises[x].isMetric = allExercisesFromTemplate[y].Metric

                        arrayOfExercises[x].exerciseByWeight = allExercisesFromTemplate[y].UsesBodyWeight
                      }
                    }
                  }
                  for(var i = 0; i < arrayOfExercises.length;i++){
                    exerciseTitlesSelected.push(arrayOfExercises[i].title)

                    if(arrayOfExercises[i].isMetric){

                      for(var m = 0; m < arrayOfExercises[i].sets.length;m++){
                        //run through the sets to increment key metrics
                        arrayOfExercises[i].sets[m].goalinlbs = arrayOfExercises[i].sets[m].res
                        arrayOfExercises[i].sets[m].goalinreps = arrayOfExercises[i].sets[m].reps
                        arrayOfExercises[i].sets[m].res = (Number(arrayOfExercises[i].sets[m].res)+Number(this.state.weight)).toString();
                        arrayOfExercises[i].sets[m].reps = CalculateReps(Number(arrayOfExercises[i].sets[m].reps),Number(this.state.reps)).toString();
                        arrayOfExercises[i].sets[m].prevDiff = arrayOfExercises[i].sets[m].difficulty;
                        arrayOfExercises[i].sets[m].difficulty = "average";

                      }

                      //run through whole array and modify
                    } else {
                      //run through the sets to increment key metrics
                      for(var z = 0; z < arrayOfExercises[i].sets.length;z++){
                        arrayOfExercises[i].sets[z].reps = arrayOfExercises[i].sets[z].reps;
                        arrayOfExercises[i].sets[z].res = arrayOfExercises[i].sets[z].res;
                        arrayOfExercises[i].sets[z].goalinreps =arrayOfExercises[i].sets[z].reps;
                        arrayOfExercises[i].sets[z].goalinlbs = arrayOfExercises[i].sets[z].res;
                        arrayOfExercises[i].sets[z].prevDiff = arrayOfExercises[i].sets[z].difficulty;
                        arrayOfExercises[i].sets[z].difficulty = "average";
                      }

                    }

                    this.setState({
                      exercisesCurrentlySelect:exerciseTitlesSelected,
                      disableTheseWorkouts: exerciseTitlesSelected,
                      sessionExercises: arrayOfExercises,
                      establishSubmit: true,
                      criteriaTitle: template,
                      criteria: true,
                      currentBodyWeight: currentBodyWeight,
                      sessionMessage: "Last Session Was--" + this.getDateDifference(res.data.session.createdAt)
                    },this.handleWorkOutShow)


                  }
                }
              }
            })
          })
        }
      } else {
        var exerciseTitlesSelected = [];
        const {ArrayOfExercises} = this.props.params.location.sessionObject
        for(var i = 0; i < ArrayOfExercises.length;i++){
          exerciseTitlesSelected.push(ArrayOfExercises[i].title)
        }
        if(template === ""){
          this.setState({
            sessionMessage: "Add A Template In Template Options"
          })

        }else if(currentBodyWeight < 50 || currentBodyWeight > 400){
          this.setState({
            sessionMessage: "Bodyweight must between 50 & 400 lbs"
          })

        } else {
          this.setState({

            exercisesCurrentlySelect:exerciseTitlesSelected,
            disableTheseWorkouts: exerciseTitlesSelected,
            sessionExercises: this.props.params.location.sessionObject.ArrayOfExercises,
            establishSubmit: true,
            criteria: true,
            sessionMessage: "Past Template Loaded, Edit Any Fields and Update"
          },this.handleWorkOutShow)
        }
      }
    }
    handleAddingSetOfExercise(exNum){
      var copyOfArrayExercise = this.state.sessionExercises.slice();

      for(var i = 0; i < copyOfArrayExercise.length;i++){
        if(exNum === copyOfArrayExercise[i].key){
          var newObject = Object.assign({},this.state.defaultObject);
          newObject.reps = copyOfArrayExercise[i].sets[copyOfArrayExercise[i].sets.length -1].reps;
          newObject.res = copyOfArrayExercise[i].sets[copyOfArrayExercise[i].sets.length -1].res;
          newObject.key = copyOfArrayExercise[i].sets.length + 1;
          copyOfArrayExercise[i].sets.push(newObject)
        }
      }
      this.setState({
        sessionExercises: copyOfArrayExercise
      })
    }
    handleAddingGroupSet(){
      var reduceWorkouts = this.state.workOuts.slice();
      var reduceWorkoutObjects = this.state.workOutObjects.slice();
      var disableTheseWorkouts = [];

      for(var z = 0; z < this.state.sessionExercises.length;z++){
        for(var x = 0; x < reduceWorkouts.length;x++){
          if(this.state.sessionExercises[z].title === reduceWorkouts[x]){
            disableTheseWorkouts.push(reduceWorkouts[x])
            reduceWorkouts.splice(x,1)
          }
        }
      }

      var currentCount = 1;
      var newSesh = Object.assign({},this.state.defaultSessionExercises);

      newSesh.title = reduceWorkouts.splice(0,1)[0];
      for(var m = 0; m < reduceWorkoutObjects.length;m++){
        if(newSesh.title === reduceWorkoutObjects[m].Title){
          var singleObject = reduceWorkoutObjects.splice(m,1)[0];
          newSesh.exerciseId = singleObject._id;
          newSesh.exerciseByWeight = singleObject.UsesBodyWeight
          newSesh.isMetric =  singleObject.Metric;
        }
      }
      disableTheseWorkouts.push(newSesh.title);
      var currentArrayOfSession = this.state.sessionExercises.slice()
      for(var i = 0; i < currentArrayOfSession.length;i++){

        currentCount++;
      }
      newSesh.key = currentCount;
      currentArrayOfSession.push(newSesh);
      this.setState({
        sessionExercises: currentArrayOfSession,
        disableTheseWorkouts: disableTheseWorkouts,
        currentinSession: this.state.currentinSession + 1,
        defaultSessionExercises: {submitErrors: [], key:1, strength_to_weight:"",strength:"", isMetric: false, repTakes:'7', restBetweenReps:"8", restBetweenSets:"2", restBetweenExercises:"2", exerciseId:"", title:"--select--", sets:[{submitErrors: [], prevDiff:"",key:1, goalinlbs:"", goalinreps:"",reps:"7",res:"0",difficulty:"average"}]},

        })
      }
        handleChangeInput(name,value,currentTitle){


          //name is the input name + ex# and set# aka: 1title1
          //value is the value of the input such as "Wide Pinch"
          var exerciseNumber = "";
          var exerciseInput = "";
          var exerciseSet = "";
          var triggeredStartOfTitle = false;
          var CopyOfSessionExercise = this.state.sessionExercises.slice();

          for(let i = 0; i < name.length;i++){
            if(isNaN(name[i]) === false && triggeredStartOfTitle===false){
              exerciseNumber += name[i];
            }
            if(isNaN(name[i]) === true){
              triggeredStartOfTitle = true;
              exerciseInput += name[i];
            }
            if(isNaN(name[i]) === false && triggeredStartOfTitle ===true){
              exerciseSet += name[i];
            }
          }
          for(let i = 0; i < CopyOfSessionExercise.length;i++){

            if(Number(CopyOfSessionExercise[i].key) === Number(exerciseNumber)){
              if(exerciseSet ===""){
                CopyOfSessionExercise[i][exerciseInput] = value;
                if(exerciseInput === "title"){
                  let exerciseId;
                  let exerciseByWeight;
                  for(var r = 0; r < this.state.workOutObjects.length;r++){
                    if(this.state.workOutObjects[r].Title === value){
                      exerciseId = this.state.workOutObjects[r]._id
                      exerciseByWeight = this.state.workOutObjects[r].UsesBodyWeight
                    }
                  }
                  CopyOfSessionExercise[i].exerciseId = exerciseId
                  CopyOfSessionExercise[i].exerciseByWeight = exerciseByWeight
                  var checkIsMetric = this.checkExerciseMetric(value);
                  if(checkIsMetric){
                    CopyOfSessionExercise[i].isMetric = true
                  } else{
                    CopyOfSessionExercise[i].isMetric = false

                  }
                }
              } else {
                for(var m = 0; m < CopyOfSessionExercise[i].sets.length;m++){

                  if( CopyOfSessionExercise[i].sets[m].key === Number(exerciseSet)){
                    CopyOfSessionExercise[i].sets[m][exerciseInput] = value;
                  }
                }
              }
              this.setState({
                timerForExercise: CopyOfSessionExercise[i]
              })
            }

            var newArray = this.state.disableTheseWorkouts.slice()
            for(var q = 0; q < newArray.length;q++){
              if(newArray[q] === currentTitle){
                newArray.splice(q,1)
              }

            }
            newArray.push(value)
            this.setState({
              disableTheseWorkouts: newArray,
              sessionExercises: CopyOfSessionExercise,
              defaultSessionExercises: {submitErrors: [], key:1, strength_to_weight:"",strength:"", isMetric: false, repTakes:'7', restBetweenReps:"8", restBetweenSets:"2", restBetweenExercises:"2", exerciseId:"", title:"--select--", sets:[{submitErrors: [], prevDiff:"",key:1, goalinlbs:"", goalinreps:"",reps:"7",res:"0",difficulty:"average"}]},

              })
            }
            }
            handleSubmit(e){
              //bookEnd
              //this is right before submitting session, we need to check validations.
              //First Off, check if there is at least one exercise in session to save.
              //Second Off, the sessions added, it is required to have Goal(lbs) Goal(reps);
              //for each training set, and exercise Title selected.  if not, remove them.

              //----------------------

              this.strengthToWeightUpdate();

            }

            render(){

              var results = {
                pathname: '/session/results',singleSessionObjectArray: this.state.successSessionArray
              }

              return(
                <div>
                  {
                    !this.state.quickAddTemplate &&
                      <Grid>
                        {
                          this.state.openExerciseDetails &&
                            <Modal show = {true}>
                              <Modal.Header>
                                <h3 style={{textAlign:'center'}}>Read Only Details</h3>
                                <Button style={{float:'right'}} onClick={()=>{this.setState({openExerciseDetails:false})}}>x</Button>
                              </Modal.Header>
                              <Modal.Body>
                                <ExerciseReadOnly
                                  exerciseDetails = {this.state.specificExercise}
                                  userId = {this.props.payLoad._id}
                                />
                              </Modal.Body>
                            </Modal>
                        }
                        {
                          this.state.triggerExercise &&
                            <AddExercise payLoad = {this.props.payLoad._id} goBack = {this.handleExerciseReturn}/>

                        }
                        {
                          this.state.redirectToSuccess &&
                            <Redirect to={results} />
                        }
                        {
                          this.state.redirectToEdit &&
                            <Redirect to='/sessions' />
                        }
                        {
                          this.state.redirectToPerformance &&
                            <Redirect to='/progress' />
                        }
                        {

                          !this.state.triggerExercise &&
                            <div>
                              {

                                this.state.timerModal &&
                                  <ParentTimer
                                    estimatedTime = {this.state.estimatedTime}
                                    exNum = {this.state.exNum}
                                    exTotal = {this.state.exTotal}
                                    convertSecondsToTimeString = {this.convertSecondsToTimeString}
                                    onTickClock = {this.handleTickClock}
                                    timeInSession = {this.state.timeInSession}
                                    nextExerciseInfo = {this.state.sessionExercises[this.state.timerForExercise.key] ? this.state.sessionExercises[this.state.timerForExercise.key]:""}
                                    countOfExercises = {this.state.sessionExercises.length}
                                    onInputChange={this.handleChangeInput}
                                    onCheckInput = {this.handleCheckValue}
                                    selectedExercise ={this.state.timerForExercise}
                                    onClose={()=>{this.setState({timerModal:false})}}
                                    nextExercise = {this.handleTimerModal}
                                    onSubmit = {this.handleSubmit}
                                  />
                              }
                              <Row className = "show-grid">
                                { !this.state.establishSubmit &&
                                  <CriteriaHeader
                                    //anchor
                                    onRemoveSession = {this.handleRemoveSession}
                                    onQuickAddExercise = {this.handleExerciseOnFly}
                                    sessionEditObject = {this.state.sessionEditObject}
                                    benchMark = {this.state.benchMark}
                                    estimatedTime = {this.state.estimatedTime}
                                    onBenchmarkChange = {this.handleBenchmark}
                                    quickAddExercise = {this.state.quickAddExercise}
                                    onQuickAddTemplate = {this.handleQuickAddTemplate}
                                    templateOptions = {this.state.templateOptions}
                                    onTemplateChange = {this.handleTemplateChange}
                                    criteriaTitle ={this.state.criteriaTitle}
                                    currentBodyWeight={this.state.currentBodyWeight}
                                    criteriaOptions = {this.state.criteriaOptions}
                                    criteria = {this.state.criteria}
                                    onCriteriaClear ={this.handleCriteriaClear}
                                    onCriteriaSubmit = {this.handleCriteriaSubmit}
                                    sessionMessage = {this.state.sessionMessage}
                                    onSubmit = {this.handleSubmit}
                                    establishSubmit = {this.state.establishSubmit}
                                    weight = {this.state.weight}
                                    reps = {this.state.reps}
                                    onWeightChange = {this.handleWeightChange}
                                  />
                                }
                              </Row>

                              {
                                this.state.establishSubmit &&

                                  <div>

                                    <TrainSet
                                      onQuickAddExercise = {this.handleQuickAddExercise}
                                      exercisesCurrentlySelect = {this.state.exercisesCurrentlySelect}
                                      moveUp = {this.handleMoveUp}
                                      moveDown = {this.handleMoveDown}
                                      placementInSession = {this.state.currentinSession+1}
                                      howManyInSession = {this.state.sessionExercises.length}
                                      onCheckValue = {this.handleCheckValue}
                                      workOutObjects = {this.state.workOutObjects}
                                      disableTheseWorkouts = {this.state.disableTheseWorkouts}
                                      onExerciseOnFly = {this.handleExerciseOnFly}
                                      onNewWorkOut = {this.handleWorkOutShow}
                                      timerModal = {this.handleTimerModal}
                                      onRemoveExercise = {this.handleRemoveExercise}
                                      onPlusClick = {this.handleAddingSetOfExercise}
                                      onMinusClick = {this.handleExerciseSessionMinus}
                                      workOuts = {this.state.workOuts}
                                      onChangeInput = {this.handleChangeInput}
                                      key={this.state.currentinSession}
                                      sessionExercises = {this.state.sessionExercises[this.state.currentinSession]}
                                      allSessionExercisesLength = {this.state.sessionExercises.length}
                                      onOpenExerciseDetails = {this.handleOpenExerciseDetails}
                                    />


                                    <Row className = "show-grid">
                                      <Col xs={2}>
                                        <Icon
                                          size="2x"
                                          style={this.state.currentinSession >0 ? {backgroundColor:'yellow'}:{backgroundColor:'yellow',opacity:'.3'}}
                                          name="arrow-circle-left"
                                          onClick={()=>{
                                            if(this.state.currentinSession > 0){
                                              this.setState({
                                                currentinSession: this.state.currentinSession -1
                                              })

                                            }
                                          }}
                                        >

                                        </Icon>

                                      </Col>
                                      <Col xsOffset={1} xs={6} >
                                        <Button

                                          style={{width:'100%', backgroundColor:'black',color:'green'}}
                                          onClick={()=>{this.handleTimerModal(this.state.currentinSession + 1)}}>
                                          Begin
                                        </Button>
                                      </Col>
                                      <Col xs={2} xsOffset={1}>
                                        <Icon
                                          size="2x"
                                          style={this.state.currentinSession+1 == this.state.sessionExercises.length && this.state.workOutObjects.length == this.state.sessionExercises.length ? {backgroundColor:'green',opacity:'.3'}:{backgroundColor:'green'}}
                                          name="arrow-circle-right"
                                          onClick={()=>{

                                            if(this.state.currentinSession+1 !== this.state.sessionExercises.length){
                                              this.setState({
                                                currentinSession: this.state.currentinSession +1
                                              })
                                            } else {

                                              if(this.state.workOutObjects.length === this.state.sessionExercises.length && this.state.sessionExercises.length !== 0){

                                              } else {
                                                this.handleAddingGroupSet()
                                              }
                                            }
                                          }}
                                        >

                                        </Icon>
                                      </Col>
                                      <Col xs={12} sm={4} md={4}>

                                        <Button
                                          style={{width:'100%', marginTop:'10px'}}

                                          bsStyle="success"
                                          onClick={this.handleSubmit}
                                          disabled={this.state.sessionExercises.length === 0}
                                        >
                                          Submit Session
                                        </Button>
                                      </Col>
                                      <Col xs={12} sm={4} md={4}>

                                        <Button
                                          disabled = {this.state.sessionExercises.length == 1}
                                          bsStyle="danger"
                                          style={{width:'100%', marginTop:'10px'}}
                                          onClick={()=>{this.handleRemoveExercise(this.state.currentinSession + 1)}}
                                        >Remove Exercise</Button>

                                      </Col>


                                      <Col xs={12} sm={4} md={4}>
                                        <Button
                                          style={{width:'100%', marginTop:'10px'}}
                                          bsStyle="warning"
                                          onClick={this.handleCriteriaClear}
                                        >
                                          Reset
                                        </Button>
                                      </Col>



                                    </Row>
                          </div>
                      }
                    </div>
                }

              </Grid>
          }
          {
            this.state.quickAddTemplate &&
              <TemplateAdd
                payLoad = {this.props.payLoad}
                returnToSession = {this.returnToSession}
              />
          }
        </div>
            )
          }
          }

          export default TrainingSession;
