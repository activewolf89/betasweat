  import React,{Component} from "react";
  import ReoccuranceData from './ReoccuranceData';
  import WeeklyReoccuranceData from './WeeklyReoccuranceData';
  import ReminderRow from './ReminderRow';
  import {Grid,Row,Col,Button,Table,ButtonToolbar} from 'react-bootstrap';
  import axios from 'axios';
  import {Link,Redirect} from 'react-router-dom';

  class Reoccurance extends Component{

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
                <Col xs={12} ><h4 style={{textAlign:'center'}}>Reoccurance</h4></Col>
              </Row>
              <hr></hr>
              <Row className="show-grid" >
                <Col xs={12}>
                  <Table responsive  bordered condensed hover >
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Active</th>
                        <th>Notify</th>
                        <th>Often</th>

                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.arrayOfReminders.map((reminder)=>{
                          return (
                            <ReminderRow
                              key = {reminder._id}
                              selectedReminder = {this.state.selectedReoccurance}
                              reminderObject = {reminder}
                              OnSelectedThisRow = {this.handleSelectedRow}
                              OnDoubleClick = {this.handleDoubleClick}
                            />
                          )
                        })
                      }

                    </tbody>

                  </Table>
                </Col>
              </Row>
              <Row className="show-grid">
                <Col xs={12}>
                  {
                    !this.state.weeklyDetail && Object.keys(this.state.selectedReoccurance).length !== 0 &&
                      <ReoccuranceData
                        selectedReoccurance = {this.state.selectedReoccurance}
                        arrayOfSessions = {this.state.arrayOfSessions}
                        onWeeklyView = {this.handleWeeklyView}
                      />
                  }
                </Col>
              </Row>

              <Row className="show-grid">
                <Col xs={12}>

                  {
                    this.state.weeklyDetail && Object.keys(this.state.selectedReoccurance).length !== 0 &&
                      <WeeklyReoccuranceData
                        selectedReoccurance = {this.state.selectedReoccurance}
                        arrayOfSessions = {this.state.arrayOfSessions}
                        weeklyTime = {this.state.weeklyTime}
                        onMonthlyView = {this.handleMonthlyView}

                      />
                  }
                </Col>
              </Row>
              <Row className="show-grid" style={{marginTop:'20px'}}>
                <Col xs={12}>
                  <ButtonToolbar style={{display:'flex',justifyContent:'center'}}>
                    <Link to="/calendar/add">
                      <Button  bsStyle="success" style={{marginRight:'5px'}}>Add Reoccurance</Button>
                    </Link>
                    <Link to={newTo}>
                      <Button
                        disabled = {Object.keys(this.state.selectedReoccurance).length === 0}
                      >
                        Modify Reoccurance
                      </Button>
                    </Link>
                  </ButtonToolbar>
                </Col>

              </Row>
            </Grid>

          )
        }
      }


  export default Reoccurance;
