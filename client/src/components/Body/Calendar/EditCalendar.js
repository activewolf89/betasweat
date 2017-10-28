import React,{Component} from "react";
import {Grid,Row,Col,Button} from 'react-bootstrap';
import axios from 'axios';
import {Redirect} from 'react-router';
import CheckAdd from './../../../CommonHelpers/CheckReoccurance.js';
require('./CalendarCss.css')

class EditCalendar extends Component{
  constructor(props){
    super(props);
    this.state = {
      message: '',
      formErrors: {},
      userId: this.props.payLoad._id,
      templateId: '',
      templateOptions: [],
      startDate: "",
      endDate: "",
      frequency: "2",
      redirectToCalendar: false,
      emailNotification: false,
      selectedReoccuranceObject: this.props.params.location.selectedReoccurance ? this.props.params.location.selectedReoccurance:{}
    }
    this.onInputChange = this.onInputChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.getTodaysDate = this.getTodaysDate.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);

  }
  componentDidMount(){
    if(!this.props.params.location.selectedReoccurance){
      this.setState({
        redirectToCalendar: true
      })
    }
    axios.get('/seetemplate/show/'+this.props.payLoad._id).then((res)=>{

      function convertDateString(input){
        var date = new Date(input);
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var dt = date.getDate();

        if (dt < 10) {
          dt = '0' + dt;
        }
        if (month < 10) {
          month = '0' + month;
        }

        return year+'-' + month + '-'+dt
      }
      this.setState({
        templateOptions: res.data,
        templateId: this.state.selectedReoccuranceObject['_template'] ? this.state.selectedReoccuranceObject['_template']._id : {},
        frequency: this.state.selectedReoccuranceObject.Frequency,
        startDate: convertDateString(this.state.selectedReoccuranceObject.StartDate),
        endDate: convertDateString(this.state.selectedReoccuranceObject.EndDate),
        emailNotification: this.state.selectedReoccuranceObject.EmailNotification

      })
    })
  }
  handleCheckBoxChange(e){

    this.setState({
      emailNotification: e.target.checked
    })
  }
  handleRemove(){
    axios.get(`/train/calendar/remove/${this.state.selectedReoccuranceObject._id}/${this.state.userId}/${this.state.templateId}`).then((res)=>{
      this.setState({
        redirectToCalendar: true
      })
    }).catch((err)=>{
      this.setState({
        message: err
      })
    })
  }
  getTodaysDate(){
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  onInputChange(name,value){
    this.setState({
      [name]:value
    })
  }
  handleUpdate(){
    var checkResults = CheckAdd.Add(this.state.startDate,this.state.endDate,this.state.templateId,this.state.frequncy)
    if(Object.keys(checkResults).length === 0){
      axios({
        method:'post',
        data: {
          templateId: this.state.templateId,
          reoccuranceId: this.state.selectedReoccuranceObject._id,
          userId: this.state.userId,
          startDate: this.state.startDate,
          endDate: this.state.endDate,
          frequency: this.state.frequency,
          emailNotification: this.state.emailNotification

        },
        url: '/train/calendar/update'
      }).then((res)=>{
        var selectedTemplate = this.state.templateOptions.filter((template)=>{
          return (
            template._id === this.state.templateId
          )
        })
        this.setState({
          message: "Successfully Updated Reoccurance To " + selectedTemplate[0].Title
        })
      }).catch((err)=>{
      })
    }
    this.setState({
      formErrors: checkResults
    })
  }

  render(){
    return(
      <Grid style={{background:'white', border:'1px solid black',width:'500px'}}>
        {
          this.state.redirectToCalendar &&
            <Redirect to ="/calendar" />
        }
        <Row className="show-grid">
          <Col md={12} ><h2 style={{textAlign:'center'}}>New Reoccurance</h2></Col>
        </Row>
        <hr></hr>
        {
          this.state.message &&
            <Row className="show-grid">
              <Col xs={12}>
                <h4 style={{color:'purple', textAlign:'center'}}>{this.state.message}</h4>
              </Col>
            </Row>
        }

        <form onKeyPress={this.handleKeyPress}>

          <Row className="show-grid">
            <Col md={12}>
              <h4> Template</h4>
            </Col>

          </Row>
          <Row className="show-grid">
            <Col md={12}>
              <select
                style={{width:'100%'}}
                onChange={(e)=>{this.onInputChange(e.target.name,e.target.value)}}
                value={this.state.templateId}
                className={this.state.formErrors.templateId ? 'error':'notError'}

                name="templateId">
                <option value="" disabled>--select--</option>
                {this.state.templateOptions.map((template)=>{
                  return (
                    <option value={template._id} key={template._id}>{template.Title}</option>
                  )
                })}
              </select>
            </Col>
          </Row>

          {
            this.state.formErrors.templateId &&
              <Row className = "show-grid">
                <Col  md={12}>
                  <span style={{color:'red'}}>{this.state.formErrors.templateId}</span>
                </Col>
              </Row>
          }


          <Row className="show-grid">
            <Col md={12}>
              <h4> Frequecy:</h4>
            </Col>

          </Row>
          <Row className="show-grid">
            <Col md={12}>
              <select
                type="number"
                name="frequency"
                value = {this.state.frequency}
                onChange={(e)=>{this.onInputChange(e.target.name,e.target.value)}}
                style={{width:'100%'}}
                className={this.state.formErrors.frequency ? 'error':'notError'}

              >
                <option value="1">every day</option>
                <option value="2">every two days</option>
                <option value="3">every three days</option>
                <option value="4">every four days</option>
                <option value="5">every five days</option>
                <option value="6">every six days</option>
                <option value="7">every seven days</option>

              </select>
            </Col>
          </Row>

          {
            this.state.formErrors.frequency &&
              <Row className = "show-grid">
                <Col  md={12}>
                  <span style={{color:'red'}}>{this.state.formErrors.frequency}</span>
                </Col>
              </Row>
          }

          <Row className="show-grid">
            <Col md={12}>
              <h4>Starts On:</h4>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col md={12}>
              <input
                type="date"
                min = {this.getTodaysDate()}
                className={this.state.formErrors.startDate ? 'error':'notError'}
                style={{width:'100%'}}
                name="startDate"
                value={this.state.startDate}
                onChange={(e)=>{this.onInputChange(e.target.name,e.target.value)}}
              />
            </Col>
          </Row>
          {
            this.state.formErrors.startDate &&
              <Row className = "show-grid">
                <Col md={12}>
                  <span style={{color:'red'}}>{this.state.formErrors.startDate}</span>
                </Col>
              </Row>
          }
          <Row className="show-grid">
            <Col md={12}>
              <h4>Ends On:</h4>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col md={12}>
              <input
                className={this.state.formErrors.endDate ? 'error':'notError'}
                min = {this.state.startDate ? this.state.startDate: ''}
                style={{width:'100%'}}
                type="date"
                name="endDate"
                value={this.state.endDate}
                onChange={(e)=>{this.onInputChange(e.target.name,e.target.value)}}
              />
            </Col>
          </Row>
          {
            this.state.formErrors.endDate &&
              <Row className = "show-grid">
                <Col md={12}>
                  <span style={{color:'red'}}>{this.state.formErrors.endDate}</span>
                </Col>
              </Row>
          }
          <Row className="show-grid">
            <Col md={12}>
              <h4>Notify By Email On Session Day:</h4>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col md={12}>
              <input
                type = "checkbox"
                value = {this.state.emailNotification}
                checked = {this.state.emailNotification}
                onChange = {this.handleCheckBoxChange}
              />
            </Col>
          </Row>
          <Row className="show-grid">
            <Col md={12}>
              <Button bsStyle="success" onClick={this.handleUpdate} style={{width:'100%', marginTop:'20px', marginBottom:'20px'}}>Update</Button>
            </Col>
            <Col md={12}>
              <Button bsStyle="danger" onClick={this.handleRemove} style={{width:'100%', marginTop:'20px', marginBottom:'20px'}}>Remove</Button>
            </Col>
          </Row>

        </form>
      </Grid>
    )
  }
}

export default EditCalendar;
