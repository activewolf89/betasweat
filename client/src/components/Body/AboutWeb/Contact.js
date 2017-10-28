  import React,{Component} from "react";
  import {Grid,Row,Col,Button} from 'react-bootstrap';
  import {Icon} from 'react-fa'
  import axios from 'axios';
  import CheckContactForm from './CheckContactForm.js'
  class About extends Component{
    constructor(props){
      super(props);
      this.state = {
        name: '',
        email: '',
        comment: '',
        formErrors: {},
        message: ''
      }
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleInputChange(e){
      this.setState({
        [e.target.name]:e.target.value
      })
    }
    handleSubmit(){
      var formErrors = CheckContactForm(this.state);
      if(Object.keys(formErrors).length ===0){
        axios({
          method:'post',
          data: {
            name: this.state.name,
            email: this.state.email,
            comment: this.state.comment
          },
          url: '/contact'
        }).then((res)=>{

          this.setState({
            formErrors: formErrors,
            message: "Thank You, your message has been sent",
            name: '',
            email: '',
            comment: ''

          })
        }).catch((err)=>{
          this.setState({
            formErrors: formErrors,
            message: "There was an error in submitting"
          })
        })
      } else {
        this.setState({
          formErrors: formErrors
        })
      }
    }
    render(){
    return(
      <Grid style={{border:'1px solid black'}}>

        <Row className="show-grid">
          <Col xs={12} xsOffset={6}>
            <Icon name="telegram" size="3x"  />
          </Col>
        </Row>
        {
          this.state.message &&
            <Row className="show-grid">
              <Col xs={12}>
                <h5 style={{textAlign:'center'}}>{this.state.message}</h5>
              </Col>
            </Row>
        }
        <hr></hr>
        <Row className="show-grid">
          <Col xs={12}>
            <h4>Name:</h4>
          </Col>

        </Row>
        <Row className="show-grid">
          <Col xs={12}>
            <input
              type="text"
              style={this.state.formErrors.name ? {width:'100%',border:'1px solid red'}:{width:'100%'}}
              value={this.state.name}
              name="name"
              onChange={this.handleInputChange}
              placeholder="name"
            />
          </Col>
        </Row>
        {
          this.state.formErrors.name &&
            <Row className="show-grid">
              <Col xs={12}>
                <span style={{color:'red'}}>{this.state.formErrors.name}</span>
              </Col>
            </Row>
        }
        <Row className="show-grid">
          <Col xs={12}>
            <h4>Email:</h4>
          </Col>

        </Row>
        <Row className="show-grid">
          <Col xs={12}>
            <input
              type="text"
              style={this.state.formErrors.email ? {width:'100%',border:'1px solid red'}:{width:'100%'}}
              value={this.state.email}
              name="email"
              placeholder="email"
              onChange={this.handleInputChange}
            />
          </Col>
        </Row>
        {
          this.state.formErrors.email &&
            <Row className="show-grid">
              <Col xs={12}>
                <span style={{color:'red'}}>{this.state.formErrors.email}</span>
              </Col>
            </Row>
        }
        <Row className="show-grid">
          <Col xs={12}>
            <h4>FeedBack:</h4>
          </Col>

        </Row>
        <Row className="show-grid">
          <Col xs={12}>
            <textarea
              placeholder = "please provide any feedback"
              value={this.state.comment}
              name="comment"
              onChange={this.handleInputChange}
              style={this.state.formErrors.comment ? {width:'100%',border:'1px solid red'}:{width:'100%'}}
            />
          </Col>
        </Row>
        {
          this.state.formErrors.comment &&
            <Row className="show-grid">
              <Col xs={12}>
                <span style={{color:'red'}}>{this.state.formErrors.comment}</span>
              </Col>
            </Row>
        }
        <Row className="show-grid" style={{marginTop:'10px', marginBottom:'10px'}}>
          <Col xs={12}>
            <Button
              style={{width:'100%',color:'white',backgroundColor:'green'}}
              onClick={this.handleSubmit}
            >Send Message</Button>
          </Col>
        </Row>
      </Grid>
    )
  }
}




export default About
