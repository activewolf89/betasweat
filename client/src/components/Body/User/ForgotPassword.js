  import React,{Component} from "react";
  import {Grid,Row,Col,Button} from 'react-bootstrap';
  import {Redirect} from 'react-router-dom';
  import axios from 'axios';
  class ForgotPassword extends Component{
    constructor(props){
      super(props);
      this.state = {
        email: '',
        errorWarning: false,
        successWarning: false
      }
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleInputChange(name,value){
      this.setState({
        [name]:value
      })
    }
    handleSubmit(){
      axios.get('/user/email/'+this.state.email).then((res)=>{
        if(res.data){
          this.setState({
            successWarning: true,
            email: '',
            errorWarning: false
          })
        } else {

        }
      }).catch((err)=>{
        if(err){
          this.setState({
            errorWarning: true,
            successWarning: false,
          })
        }
      })
    }
    render(){


      return(
        <Grid>
          {
            this.state.errorWarning &&
              <Row className="show-grid">
                <Col xs={12}><h4 style={{color:'red'}}>There Was a Problem:</h4></Col>
                <Col xs={12}><p>We're sorry.  We weren't able to identify you given the information provided</p></Col>
              </Row>
          }
          {
            this.state.successWarning &&
              <Row className="show-grid">
                <Col xs={12}><h4 style={{color:'green'}}>Email Found: </h4></Col>
                <Col xs={12}><p>Check Your associated email and click the link to create a new password</p></Col>
              </Row>
          }
          <Row className="show-grid">
            <Col xs={12} ><h4 style={{textAlign:'center'}}>Password Assistance</h4></Col>
          </Row>
          <hr></hr>
          <Row className="show-grid">
            <Col xs={12} >
              <p>Enter your email address connected to your account</p>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col xs={12}>
              <h4> Email</h4>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col xs={12}>
              <input
                onChange={(e)=>{this.handleInputChange(e.target.name,e.target.value)}}
                name="email"
                value={this.state.email}
                type="text"
                style={{width:'100%'}}/>
            </Col>
          </Row>
          <Row className="show-grid"  style={{marginTop:'10px', marginBottom:'10px'}}>
            <Col xs={12}>
              <Button
                onClick={this.handleSubmit}
                bsStyle="warning"
                style={{width:'100%'}}
              >Continue</Button>
            </Col>
          </Row>
        </Grid>
      )
    }
  }

  export default ForgotPassword;
