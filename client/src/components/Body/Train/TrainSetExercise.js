  import React,{Component} from "react";
  import PropTypes from 'prop-types';
  import {Grid,Row,Col,Button} from 'react-bootstrap';
  import {Icon} from 'react-fa'

  require ('./TrainingCss.css');

  class TrainSetExercise extends Component{
    constructor(props){
      super(props);
      this.state = {
        classObject: {}
      }
    }
    componentWillReceiveProps(nextProps){

      if(nextProps.errors && nextProps.errors.set){
      for(var i = 0; i < nextProps.errors.set.length;i++){
        // var title;
        var exerciseNumber = 0;
        var exerciseSet = 0;
        var triggered = false;
        for(var x = 0; x < nextProps.errors.set[i].length;x++){
          if(!isNaN(nextProps.errors.set[i][x]) && !triggered){
            exerciseNumber += Number(nextProps.errors.set[i][x])
          }
          if(isNaN(nextProps.errors.set[i][x])){
            triggered = true;
            // title += nextProps.errors.set[i][x]
          }
          if(!isNaN(nextProps.errors.set[i][x]) && triggered){
            exerciseSet += Number(nextProps.errors.set[i][x])
          }
        }
        if(exerciseNumber === nextProps.exerciseNumber){
          if(exerciseSet === this.props.sessionExercisesSet.key){
            this.setState({
              classObject: {border:'1px solid red'}
            })
          }
        }
      }
    } else {
      this.setState({
        classObject: {}
      })
    }

    }
    render(){

      return(
        <Grid>
          {/* <Row className="show-grid">
            <Col xs={1}><label>Actions:</label></Col>

          </Row> */}
          <hr></hr>
          <Row className="show-grid"  >
            <Col xs={3} sm={2} md={1}>
              <h5>Set: {this.props.sessionExercisesSet.key}</h5>
            </Col>
            <Col xs={1}>
              <Icon
                onClick={()=>{this.props.onPlusClick(this.props.exerciseNumber)}}
                size="lg"
                name="plus-circle" style={{color:'green'}} />
            </Col>
            <Col xs={1}>
              <Icon
                onClick={()=>{
                  if(this.props.disableDelete){

                  } else {
                    this.props.onMinusClick(this.props.exerciseNumber, this.props.sessionExercisesSet.key)
                  }

                }}
                size="lg"
                name="minus-square" style={!this.props.disableDelete ? {color:'red'}:{color:'red',opacity:'.3'}} />
            </Col>


          </Row>
          <Row className="show-grid">
            <Col xs={1}>
              <label>last effort:</label>
            </Col>

            {
                            this.props.sessionExercisesSet.prevDiff === "easy" &&
                              <Col smOffset={0} xsOffset={1} xs={2}>
                                <label style={{color:'green'}}>easy</label>
                              </Col>

            }
            {
                            this.props.sessionExercisesSet.prevDiff === "average" &&
                              <Col smOffset={0} xsOffset={1} xs={2}><label style={{color:'orange'}}>avg</label></Col>

            }
            {
                            this.props.sessionExercisesSet.prevDiff === "difficult" &&
                              <Col smOffset={0} xsOffset={1} xs={2}><label style={{color:'red'}}>diff</label></Col>

            }
            {
                            this.props.sessionExercisesSet.prevDiff === ""  &&
                              <Col smOffset={0} xsOffset={1} xs={2}><label> </label></Col>

            }

            <Col xs={1}>
              <label>last lbs:</label>
            </Col>
            <Col xsOffset={1} xs={2}>
              <input disabled  style={{width:"35px",background:'darkGray'}} value={this.props.sessionExercisesSet.goalinlbs} onChange = {(e)=>{this.props.onChangeInput(e.target.name,e.target.value)}} type="number"  name={this.props.exerciseNumber + "goalinlbs" + this.props.sessionExercisesSet.key} />
            </Col>

            <Col  xs={1}>
              <label> last reps:</label>
            </Col>
            <Col  xsOffset={1} xs={1}>
              <input disabled  style={{width:"35px", background:'darkGray'}} value={this.props.sessionExercisesSet.goalinreps} onChange = {(e)=>{this.props.onChangeInput(e.target.name,e.target.value)}} type="number"  name={this.props.exerciseNumber + "goalinreps" + this.props.sessionExercisesSet.key} />
              </Col>
            </Row>
            <Row className="show-grid">
              <Col xs={1}>
                <label>new effort:</label>
              </Col>

              <Col smOffset={0} xsOffset={1} xs={2}>
                <select
                  name={this.props.exerciseNumber + "difficulty" + this.props.sessionExercisesSet.key}
                  onChange = {(e)=>{this.props.onChangeInput(e.target.name,e.target.value)}}
                  value={this.props.sessionExercisesSet.difficulty}

                >
                  <option value="easy">easy</option>
                  <option value="average">avg</option>
                  <option value="difficult">diff</option>
                </select>
              </Col>
              <Col xs={1}>
                <label>new lbs: </label>
              </Col>
              <Col  xsOffset={1} xs={1}>
                <input
                  min="-200"
                  max="200"
                  style={{width:'35px'}}
                  name={this.props.exerciseNumber + "res" + this.props.sessionExercisesSet.key}
                  onChange = {(e)=>{this.props.onChangeInput(e.target.name,e.target.value)}}
                  type="number"
                  value={this.props.sessionExercisesSet.res}
                  onBlur = {(e)=>{this.props.onCheckValue(e.target.name,e.target.value)}}

                />
              </Col>
              <Col xsOffset={1} xs={2}><label>new reps:</label></Col>
              <Col xs={1}>
                <input
                  style={this.state.classObject}
                  min="0" max="100"
                  style={{width:'35px'}}
                  name={this.props.exerciseNumber + "reps" + this.props.sessionExercisesSet.key}
                  onChange = {(e)=>{this.props.onChangeInput(e.target.name,e.target.value)}}
                  type="number"
                  value={this.props.sessionExercisesSet.reps}
                  onBlur = {(e)=>{this.props.onCheckValue(e.target.name,e.target.value)}}
                />
                  </Col>


                </Row>
              </Grid>
      )
    }
  }
  TrainSetExercise.propTypes = {
    sessionExercisesSet: PropTypes.object.isRequired,
    onChangeInput: PropTypes.func.isRequired,
    exerciseNumber: PropTypes.number.isRequired,
    lastOne: PropTypes.string,
    onMinusClick: PropTypes.func,
    disableDelete: PropTypes.bool.isRequired,
    onCheckValue: PropTypes.func.isRequired
  }
  export default TrainSetExercise;
