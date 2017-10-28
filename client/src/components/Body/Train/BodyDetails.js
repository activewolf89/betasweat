  import React,{Component} from "react";
  import {Button,Grid,Col,Row} from 'react-bootstrap';
  require('./TrainingCss.css');

  class BodyDetails extends Component{
    render(){
      return(
        <Row className="show-grid">

          <Col xs={12} style={{borderRight:'1px solid white'}}>
            <Row className="show-grid"  style={{background:this.props.bodyColor.background, borderTop:'1px solid white'}}>
              <Col xs={12}>

                <h5 style={{color:'white'}}>Total Countdown:</h5>
                <h2 style={{color:'white', textAlign:'center'}}>
                  {this.props.timeString}
                </h2>
              </Col>
            </Row>
            <Row className="show-grid" style={{background:'black'}}>
              <Col xs={12}>
                <h5 style={{color:'white'}}>
                  Rep Countdown:
                </h5>
                <div style={{
                  width: '90px',
                  margin:'0 auto',
                  height: '90px',
                  borderRadius: '50%',
                  fontSize: '50px',
                  color: '#fff',
                  lineHeight: '50px',
                  textAlign: 'center',
                  background: this.props.bodyColor.background,
                  padding:'15px',
                  border:'3px solid white',
                  marginBottom:'10px'
                }}>
                  {this.props.rest ? this.props.durationOfRest : this.props.durationOfExercise }
                </div>
              </Col>
            </Row>


          </Col>
          <Col xs={6}>

          </Col>
        </Row>
      )
    }
  }

  export default BodyDetails;
