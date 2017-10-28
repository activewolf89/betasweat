  import React,{Component} from "react";
  import {Grid,Row,Col,Button} from 'react-bootstrap';
  import {Link,Redirect} from 'react-router-dom';
  import UserFieldValidations from './UserFieldValidations.js';
  import PasswordMask from 'react-password-mask';
  import axios from 'axios';
  require('./User.css')

  class Login extends Component{
    constructor(props){
      super(props);
      this.state = {
        email: "",
        password: "",
        formErrors: {email:"",password:""},
        submitErrors: "",
        redirectToProfile: false,
        redirectToForgetPassword: false
      }
      this.handleInputChange = this.handleInputChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleKeyPress = this.handleKeyPress.bind(this);
      this.handleForgetPassword = this.handleForgetPassword.bind(this);
    }
    handleKeyPress(e){
      if (e.key === 'Enter') {
      this.handleSubmit()
    }
    }
    handleForgetPassword(){
      this.setState({
        redirectToForgetPassword: true
      })
    }
    handleSubmit(){
      var resultingFormErrors = UserFieldValidations.login(this.state.email,this.state.password)

      this.setState({
        formErrors: resultingFormErrors
      })
      if(Object.keys(resultingFormErrors).length === 0){
        axios({
          method: 'post',
          data: {
            email: this.state.email.toLowerCase(),
            password: this.state.password
          },
          url: '/user/login'
        }).then((res)=>{
          sessionStorage.setItem('myToken', res.data.token);
          this.setState({
            redirectToProfile: true
          })
        }).catch((error: AxiosError)=>{
          this.setState({
            submitErrors: "Email/Password combination does not match"
          })
        })

      }
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
                <Redirect to={{
                  pathname: '/profile',
                }}/>
            }
            {
              this.state.redirectToForgetPassword &&
                <Redirect to= '/forgotpassword'/>

            }
            <Row className="show-grid">
              <Col xs={12} ><h2 style={{textAlign:'center'}}>Sign In</h2></Col>
            </Row>
            <hr></hr>
            {
              this.state.submitErrors &&
                <Row className="show-grid">
                  <Col xs={12}>
                    <h4 style={{textAlign:'center', color: 'red'}}>{this.state.submitErrors}</h4>
                  </Col>
                </Row>
            }
            <form onKeyPress={this.handleKeyPress}>

              <Row className="show-grid">
                <Col xs={12}>
                  <h4> Email:</h4>
                </Col>

              </Row>
              <Row className="show-grid">
                <Col xs={12}>
                  <input className={this.state.formErrors.email ? 'error':'noterror'} type="text" onChange={(e)=>{this.handleInputChange(e.target.name,e.target.value)}} name="email" value={this.state.email}  placeholder ="enter email" />
                </Col>
              </Row>
              {
                this.state.formErrors.email &&
                  <Row className="show-grid">

                    <Col xs={12}>
                      <h5 style={{color:'red'}}>{this.state.formErrors.email}</h5>

                    </Col>
                  </Row>
              }
              <Row className="show-grid">
                <Col xs={6}>
                  <h4>Password:</h4>
                </Col>
                <Col xs={6}>
                  <a href="javascript: void(0)" style={{color:'green', textAlign:'bottom'}} onClick={()=>{this.handleForgetPassword()}}>Forget your password?</a>
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
                  <Button bsStyle="warning" onClick={this.handleSubmit} style={{width:'100%', marginTop:'20px'}}>Sign In</Button>
                </Col>
              </Row>
              <Row className="show-grid">
                <Col xs={12}><h4 style={{textAlign:'center'}}>---OR---</h4></Col>
              </Row>
              <Row className="show-grid" style={{marginBottom:'20px'}}>
                <Col xs={12}>
                  <Link to="/register"><Button style={{width:'100%', background:'gray', color:'white'}}>Create An Account</Button></Link>

                </Col>
              </Row>

            </form>
          </Grid>

          )
    }
  }

  export default Login;
