  import React,{Component} from "react";
  import PropTypes from 'prop-types';
  import {Grid,Row,Col,Button} from 'react-bootstrap';
  import TrainSetExercise from './TrainSetExercise.js';
  var classNames = require('classnames');
   require ('./TrainingCss.css');
   require('./../../../css/styles.css')

  class TrainSet extends Component{
    constructor(props){
      super(props);
      this.state = {
        errorsOnSet:"",
        isMetricStyle: {fontWeight:'bold'},
        currentTitle: this.props.sessionExercises.title
      }
      this.findTitleValue = this.findTitleValue.bind(this);
    }
    findTitleValue(){
      //based off this.props.workOutObjects, the name may have changed via an update in exercise, but ID did not.
      var newTitle = '';
      for(var i = 0; i < this.props.workOutObjects.length;i++){
        if(this.props.workOutObjects[i]._id === this.props.sessionExercises.exerciseId){
          newTitle = this.props.workOutObjects[i].Title
        }
      }
      return newTitle
    }
    componentDidMount(){
      if(this.props.sessionExercises.isMetric){
        this.setState({
          isMetricStyle: {color:'purple', fontWeight:'bold'}
        })
      } else {
        this.setState({
          isMetricStyle: {fontWeight:'bold'}
        })
      }
    }
    componentWillReceiveProps(nextProps){
      this.setState({
      currentTitle:  nextProps.sessionExercises.title
      })

      if(nextProps.sessionExercises.isMetric){
        this.setState({
          isMetricStyle: {color:'purple',fontWeight:'bold'}
        })
      } else {
        this.setState({
          isMetricStyle: {fontWeight:'bold'}
        })
      }
      if(nextProps.sessionExercises.errors){
        //set issues within the training set then deal with independant sets
        if(nextProps.sessionExercises.errors.restBetweenReps){
          this.setState({
            restBetweenRepsError: nextProps.sessionExercises.errors.restBetweenReps,
            restBetweenReps: 'error'
          })
        } else {
          this.setState({
            restBetweenRepsError: "",
            restBetweenReps: 'off'
          })
        }
        if(nextProps.sessionExercises.errors.repTakes){
          this.setState({
            repTakesError: nextProps.sessionExercises.errors.repTakes,
            repTakes: 'error'
          })
        } else {
          this.setState({
            repTakes: "",

          })
        }
        if(nextProps.sessionExercises.errors.restBetweenSets){
          this.setState({
            restBetweenSetsError: nextProps.sessionExercises.errors.restBetweenSetsError,
            restBetweenSets: 'error'
          })
        } else {
          this.setState({
            restBetweenSetsError: "",
            restBetweenSets: 'off'
          })
        }
        if(nextProps.sessionExercises.errors.title){
          this.setState({
            titleError: nextProps.sessionExercises.errors.title,
            title: 'error'
          })
        } else {
          this.setState({
            titleError: "",
            title: 'off'
          })
        }
        if(nextProps.sessionExercises.errors.set && nextProps.sessionExercises.errors.set.length > 0){

          this.setState({
            errorsOnSet: nextProps.sessionExercises.errors.set
          })
        }
        if(!nextProps.sessionExercises.errors.set){

          this.setState({
            errorsOnSet: null
          })
        }
      }
    }
    render(){
      var workOutOptions = this.props.workOuts.map((singleWorkout)=>{
        var trigger = false;
        for(var x = 0; x < this.props.disableTheseWorkouts.length;x++){
          if(this.props.disableTheseWorkouts[x] === singleWorkout){
            trigger = true;
          }
        }
        if(!trigger){
          return <option key={singleWorkout}>{singleWorkout}</option>

        } else {
          return <option disabled={true} key={singleWorkout}>{singleWorkout}</option>

        }

      })
      var trainSetRows = [];
      for(var i = 0; i < this.props.sessionExercises.sets.length;i++){
        if(this.props.sessionExercises.sets.length > 1){

          trainSetRows.push(
            <Row className="show-grid" key={i}>
              <TrainSetExercise
                onPlusClick = {this.props.onPlusClick}
                errors={this.props.sessionExercises.errors}
                disableDelete = {false}
                onMinusClick = {this.props.onMinusClick}
                onCheckValue = {this.props.onCheckValue}
                exerciseNumber = {this.props.sessionExercises.key}
                onChangeInput = {this.props.onChangeInput}
                sessionExercisesSet={this.props.sessionExercises.sets[i]}
              />
            </Row>);
        } else {
          trainSetRows.push(
            <Row className="show-grid" key={i}>
              <TrainSetExercise
                onPlusClick = {this.props.onPlusClick}
                errors={this.props.sessionExercises.errors}
                disableDelete = {true}
                onMinusClick = {this.props.onMinusClick}
                exerciseNumber = {this.props.sessionExercises.key}
                onChangeInput = {this.props.onChangeInput}
                onCheckValue = {this.props.onCheckValue}
                sessionExercisesSet={this.props.sessionExercises.sets[i]}
              />
            </Row>);
        }

      }

      return(
          <Grid>
            <Row className="show-grid">
              <Col xsOffset={2} smOffset={3} mdOffset={4} sm={9} md={8} xs={10} >
                <u
                  onClick ={()=>{this.props.onOpenExerciseDetails(this.props.sessionExercises)}}
                  style={this.state.isMetricStyle}
                >{ this.props.sessionExercises.key + " of " + this.props.allSessionExercisesLength +  ": "}
                </u>
                <select
                  style={{width:'150px'}}
                  value = {this.findTitleValue()}
                  onChange = {(e)=>
                    {
                      this.props.onChangeInput(e.target.name,e.target.value,this.state.currentTitle);

                    }
                  } name={this.props.sessionExercises.key+"title"} >
                  <option disabled name="select">--select--</option>

                  {workOutOptions}
                </select>
              </Col>


            </Row>



            <hr></hr>
            <Row className="show-grid">
              <Col xs={7} sm={4} >

                <label>Rep Takes(sec):</label>
              </Col>
              <Col smOffset={0}  xsOffset={2} xs={2}>


                <input
                  className={this.state.repTakes}
                  min="0"
                  max="60"
                  type="number"
                  name={this.props.sessionExercises.key+"repTakes"}
                  value={this.props.sessionExercises.repTakes}
                  onChange = {(e)=>{this.props.onChangeInput(e.target.name,e.target.value)}}
                  onBlur = {(e)=>{this.props.onCheckValue(e.target.name,e.target.value)}}

                >

                </input>
              </Col>

              <Col xs={7} sm={4} >

                <label>Rest between reps(sec):</label>
              </Col>
              <Col smOffset={0}  xsOffset={2} xs={2}>

                <input
                  className={this.state.restBetweenReps}
                  min="0"
                  max="60"
                  type="number"
                  name={this.props.sessionExercises.key+"restBetweenReps"}
                  value={this.props.sessionExercises.restBetweenReps}
                  onChange = {(e)=>{this.props.onChangeInput(e.target.name,e.target.value)}}
                  onBlur = {(e)=>{this.props.onCheckValue(e.target.name,e.target.value)}}

                >

                </input>
              </Col>

              <Col xs={7} sm={4} >

                <label >Rest between sets(min):</label>
              </Col>
              <Col smOffset={0}  xsOffset={2} xs={3} sm={2}>


                <input
                  className={this.state.restBetweenSets}
                  min="0"
                  max="60"
                  type="number"
                  name={this.props.sessionExercises.key+"restBetweenSets"}
                  value={this.props.sessionExercises.restBetweenSets}
                  onChange = {(e)=>{this.props.onChangeInput(e.target.name,e.target.value)}}
                  onBlur = {(e)=>{this.props.onCheckValue(e.target.name,e.target.value)}}

                >

                </input>

              </Col>

              <Col xs={7} sm={4} >

                <label>Rest between ex(min):</label>
              </Col>
              <Col smOffset={0}  xsOffset={2} xs={3} sm={2}>

                <input
                  className={this.state.restBetweenExercises}
                  min="0"
                  max="60"
                  type="number"
                  name={this.props.sessionExercises.key+"restBetweenExercises"}
                  value={this.props.sessionExercises.restBetweenExercises}
                  onChange = {(e)=>{this.props.onChangeInput(e.target.name,e.target.value)}}
                  onBlur = {(e)=>{this.props.onCheckValue(e.target.name,e.target.value)}}

                >
                </input>
              </Col>
            </Row>

            {trainSetRows}

            <hr></hr>
          </Grid>
          )
    }
  }

  TrainSet.propTypes = {
    exercisesCurrentlySelect: PropTypes.array.isRequired,
    placementInSession:PropTypes.number.isRequired,
    howManyInSession:PropTypes.number.isRequired,
    workOutObjects: PropTypes.array,
    onCheckValue: PropTypes.func.isRequired,
    timerModal: PropTypes.func,
    onExerciseOnFly: PropTypes.func,
    sessionExercises: PropTypes.object.isRequired,
    onChangeInput: PropTypes.func.isRequired,
    workOuts: PropTypes.array.isRequired,
    onMinusClick: PropTypes.func,
    moveUp: PropTypes.func.isRequired,
    moveDown: PropTypes.func.isRequired,
    onOpenExerciseDetails: PropTypes.func.isRequired
  }
  export default TrainSet;
