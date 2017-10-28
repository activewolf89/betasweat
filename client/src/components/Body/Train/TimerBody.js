  import React,{Component} from "react";
  import PropTypes from 'prop-types';
  import {Button,Col,Row} from 'react-bootstrap';
  import BodyDetails from './BodyDetails';
  class TimerBody extends Component{
    componentWillReceiveProps(nextProps){
      // console.log(nextProps)
    }
    render(){
      return(
        <div >
          <Row className="show-grid">
            <Col xs={4}>
              <Button disabled = {this.props.disableStart} style={{width:"100%"}} bsStyle="success" onClick={this.props.onStart}>Start</Button>
            </Col>
            <Col xs={4}>
              <Button style={{width:"100%"}} disabled={!this.props.disableStart || this.props.disableStop} bsStyle="danger" onClick={this.props.onStop}>Stop</Button>
            </Col>
            <Col xs={4}>
              <Button style={{width:"100%"}} bsStyle="warning" onClick={this.props.onReset}>Reset</Button>
            </Col>
          </Row>
          <Row style={{marginTop:'10px'}} className="show-grid">

            <Col xs={12} style={{borderLeft:'2px solid white'}}>
              <BodyDetails
                mode={this.props.mode}
                timeString={this.props.timeString}
                rest = {this.props.rest}
                durationOfRest = {this.props.durationOfRest}
                durationOfExercise = {this.props.durationOfExercise}
                bodyColor = {this.props.bodyColor}
              />
              <Row className="show-grid">
                <Col style={{
                  color: 'white',
                  background: this.props.bodyColor.background,
                  display: 'inline-block',
                  borderBottom:'2px solid white',
                  borderRight:'2px solid white'
                }} xs={4}>

                  <h5>Reps:  </h5>
                  <h3>{this.props.repCount} of {this.props.currRep} </h3>

                </Col>
                <Col style={{
                  color: 'white',
                  background: this.props.bodyColor.background,
                  display: 'inline-block',
                  borderBottom:'2px solid white',
                  borderRight:'2px solid white'

                }} xs={4}>

                  <h5>Sets:  </h5>
                  <h3>{this.props.currentCount} of {this.props.totalCount} </h3>

                </Col>

                <Col style={{
                  color: 'white',
                  background: this.props.bodyColor.background,
                  display: 'inline-block',
                  borderBottom:'2px solid white',
                }} xs={4}>
                  <h5>exercise:</h5>
                  <h3>{this.props.exNum} of {this.props.exTotal}</h3>
                </Col>
              </Row>


            </Col>

          </Row>
        </div>

      )
    }
  }
  TimerBody.propTypes = {
    onStart: PropTypes.func.isRequired,
    bodyColor: PropTypes.object.isRequired,
    currentCount: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
    onStop: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    disableStart: PropTypes.bool.isRequired,
    timeString: PropTypes.string.isRequired,
    repCount: PropTypes.number.isRequired,
    durationOfRest: PropTypes.number,
    durationOfExercise: PropTypes.number,
  }
  export default TimerBody;
