  import React,{Component} from "react";
  import {Grid,Row,Col,Button} from 'react-bootstrap';
  import axios from 'axios';
  import {Redirect} from 'react-router-dom';
  import UserFieldValidations from './UserFieldValidations.js';
  import PasswordMask from 'react-password-mask';
  require('./User.css')

  class CreateNewPassword extends Component{
    constructor(props){
      super(props);
      this.state = {
        redirectToLogin: false,
        name: '',
        userId: '',
        password: '',
        passwordMatch: '',
        formErrors: {},
        redirectToProfile: false
      }
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount(){
      if(this.props.userInfo){
        const jwt = this.props.userInfo.match.params.jwt;
        var payload;
        payload = jwt.split('.')[1];
        payload = window.atob(payload);
        payload = JSON.parse(payload);
        if(payload.exp >= Date.now() / 1000){
          axios.get(`/user/checkvalidation/${payload.email}/${payload.token}`).then((res)=>{
            if(res.data){
              this.setState({
                name: res.data.name,
                userId: res.data._id
              })
            } else {
              this.setState({
                redirectToLogin:true
              })
            }
          })

        }
      } else {
        this.setState({
          redirectToLogin:true
        })
      }

    }
    handleSubmit(){
      var resultingFormErrors = UserFieldValidations.updatePassword(this.state.password,this.state.passwordMatch)
      if(Object.keys(resultingFormErrors).length === 0){
        axios({
          method: 'post',
          data: {
            password: this.state.password,
            passwordMatch: this.state.passwordMatch,
            userId: this.state.userId
          },
          url: '/user/updatePassword'
        }).then((res)=>{
          console.log(res.data)
          sessionStorage.setItem('myToken', res.data.token);
          this.setState({
            redirectToProfile: true
          })
        }).catch((error: AxiosError)=>{
          console.log(error)
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
        [name]:value
      })
    }
    render(){
      return(
        <Grid style={{background:'white', border:'1px solid black',width:'500px'}}>
          {
            this.state.redirectToProfile &&
              <Redirect to="/profile" />
          }
          {this.state.redirectToLogin &&
            <Redirect to="/login"/>
          }
          <Row className="show-grid">
            <Col md={12}><h3 style={{textAlign:'center'}}>Welcome {this.state.name} To Password Reset</h3></Col>
          </Row>
          <hr></hr>
          <Row className="show-grid">
            <Col md={12}>
              <h4>New Password:</h4>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col md={12}>
              <PasswordMask
                id="password"
                name="password"
                placeholder="Enter password"
                value={this.state.password}
                inputStyles = {{height:'30px'}}
                buttonStyles={{backgroundColor:'gray', height:'25px'}}
                className={this.state.formErrors.password ? 'error':'noterror'}
                onChange={(e)=>{this.handleInputChange(e.target.name,e.target.value)}}
              />

            </Col>
            {
              this.state.formErrors.password &&
                <Col md={12}>
                  <h5 style={{color:'red'}}>{this.state.formErrors.password}</h5>

                </Col>
            }
          </Row>
          <Row className="show-grid">
            <Col md={12}>
              <h4>Confirm Password:</h4>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col md={12}>
              <PasswordMask
                id="passwordMatch"
                name="passwordMatch"
                placeholder="Confirm password"
                value={this.state.passwordMatch}
                inputStyles = {{height:'30px'}}
                buttonStyles={{backgroundColor:'gray', height:'25px'}}
                className={this.state.formErrors.passwordMatch ? 'error':'noterror'}
                onChange={(e)=>{this.handleInputChange(e.target.name,e.target.value)}}
              />

            </Col>
            {
              this.state.formErrors.passwordMatch &&
                <Col md={12}>
                  <h5 style={{color:'red'}}>{this.state.formErrors.passwordMatch}</h5>

                </Col>
            }
          </Row>
          <Row className="show-grid">
            <Col md={12}>
              <Button
                style={{width:'100%'}}
                bsStyle="primary"
                onClick={this.handleSubmit}
              >Submit</Button>
            </Col>
          </Row>
        </Grid>
      )
    }
  }

  export default CreateNewPassword;
