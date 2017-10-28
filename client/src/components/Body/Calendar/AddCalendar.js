  import React,{Component} from "react";
  import {Grid,Row,Col,Button} from 'react-bootstrap';
  import axios from 'axios';
  import CheckAdd from './../../../CommonHelpers/CheckReoccurance.js';
  require('./CalendarCss.css')

  class AddCalendar extends Component{
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
        emailNotification: false
      }
      this.onInputChange = this.onInputChange.bind(this);
      this.handleAdd = this.handleAdd.bind(this);
      this.getTodaysDate = this.getTodaysDate.bind(this);
      this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
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
    handleCheckBoxChange(e){
      this.setState({
        emailNotification: e.target.checked
      })
    }
    onInputChange(name,value){
      this.setState({
        [name]:value
      })
    }
    handleAdd(){
      var checkResults = CheckAdd.Add(this.state.startDate,this.state.endDate,this.state.templateId,this.state.frequncy)
      if(Object.keys(checkResults).length === 0){
        axios({
          method:'post',
          data: {
            templateId: this.state.templateId,
            userId: this.state.userId,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            frequency: this.state.frequency,
            emailNotification: this.state.emailNotification
          },
          url: '/train/calendar/add'
        }).then((res)=>{
          var selectedTemplate = this.state.templateOptions.filter((template)=>{
            return (
              template._id === this.state.templateId
            )
          })
          this.setState({
            message: "Successfully Added Reoccurance To " + selectedTemplate[0].Title,
            startDate: '',
            endDate: '',
            emailNotification: false,
            formErrors: {},
            frequency: '2',
            templateId: ''
          })
        }).catch((err)=>{
          this.setState({
            message: "Error in submit"
          })
        })
      }
      this.setState({
        formErrors: checkResults
      })
    }
    componentDidMount(){
      axios.get('/seetemplate/show/'+this.props.payLoad._id).then((res)=>{
        this.setState({
          templateOptions: res.data
        })
      })
    }
    render(){
      return(
        <Grid>

          <Row className="show-grid">
            <Col xs={12} ><h4 style={{textAlign:'center'}}>New Reoccurance</h4></Col>
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
              <Col xs={12}>
                <label> Template:</label>
              </Col>

            </Row>
            <Row className="show-grid">
              <Col xs={12}>
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
                  <Col  xs={12}>
                    <span style={{color:'red'}}>{this.state.formErrors.templateId}</span>
                  </Col>
                </Row>
            }


            <Row className="show-grid">
              <Col xs={12}>
                <label> Frequecy:</label>
              </Col>

            </Row>
            <Row className="show-grid">
              <Col xs={12}>
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
                  <Col  xs={12}>
                    <span style={{color:'red'}}>{this.state.formErrors.frequency}</span>
                  </Col>
                </Row>
            }

            <Row className="show-grid">
              <Col xs={12}>
                <label>Starts On:</label>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col xs={12}>
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
                  <Col xs={12}>
                    <span style={{color:'red'}}>{this.state.formErrors.startDate}</span>
                  </Col>
                </Row>
            }
            <Row className="show-grid">
              <Col xs={12}>
                <label>Ends On:</label>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col xs={12}>
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
                  <Col xs={12}>
                    <span style={{color:'red'}}>{this.state.formErrors.endDate}</span>
                  </Col>
                </Row>
            }
            <Row className="show-grid">
              <Col xs={12}>
                <input
                  type = "checkbox"
                  value = {this.state.emailNotification}
                  checked = {this.state.emailNotification}
                  onChange = {this.handleCheckBoxChange}
                  style={{marginRight:'10px'}}

                />
                <label>Notify Me On Session Days</label>
              </Col>

            </Row>


              <Row className="show-grid">
              <Col xs={12}>
                <Button bsStyle="success" onClick={this.handleAdd} style={{width:'100%', marginTop:'20px', marginBottom:'20px'}}>Add</Button>
              </Col>

            </Row>

          </form>
        </Grid>
      )
    }
  }

  export default AddCalendar;
