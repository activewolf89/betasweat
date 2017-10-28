  import React,{Component} from "react";
  import PropTypes from 'prop-types';
  import {Button} from 'react-bootstrap';
  class TimerHeader extends Component{
    render(){
      return(
        <div style={{textAlign:'center'}}>
          <Button style={{float:'right'}} onClick={()=>{this.props.onClose();this.props.shutDownIntervals()}}>x</Button>
          <h5 style={{fontWeight:'bold'}}>{this.props.title} </h5>
          <h5 style={{font:'italic'}}>ETA: {this.props.estimatedTime} / Elapsed: {this.props.convertSecondsToTimeString(this.props.timeInSession)}</h5>
          <h3> {this.props.message} </h3>
        </div>
      )
    }
  }
  TimerHeader.propTypes = {
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    message: PropTypes.string
  }
  export default TimerHeader;
