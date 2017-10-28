  import React,{Component} from "react";
  import PropTypes from 'prop-types';
  import {Grid,Row,Col,Button} from 'react-bootstrap';
  class TimerFooter extends Component{

    render(){
      return(
        <div>
          <Row className="show-grid">
            <Col sm = {1} xs={1} md={1}><label>effort:</label></Col>
            <Col sm ={2} xsOffset={1} xs={1} md={1}>
              <select
                disabled ={!this.props.fillOutResults}
                value={this.props.difficulty}
                style={{width:'50px'}}
                onChange={(e)=>{this.props.onInputChange(e.target.name,e.target.value)}}
                name={this.props.exerciseNumber+"difficulty"+this.props.exerciseSetNumber}>
                <option value="easy">easy</option>
                <option value="average">avg</option>
                <option value="difficult">diff</option>
              </select>
            </Col>
            <Col sm = {1} xsOffset={1}  xs={1} md={1}><label>res:</label></Col>
            <Col sm = {1}  xs={1} md={1}><input disabled ={!this.props.fillOutResults}
              style={{width:'35px'}}
              value={this.props.currRes}
              type="number" onChange={(e)=>{this.props.onInputChange(e.target.name,e.target.value)}}
              name={this.props.exerciseNumber+"res"+this.props.exerciseSetNumber}
              onBlur = {(e)=>{this.props.onCheckInput(e.target.name,e.target.value)}}

                                         />
            </Col>

            <Col sm = {1} xsOffset={1} xs={2} md={1}><label>reps:</label></Col>
            <Col sm = {1}  xs={1} md={1}><input
              disabled ={!this.props.fillOutResults}
              style={{width:'35px'}}
              value={this.props.currRep}
              type="number" onChange={(e)=>{this.props.onInputChange(e.target.name,e.target.value)}}
              name={this.props.exerciseNumber+"reps"+this.props.exerciseSetNumber}
              onBlur = {(e)=>{this.props.onCheckInput(e.target.name,e.target.value)}}
                                         />
            </Col>
          </Row>
          <hr></hr>
          <Row className="show-grid">
            <Col xs={1}>
              {
                       this.props.exerciseSetNumber > 1 &&
                         <Button style={{background:'navy', color:'white'}}  onClick={this.props.backSet}>Past Set </Button>
              }
              {
                      this.props.exerciseSetNumber === 1 && this.props.exerciseNumber !== 1 &&
                        <Button style={{background:'navy',color:'white'}} onClick={this.props.onBackExercise}>Past Exercise Set</Button>
              }
            </Col>

            {
                    this.props.difference > 0 &&
                      <Col   xsOffset={6} xs={1}>
                        <Button style={{background:'gold', color:'white'}}  onClick={()=>{this.props.nextSet("forced")}}>Next Set</Button>


                      </Col>
            }
            <Col xsOffset={6}  xs={1} >
              {
                      this.props.difference <=0 &&   this.props.countOfExercises !== this.props.exerciseNumber &&
                        <Button style={{background:'gold', color:'white'}}  onClick={()=>{this.props.onNextExercise('forced')}}>Next Exercise</Button>

              }
              {
                      this.props.countOfExercises === this.props.exerciseNumber && this.props.totalSetsInExercise === this.props.exerciseSetNumber &&
                        <Button onClick={()=>{this.props.onSubmit();this.props.onShutDownIntervals()}} bsStyle="success">Submit Session</Button>
              }
            </Col>

          </Row>

        </div>
              )
            }
              }

  TimerFooter.propTypes = {
    totalSetsInExercise: PropTypes.number.isRequired,
    onCheckInput: PropTypes.func.isRequired,
    onShutDownIntervals: PropTypes.func.isRequired,
    exerciseNumber:PropTypes.number.isRequired,
    exerciseSetNumber:PropTypes.number.isRequired,
    onInputChange: PropTypes.func.isRequired,
    difficulty: PropTypes.string,
    nextSet: PropTypes.func,
    backSet: PropTypes.func,
    onClose: PropTypes.func,
    difference: PropTypes.number.isRequired,
    onNextExercise: PropTypes.func.isRequired,
    onBackExercise: PropTypes.func.isRequired,
    initiateSubmit: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }
  export default TimerFooter;
