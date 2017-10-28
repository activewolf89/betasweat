  import React,{Component} from "react";
  import BigCalendar from 'react-big-calendar';
  import moment from 'moment';
  import {Grid,Row,Col,Button,Table,ButtonToolbar} from 'react-bootstrap';
  import axios from 'axios';
  import {Link,Redirect} from 'react-router-dom';
  import ReminderRow from './ReminderRow';
  import 'react-big-calendar/lib/css/react-big-calendar.css';
  import EventGenerator from './EventGenerator.js';
  BigCalendar.momentLocalizer(moment)
  class Calendar extends Component{
    constructor(props){
      super(props);
      this.state = {
        arrayOfReminders: [],
        arrayOfSessions: [],
        templateOptions: [],
        selectedReoccurance: {},
        defaultReminder: {selectedTemplateId:'',key:0, days:0,startDate: "", endDate:""},
        redirectToDetails: false,
        weeklyDetail: false,
        weeklyTime: '',
        redirectToEditSession: false,
        redirectToSession: false,
        sessionObject: {}
      }
      this.handleDoubleClick = this.handleDoubleClick.bind(this);
      this.handleSelectedRow = this.handleSelectedRow.bind(this);
      this.handleEventSelect = this.handleEventSelect.bind(this);
      this.handleWeeklyView = this.handleWeeklyView.bind(this);
      this.handleMonthlyView = this.handleMonthlyView.bind(this);
      this.eventStyleGetter = this.eventStyleGetter.bind(this);
    }
    componentDidMount(){
      axios.get('/train/calendar/showAll/'+ this.props.payLoad._id).then((calendarResponse)=>{
        return axios.get('/train/session/show/'+this.props.payLoad._id).then((sessionResponse)=>{
          this.setState({
            arrayOfReminders: calendarResponse.data,
            arrayOfSessions: sessionResponse.data,
            selectedReoccurance: calendarResponse.data[0] ? calendarResponse.data[0]: {}
          })
        })

      })
    }
    eventStyleGetter(event,start,end){

      var someDay = new Date(start).toDateString()
      var thisDay = new Date().toDateString()

      var backgroundColor;
      if(event.title.split(' ')[0] === "SESSION" && someDay !== thisDay){
         backgroundColor = 'green';

      }
      if(event.title.split(' ')[0] !== "SESSION" && someDay !== thisDay){
         backgroundColor = 'gray';

      }
      if(event.title.split(' ')[0] !== "SESSION" && someDay === thisDay){
         backgroundColor = 'orange';

      }
var style = {
    backgroundColor: backgroundColor,
    borderRadius: '0px',
    opacity: 0.8,
    color: 'black',
    border: '0px',
    display: 'block'
};
return {
    style: style
};
    }
    handleMonthlyView(){
      this.setState({
        weeklyDetail: false
      })
    }
    handleWeeklyView(monthData){
      this.setState({
        weeklyDetail: true,
        weeklyTime: monthData
      })
    }
    handleEventSelect(e){
      if(new Date(e.start).toDateString() === new Date().toDateString()){
        this.setState({
          redirectToSession: true,
          templateObject: e.templateObject
        })
      }
      if(e.session){
        this.setState({
          redirectToEditSession: true,
          sessionObject: e.session
        })
      }
    }
    handleDoubleClick(selectedObject){
      this.setState({
          selectedReoccurance: selectedObject
      },()=>{
        this.setState({
          redirectToDetails: true
        })
      })
    }
    handleSelectedRow(selectedObject){
        this.setState({
          selectedReoccurance: selectedObject,
          weeklyDetail: false
        })

    }

    render(){
      var newTo = { pathname: '/calendar/edit/', selectedReoccurance: this.state.selectedReoccurance};
      var edit = { pathname: '/sessions/edit/', sessionObject: this.state.sessionObject};
      var secondNewTo = { pathname: '/sessions/add/', templateObject: this.state.templateObject};


      return(
        <Grid>
          {
            this.state.redirectToDetails &&
              <Redirect to={newTo} />
          }
          {
            this.state.redirectToSession &&
              <Redirect to ={secondNewTo}/>
          }
          {
            this.state.redirectToEditSession &&
              <Redirect to ={edit} />
          }
          <Row className="show-grid">
            <Col xs={12} ><h4 style={{textAlign:'center'}}>Calendar</h4></Col>
          </Row>
          <hr></hr>
          <Row className="show-grid">
            <Col xs={12}>

              <BigCalendar
                style={{ minHeight:'400px'}}
                views = {{
                  month:true,
                  day:true
                }}
                events = {
                  this.state.arrayOfReminders.length > 0 ? EventGenerator.Generate(this.state.arrayOfReminders,this.state.arrayOfSessions) :
                  [  {
                    'title': 'All Day Event',
                    'allDay': true,
                    'start': new Date(2015, 3, 0),
                    'end': new Date(2015, 3, 1)
                  }]
                }
                eventPropGetter = {this.eventStyleGetter}
                onSelectEvent={(e)=>{this.handleEventSelect(e)}}
              />
            </Col>
          </Row>
        </Grid>

      )
    }
  }

  export default Calendar;
