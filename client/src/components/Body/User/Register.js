import React,{Component} from "react";
import {Grid,Row,Col,Button} from 'react-bootstrap';
import {Link,Redirect} from 'react-router-dom';
import UserFieldValidations from './UserFieldValidations.js';
import PasswordMask from 'react-password-mask';
import axios from 'axios';
require('./User.css')
class Register extends Component{
  constructor(props){
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      bodyWeight: "",
      formErrors: {},
      submitErrors: '',
      redirectToProfile: false

    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this);

  }


  handleSubmit(){
    var resultingFormErrors = UserFieldValidations.createAccount(this.state.name,this.state.email,this.state.password,this.state.confirmPassword,this.state.bodyWeight)


    if(Object.keys(resultingFormErrors).length === 0){
      axios({
        method: 'post',
        data: {
          name: this.state.name,
          email: this.state.email.toLowerCase(),
          bodyWeight: Number(this.state.bodyWeight),
          password: this.state.password,
          confirmPassword: this.state.confirmPassword
        },
        url: '/user/add'
      }).then((res)=>{
        sessionStorage.setItem('myToken', res.data.token);
        this.setState({
          redirectToProfile: true
        })
      }).catch((error: AxiosError)=>{

        this.setState({
          submitErrors: error.response.data.message
        })
      })
    }
    this.setState({
      formErrors: resultingFormErrors
    })
  }
  handleInputChange(name,value){
    this.setState({
      [name]: value

    })
  }
  render(){
    return(
        <Grid fluid>
          {
            this.state.redirectToProfile &&
              <Redirect to="/profile" />
          }

          <Row className="show-grid">
            <Col xs={12}><h2 style={{textAlign:'center'}}>Create Account</h2></Col>
          </Row>
          <hr></hr>
          <Row className="show-grid">
            <Col xs={12}>
              <h4>Your Name:</h4>
            </Col>

          </Row>
          <Row className="show-grid">
            <Col xs={12}>
              <input className={this.state.formErrors.name ? 'error':'noterror'} type="text" onChange={(e)=>{this.handleInputChange(e.target.name,e.target.value)}} name="name" value={this.state.name}  placeholder ="name" />
            </Col>
            {
              this.state.formErrors.name &&
                <Col xs={12}>
                  <h5 style={{color:'red'}}>{this.state.formErrors.name}</h5>

                </Col>
            }
          </Row>

          <Row className="show-grid">
            <Col xs={12}>
              <h4>Email:</h4>
            </Col>

          </Row>
          <Row className="show-grid">
            <Col xs={12}>
              <input className={this.state.formErrors.email ? 'error':'noterror'} type="text" onChange={(e)=>{this.handleInputChange(e.target.name,e.target.value)}} name="email" value={this.state.email}  placeholder ="email" />
            </Col>
            {
              this.state.formErrors.email &&
                <Col xs={12}>
                  <h5 style={{color:'red'}}>{this.state.formErrors.email}</h5>

                </Col>
            }
          </Row>
          <Row className="show-grid">
            <Col xs={12}>
              <h4>Body Weight:</h4>
            </Col>

          </Row>
          <Row className="show-grid">
            <Col xs={12}>
              <input className={this.state.formErrors.bodyWeight ? 'error':'noterror'} type="text" onChange={(e)=>{this.handleInputChange(e.target.name,e.target.value)}} name="bodyWeight" value={this.state.bodyWeight}  placeholder ="weight in lbs" />
            </Col>
            {
              this.state.formErrors.bodyWeight &&
                <Col xs={12}>
                  <h5 style={{color:'red'}}>{this.state.formErrors.bodyWeight}</h5>

                </Col>
            }
          </Row>

          <Row className="show-grid">
            <Col xs={12}>
              <h4>Password:</h4>
            </Col>

          </Row>
          <Row className="show-grid">
            <Col xs={12}>
              <PasswordMask
                id="password"
                name="password"
                placeholder="password"
                value={this.state.password}
                inputStyles = {{height:'30px'}}
                buttonStyles={{backgroundColor:'gray', height:'25px'}}
                className={this.state.formErrors.password ? 'error':'noterror'}
                onChange={(e)=>{this.handleInputChange(e.target.name,e.target.value)}}
              />

            </Col>
            {
              this.state.formErrors.password &&
                <Col xs={12}>
                  <h5 style={{color:'red'}}>{this.state.formErrors.password}</h5>

                </Col>
            }
          </Row>
          <Row className="show-grid">
            <Col xs={12}>
              <h4>Confirm Password:</h4>
            </Col>

          </Row>
          <Row className="show-grid">
            <Col xs={12}>
              <PasswordMask
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm password"
                value={this.state.confirmPassword}
                inputStyles = {{height:'30px'}}
                buttonStyles={{backgroundColor:'gray', height:'25px'}}
                className={this.state.formErrors.confirmPassword ? 'error':'noterror'}
                onChange={(e)=>{this.handleInputChange(e.target.name,e.target.value)}}
              />
            </Col>
            {
              this.state.formErrors.confirmPassword &&
                <Col xs={12}>
                  <h5 style={{color:'red'}}>{this.state.formErrors.confirmPassword}</h5>
                  
                </Col>
            }
          </Row>



          <Row className="show-grid">
            <Col xs={12}>
              <Button bsStyle="warning" onClick={this.handleSubmit} style={{width:'100%', marginTop:'20px'}}>Create Your Account</Button>
            </Col>
          </Row>
          {
            this.state.submitErrors &&
              <Row className='show-grid'>
                <Col xs={12}><h4 style={{textAlign:'center', color:'red'}}>{this.state.submitErrors}</h4></Col>
              </Row>
          }
          <Row className="show-grid" style={{marginBottom:'20px',marginTop:'20px'}}>
            <Col xs={12}>

              <h4>Already have an account? <Link to="/login">Sign In</Link></h4>
            </Col>
          </Row>
        </Grid>

        )
  }
}

export default Register;
