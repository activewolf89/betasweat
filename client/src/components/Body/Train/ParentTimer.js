  import React,{Component} from "react";
  import {Modal,Grid,Row,Col} from 'react-bootstrap';
  import TimerHeader from './TimerHeader.js';
  import TimerBody from './TimerBody.js';
  import TimerFooter from './TimerFooter.js';
  import PropTypes from 'prop-types';
  class ParentTimer extends Component{
    constructor(props){
      super(props);
      this.state = {
        //state
        fillOutResults: true,
        currentSetKey: 1,
        repTakes: Number(this.props.selectedExercise.repTakes),
        title: this.props.selectedExercise.title,
        totalSetsInExercise: Number(this.props.selectedExercise.sets.length),
        restBetweenReps: Number(this.props.selectedExercise.restBetweenReps),
        restBetweenSets: Number(this.props.selectedExercise.restBetweenSets) * 60,
        restBetweenExercises: Number(this.props.selectedExercise.restBetweenExercises) * 60,
        repGoal: Number(this.props.selectedExercise.sets[0].repGoal),
        startRepInterval: false,
        //timer actions
        timeToGetSettled: 8,
        timeString: "00:00:08",
        timeToCountTowards: "",
        timeInSession: this.props.timeInSession,
        started: "",
        notificationTimer: 0,
        rest: false,
        stopCount: 0,
        disableStart: false,
        disableStop: false,
        //
        initiateSubmit: false,
        timerCountForRep: "",
        stopHappened: false,
        stopTimer: false,
        currRes: this.props.selectedExercise.sets[0].res,
        currRep: this.props.selectedExercise.sets[0].reps,
        difficulty: this.props.selectedExercise.sets[0].difficulty,
        originalReps: this.props.selectedExercise.sets[0].reps,
        indexPoint: 0,
        //head
        message: "Click Start When Ready To Begin",
        repCount: 0,
        //body
        bodyColor: {background:'gray'},
        tickerForNextExercise: false,
        seemlessTransition: false

      }
      //bind
      this.setCountDownTimer = this.setCountDownTimer.bind(this);
      this.startTimer = this.startTimer.bind(this);
      this.stopTimer = this.stopTimer.bind(this);
      this.resetTimer = this.resetTimer.bind(this);
      this.updateCountdown = this.updateCountdown.bind(this);
      this.handleNextSet = this.handleNextSet.bind(this);
      this.handleBackSet = this.handleBackSet.bind(this);
      this.tickClock = this.tickClock.bind(this);
      this.initiateRep = this.initiateRep.bind(this);
      this.resetNew = this.resetNew.bind(this);
      this.handleNextExercise = this.handleNextExercise.bind(this);
      this.handleShutDownIntervals = this.handleShutDownIntervals.bind(this);
      this.triggerNextExerciseCountdown = this.triggerNextExerciseCountdown.bind(this);
      this.handleBackExercise = this.handleBackExercise.bind(this);
      this.resetLastSet = this.resetLastSet.bind(this);
    }
    componentWillReceiveProps(nextProps){
      // restBetweenExercises: Number(this.props.selectedExercise.restBetweenExercises) * 60,

      //when props come in after we update how many resistance and reps
      //we will push this into the footer so it will show accurately
      //this is based off the current indexPoint we are in, once next set is pressed move it up or back
      if(nextProps.selectedExercise.sets.length -1 >= this.state.indexPoint){
        this.setState({
          currRes: nextProps.selectedExercise.sets[this.state.indexPoint].res,
          currRep: nextProps.selectedExercise.sets[this.state.indexPoint].reps,
          difficulty: nextProps.selectedExercise.sets[this.state.indexPoint].difficulty,
          restBetweenSets: Number(nextProps.selectedExercise.restBetweenSets) * 60,
          restBetweenExercises: Number(nextProps.selectedExercise.restBetweenExercises) * 60,

        })
      }

    }
    resetLastSet(){
      this.setState({
        //state
        currentSetKey: Number(this.props.selectedExercise.sets.length),
        tickerForNextExercise: false,
        seemlessTransition: false,
        fillOutResults: true,
        nextExerciseInfo: this.props.nextExercise,
        repTakes: Number(this.props.selectedExercise.repTakes),
        title: this.props.selectedExercise.title,
        totalSetsInExercise: Number(this.props.selectedExercise.sets.length),
        restBetweenReps: Number(this.props.selectedExercise.restBetweenReps),
        restBetweenSets: Number(this.props.selectedExercise.restBetweenSets) * 60,
        repGoal: Number(this.props.selectedExercise.sets[this.props.selectedExercise.sets.length-1].repGoal),
        startRepInterval: false,
        //timer actions
        timeToGetSettled: 8,
        timeString: "00:00:08",
        timeToCountTowards: "",
        started: "",
        notificationTimer: 0,
        rest: false,
        stopCount: 0,
        disableStart: false,
        disableStop: false,
        //
        timerCountForRep: "",
        stopHappened: false,
        stopTimer: false,
        currRes: this.props.selectedExercise.sets[this.props.selectedExercise.sets.length-1].res,
        currRep: this.props.selectedExercise.sets[this.props.selectedExercise.sets.length-1].reps,
        difficulty: this.props.selectedExercise.sets[this.props.selectedExercise.sets.length-1].difficulty,
        indexPoint:  Number(this.props.selectedExercise.sets.length -1),
        initiateSubmit: false,
        //head
        message: "Fill Out Results Below Your Next Exercise Begins In:",
        repCount: 0,
        //body
        bodyColor: {background:'gray'},
})
    }
    handleBackExercise(){
      this.handleShutDownIntervals()
      this.props.nextExercise(Number(this.props.selectedExercise.key)-1);

      this.setState({
        startRepInterval: false,
        seemlessTransition: false,
        initiateSubmit: false,
        disableStart: false,
        notificationTimer: 0,
        timerCountForRep: "",
        rest: false,
        stopCount: 0,
        stopHappened: false,
        restBetweenReps: Number(this.props.selectedExercise.restBetweenReps),
        timeString: "00:00:08",
        message: "Click Start When Ready To Begin",
        bodyColor: {background: 'gray'},
        indexPoint: 0,
      })
    }
    triggerNextExerciseCountdown(){
      if(this.state.restBetweenExercises){
        var setTransitionId = setInterval(this.setCountDownTimer,1000)
        var time = new Date();
        time.setSeconds(time.getSeconds()+this.state.restBetweenExercises)
        this.setState({
          disableStop: true,
          setTransitionId: setTransitionId,
          timeToCountTowards: time,
          message: `${this.props.nextExerciseInfo.title} at ${this.props.nextExerciseInfo.sets[0].res} resistance will begin in:`,
          timeString: "00:00:00",
          fillOutResults: true,
          tickerForNextExercise: true,
          seemlessTransition: true
        })
      }else{
        this.handleNextExercise()

      }
    }
    handleShutDownIntervals(){
      clearInterval(this.state.setTransitionId)
      clearInterval(this.state.timeStopHasHappened)
      clearInterval(this.state.repStarted)
      clearInterval(this.state.started)
      clearInterval(this.state.anotherStarted)
    }
    handleNextExercise(forced){
      this.handleShutDownIntervals()

      if(this.props.nextExercise(Number(this.props.selectedExercise.key)+1)==="no more") {
        //this means that the function ran, but it returned false meaning
        //we are at the end of the session
        this.setState({
          message: "Finished--Submit your session",
          initiateSubmit: true,
          timeString: "00:00:00",
          fillOutResults: true,
          seemlessTransition: false

        })
      } else {
        if(forced){
          this.setState({
            seemlessTransition: false
          }, ()=>{
            this.resetNew();
          })
        } else {
          this.resetNew();
        }
    }

    }
    resetNew(){
      this.setState({
        //state
        currentSetKey: 1,
        tickerForNextExercise: false,
        fillOutResults: true,
        repTakes: Number(this.props.selectedExercise.repTakes),
        title: this.props.selectedExercise.title,
        totalSetsInExercise: Number(this.props.selectedExercise.sets.length),
        restBetweenReps: Number(this.props.selectedExercise.restBetweenReps),
        restBetweenSets: Number(this.props.selectedExercise.restBetweenSets) * 60,
        repGoal: Number(this.props.selectedExercise.sets[0].repGoal),
        startRepInterval: false,
        //timer actions
        timeToGetSettled: 8,
        timeString: "00:00:08",
        timeToCountTowards: "",
        started: "",
        notificationTimer: 0,
        rest: false,
        stopCount: 0,
        disableStart: false,
        disableStop: false,
        //
        timerCountForRep: "",
        stopHappened: false,
        stopTimer: false,
        currRes: this.props.selectedExercise.sets[0].res,
        currRep: this.props.selectedExercise.sets[0].reps,
        difficulty: this.props.selectedExercise.sets[0].difficulty,
        indexPoint: 0,
        initiateSubmit: false,
        repCount: 0,
},()=>{
  if(this.state.seemlessTransition){
    this.startTimer()
  } else {
    this.setState({
      message: "Click Start When Ready To Begin",
      bodyColor: {background:'gray'},

    })
  }
})
    }
    setCountDownTimer(){
      var currentTime = new Date();
      this.props.onTickClock()
      if(currentTime >= this.state.timeToCountTowards && this.state.timeString === "00:00:00"){
        //trigger the call to the next set
        //clearInterval saved within the variable setTransitionId
        clearInterval(this.state.setTransitionId)
        if(!this.state.tickerForNextExercise){
          this.handleNextSet()

        }else{
          this.handleNextExercise()
        }
      } else {

      var timeElapsed = Math.round((this.state.timeToCountTowards - currentTime)/1000) * 1000;
      var stringOfTime = this.tickClock(timeElapsed);
      this.setState({
        timeString: stringOfTime
      })
    }
    }
    initiateRep(){
      //third step
//repTakes is how long one rep typically takes.
      //tickClock is the function that inputs the difference and spits back what we want to show-grid
      //repTakes is the second it takes for one rep to be done.
      var currentTime = new Date();
      currentTime.setSeconds(currentTime.getSeconds());
      this.props.onTickClock()

      if(this.state.repCount >= this.state.currRep && this.state.timeString === "00:00:00"){

          clearInterval(this.state.repStarted)
          clearInterval(this.state.started)

          //after
          //after reps are finished within set, move onto next set via restBetweenSets
          //next set will auto load until we are on the final set, in that case once
          //the set ends, message declares we are done with desired sets and new button
          //move onto next problem begins.
          //--------//
          //set interval every second dropping the rest between set count.
          // difference={this.state.totalSetsInExercise - this.state.currentSetKey}
          //if this value --^ is > 0, move onto next set, if 0, check if theres another
          //exercise(if there is another exercise, allow to traverse through, if not submit)
          if(this.state.totalSetsInExercise - this.state.currentSetKey > 0){
            //move onto next set
            var setTransitionId = setInterval(this.setCountDownTimer,1000)
            var time = new Date();
            time.setSeconds(time.getSeconds()+this.state.restBetweenSets)
            this.setState({
              disableStop: false,
              setTransitionId: setTransitionId,
              timeToCountTowards: time,
              message: `Next Set At ${this.props.selectedExercise.sets[this.state.indexPoint +1].res} Resistance Begins In:`,
              timeString: "00:00:00",
              fillOutResults: true
            })
          } else {

            if(this.props.countOfExercises === this.props.selectedExercise.key && this.state.totalSetsInExercise === this.state.currentSetKey){
              this.setState({
                message: "Finished--Submit your session",
                fillOutResults: true,
                seemlessTransition: false
              })
            }else {
              this.triggerNextExerciseCountdown()

            }

          }

      } else {


        if(this.state.notificationTimer  === this.state.repTakes && !this.state.rest && this.state.timeString !== "00:00:00"){
          //pin
          this.setState({
            rest:  true,
            bodyColor: {background: 'lightBlue'},
            message: "Rest!",
            notificationTimer: 0,

          })
        }
        if(this.state.notificationTimer  === this.state.restBetweenReps && this.state.rest && this.state.timeString !== "00:00:00"){
          this.setState({
            rest:  false,
            bodyColor: {background: 'green'},
            message: "Go!",
            notificationTimer: 0,
            repCount: this.state.repCount + 1
          })

        }
        if(this.state.timeString ==="00:00:00"){
          this.setState({
            repCount: this.state.repCount + 1
          })
        }
      var timeElapsed = Math.round((this.state.timeToCountTowards - currentTime)/1000) * 1000;
      var stringOfTime = this.tickClock(timeElapsed);

      this.setState({
        timeString: this.state.timeString === "00:00:00" ? "00:00:00": stringOfTime,
        notificationTimer: this.state.notificationTimer + 1
      })
    }
    }
    stopTimer(){
      clearInterval(this.state.repStarted)
      clearInterval(this.state.started)
      var savedColor = this.state.bodyColor;
      var savedMessage = this.state.message;
      var timeStopHasHappened = setInterval( ()=>{
        this.setState({
          stopCount: this.state.stopCount + 1
        })
      }
        ,1000)
      this.setState({
        fillOutResults: this.state.startRepInterval ? false: true,
        timeStopHasHappened: timeStopHasHappened,
        savedTimeToCountTowards: this.state.timeToCountTowards,
        stopHappened: true,
        savedMessage: savedMessage,
        message: 'Stopped!',
        savedColor: savedColor,
        bodyColor: {background:'red'},
        disableStart: false
      })
    }
    resetTimer(){
      clearInterval(this.state.repStarted);
      clearInterval(this.state.started);
      this.setState({
        repTakes: Number(this.props.selectedExercise.repTakes),
        totalSetsInExercise: Number(this.props.selectedExercise.sets.length),
        fillOutResults: true,
        startRepInterval: false,
        seemlessTransition: false,
        //timer actions
        timeString: "00:00:08",
        timeToCountTowards: "",
        started: "",
        notificationTimer: 0,
        rest: false,
        stopCount: 0,
        disableStart: false,
        disableStop: false,
        //
        timerCountForRep: "",
        stopHappened: false,
        stopTimer: false,
        currRes: this.props.selectedExercise.sets[this.state.indexPoint].res,
        currRep: this.props.selectedExercise.sets[this.state.indexPoint].reps,
        difficulty: this.props.selectedExercise.sets[this.state.indexPoint].difficulty,
        repGoal: Number(this.props.selectedExercise.sets[this.state.indexPoint].repGoal),
        //head
        repCount: 0,
        //body
      },()=>{
        if(this.state.seemlessTransition){
          this.startTimer();
        } else {
          this.setState({
            message: "Click Start When Ready To Begin",
            bodyColor: {background:'gray'},

          })
        }
      })
    }
    startTimer(){
      //first step
      //timer runs first during load
      if(!this.state.stopHappened){
        var time = new Date();
        time.setSeconds(time.getSeconds()+Number(this.state.timeToGetSettled));

        var started = setInterval(this.updateCountdown,1000);
      this.setState({
        savedTimeToCountTowards: null,
        fillOutResults: false,
        disableStart: true,
        timeToCountTowards: time,
        message: "Your Exercise Will Begin In",
        bodyColor: {background: "gray"},
        started:started
      })
    } else {
      //if stop happens during load and start is pressed
      clearInterval(this.state.timeStopHasHappened)

      var anotherCurrentTime = this.state.savedTimeToCountTowards
      var addTime = Number(this.state.stopCount)
      anotherCurrentTime.setSeconds(anotherCurrentTime.getSeconds()+addTime + 1)
      if(this.state.startRepInterval){
        clearInterval(this.state.started)
        this.setState({
          stopCount: 0,
          disableStart: true,
          fillOutResults: false,
          savedTimeToCountTowards: null,
          timeToCountTowards: anotherCurrentTime,
          message: this.state.savedMessage,
          bodyColor: this.state.savedColor,

        },()=>{

          var repStarted = setInterval(this.initiateRep,1000);
          this.setState({
            repStarted: repStarted

          })

        })
      } else {

        var anotherStarted = setInterval(this.updateCountdown,1000);

      //time is now 10 seconds ahead
    //setting variable to a set interval to trigger ever 1ms
    //book
    this.setState({
      savedTimeToCountTowards: null,
      stopCount: 0,
      disableStart: true,
      fillOutResults: false,
      timeToCountTowards: anotherCurrentTime,
      message: this.state.savedMessage,
      started:anotherStarted,
      bodyColor: this.state.savedColor,
    })
  }
    }

  }
    updateCountdown(){
      //second step
      //pin
      var currentTime = new Date();
      this.props.onTickClock()
      if(this.state.timeString === "00:00:00"){
        clearInterval(this.state.started)
        var time = new Date();
        var addTime = ((Number(this.state.repTakes)+Number(this.state.restBetweenReps))* Number(this.state.currRep)-Number(this.state.restBetweenReps))
        time.setSeconds(time.getSeconds()+addTime)
        var elapsedTime = time - currentTime;
        var difference = this.tickClock(elapsedTime)
        this.setState({
          startRepInterval: true,
          timeToCountTowards: time,
          message: "Go!",
          bodyColor: {background:'green'},
          timeString: difference,
          repCount: this.state.repCount + 1

        },()=>{
          var repStarted = setInterval(this.initiateRep,1000);
          this.setState({
            repStarted: repStarted

          })
        })
      } else {
        //current time an subtract from time to start

      //difference between two times
      var timeElapsed = Math.round((this.state.timeToCountTowards - currentTime)/1000) * 1000;

      //timeElapsed is a variable that is the # between two date objects
    var stringOfTime = this.tickClock(timeElapsed);
    this.setState({
      timeString: stringOfTime
    })
    }
  }
  tickClock(time){
      function pad(num, size) {
        var s = "0000" + num;
        return s.substr(s.length - size);
      }
      var h,m,s = 0;
      var newTime = '';

      	h = Math.floor( time / (60 * 60 * 1000) );
      	time = time % (60 * 60 * 1000);
      	m = Math.floor( time / (60 * 1000) );
      	time = time % (60 * 1000);
      	s = Math.floor( time / 1000 );

      	newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) ;
      	return newTime;

  }


    handleBackSet(){
      this.handleShutDownIntervals()

      this.setState({
        startRepInterval: false,
        seemlessTransition: false,
        initiateSubmit: false,
        disableStart: false,
        notificationTimer: 0,
        timerCountForRep: "",
        rest: false,
        stopCount: 0,
        stopHappened: false,
        restBetweenReps: Number(this.props.selectedExercise.restBetweenReps),
        timeString: "00:00:08",
        message: "Click Start When Ready To Begin",
        bodyColor: {background: 'gray'},
        indexPoint: this.state.indexPoint -1,
        currRes: this.props.selectedExercise.sets[this.state.indexPoint -1].res,
        currRep: this.props.selectedExercise.sets[this.state.indexPoint -1].reps,
        difficulty: this.props.selectedExercise.sets[this.state.indexPoint -1].difficulty,
        currentSetKey: this.state.currentSetKey - 1,
        repGoal: Number(this.props.selectedExercise.sets[this.state.indexPoint -1].repGoal),
      })
    }
    handleNextSet(forced){
      this.handleShutDownIntervals()


      this.setState({
        stopHappened: false,
        notificationTimer: 0,
        disableStart: false,
        startRepInterval: false,
        seemlessTransition: forced ? false: true,
        timerCountForRep: "",
        rest: false,
        stopCount: 0,
        restBetweenReps: Number(this.props.selectedExercise.restBetweenReps),
        timeString: "00:00:08",
        bodyColor: {background:'gray'},
        indexPoint: this.state.indexPoint + 1,
        repCount: 0,
        currRes: this.props.selectedExercise.sets[this.state.indexPoint +1].res,
        currRep: this.props.selectedExercise.sets[this.state.indexPoint +1].reps,
        currentSetKey: this.state.currentSetKey + 1,
        difficulty: this.props.selectedExercise.sets[this.state.indexPoint +1].difficulty,
        repGoal: Number(this.props.selectedExercise.sets[this.state.indexPoint +1].repGoal),
        disableStop: false,
        tickerForNextExercise: false,

      },()=>{
        if(this.state.seemlessTransition){
          this.setState({
            message: "Your Exercise Will Begin In",

          },()=>{
            this.startTimer()
          })
        } else {
          this.setState({
            message: "Click Start When Ready To Begin",

          })
        }
      })

    }

    render(){
      return (
        <Modal show={true}>
          <Modal.Header>
            <TimerHeader
              onClose={this.props.onClose}
              shutDownIntervals = {this.handleShutDownIntervals}
              bodyColor = {this.state.bodyColor}
              message = {this.state.message}
              title = {this.state.title}
              estimatedTime = {this.props.estimatedTime}
              timeInSession = {this.props.timeInSession}
              convertSecondsToTimeString = {this.props.convertSecondsToTimeString}
              bodyColor = {this.state.bodyColor}
            />

          </Modal.Header>
          <Modal.Body style={this.state.bodyColor}>
            <TimerBody
              exNum = {this.props.exNum}
              exTotal = {this.props.exTotal}
              bodyColor = {this.state.bodyColor}

              currentCount = {this.state.currentSetKey}
              totalCount = {this.state.totalSetsInExercise}
              disableStart = {this.state.disableStart}
              disableStop = {this.state.disableStop}
              stopHappened = {this.state.stopHappened}
              onStart ={this.startTimer}
              onStop ={this.stopTimer}
              onReset ={this.resetTimer}
              timeString = {this.state.timeString}
              bodyColor = {this.state.bodyColor}
              currRep ={this.state.currRep}
              repCount = {this.state.repCount}
              rest = {this.state.rest}
              durationOfRest = {this.state.restBetweenReps - this.state.notificationTimer}
              durationOfExercise = {this.state.repTakes - this.state.notificationTimer}



            />
          </Modal.Body>

          <Modal.Footer >
            <TimerFooter
              onCheckInput = {this.props.onCheckInput}
              exerciseNumber={this.props.selectedExercise.key}
              totalSetsInExercise = {this.state.totalSetsInExercise}
              countOfExercises = {this.props.countOfExercises}
              exerciseSetNumber = {this.state.currentSetKey}
              onBackExercise = {this.handleBackExercise}
              onShutDownIntervals = {this.handleShutDownIntervals}
              fillOutResults = {this.state.fillOutResults}
              onNextExercise = {this.handleNextExercise}
              onSubmit = {this.props.onSubmit}
              nextSet = {this.handleNextSet}
              backSet = {this.handleBackSet}
              difference={this.state.totalSetsInExercise - this.state.currentSetKey}
              onClose={this.props.onClose}
              initiateSubmit = {this.state.initiateSubmit}
              currRep={this.state.currRep}
              currRes={this.state.currRes}
              difficulty = {this.state.difficulty}
              onInputChange = {this.props.onInputChange}

            />
          </Modal.Footer>

        </Modal>
          )
          }
          }
          ParentTimer.propTypes = {
            onClose: PropTypes.func.isRequired,
            estimatedTime: PropTypes.string.isRequired,
            convertSecondsToTimeString: PropTypes.func.isRequired,
            onTickClock: PropTypes.func.isRequired,
            countOfExercises: PropTypes.number.isRequired,
            selectedExercise: PropTypes.object.isRequired,
            onInputChange: PropTypes.func.isRequired,
    onCheckInput: PropTypes.func.isRequired,
    nextExercise: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  }
  export default ParentTimer;
