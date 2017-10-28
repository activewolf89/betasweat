  import React,{Component} from "react";
  import Header from './Header/Header.js';
  import Footer from './Footer/Footer.js';
  import Home from './Body/Home/Home.js';
  //train
  import TrainingSession from './Body/Train/TrainingSession.js';
  import Templates from './Body/Train/Templates.js';
  import TemplateAdd from './Body/Train/TemplateAdd.js';
  import TemplateDetails from './Body/Train/TemplateDetails.js';

  //Calendar
  import Calendar from './Body/Calendar/Calendar.js';
  import AddCalendar from './Body/Calendar/AddCalendar.js';
  import EditCalendar from './Body/Calendar/EditCalendar.js';
  import Reoccurance from './Body/Calendar/Reoccurance.js';
  //exercise
  import Exercise from './Body/Train/Exercise.js';
  import SessionResults from './Body/Train/SessionResults.js';
  import SessionList from './Body/Train/SessionList.js';
  import AddExercise from './Body/Train/AddExercise.js';
  import Progress from './Body/Progress/Progress.js';
  import ExerciseDetails from './Body/Train/ExerciseDetails.js';
  //User
  import NoMatch from './Body/User/NoMatch.js';
  import Profile from './Body/User/Profile.js';
  import ForgotPassword from './Body/User/ForgotPassword.js';
  import CreateNewPassword from './Body/User/CreateNewPassword.js';
  import ShowImage from './Body/User/ShowImage.js';
  //
  import Contact from './Body/AboutWeb/Contact.js';
  import Login from './Body/User/Login.js';
  import Register from './Body/User/Register.js';
  import {Route,Redirect,Switch} from 'react-router-dom';
  import LoggedIn from './../CommonHelpers/LoggedIn.js';
  import {Grid,Row} from 'react-bootstrap';
  import axios from 'axios';
  class App extends Component{
    constructor(props){
      super(props);
      this.state = {
        redirectToHome: false,
        userInfo: ''
      }
      this.handleLogOut = this.handleLogOut.bind(this);
      this.isLoggedIn = this.isLoggedIn.bind(this);
      this.checkJWT = this.checkJWT.bind(this);
    }
    checkJWT(object){
      if(!object.match.params){
        return false;
      } else {
        const jwt = object.match.params.jwt;
          var payload;

          payload = jwt.split('.')[1];
          payload = window.atob(payload);
          payload = JSON.parse(payload);
          if(payload.exp >= Date.now() / 1000){
            axios.get(`/user/checkvalidation/${payload.email}/${payload.token}`).then((res)=>{
              if(res.data){
                sessionStorage.setItem('aToken', res.data);

                return true
              } else {
                return false
              }
            })

          } else {
            return false
          }



      }

    }
    isLoggedIn(){
          if(LoggedIn.isLoggedIn()){
            return true
          } else {

            return false;
          }
        }

    handleLogOut(){
      LoggedIn.logOut()
      this.setState({
        redirectToHome: true
      }, ()=>{this.setState({redirectToHome: false})})
    }
    render(){
      return(
        <Grid fluid>
          <Header loggedIn= {LoggedIn.isLoggedIn()} logOut={this.handleLogOut}/>
          <Row className="show-grid" >

            <div>
              {
                this.state.redirectToHome &&
                  <Redirect to="/" />
              }

              <Switch>
                <Route exact path = "/imagepath/"
                  render = {(e)=>
                    <ShowImage props={e}/>
                  }/>
                <Route exact path = "/createpassword/:jwt"
                  render = {(e)=>
                    this.checkJWT(e) ? <Redirect to="/login" />:<CreateNewPassword userInfo={e}  />
                  }/>

                <Route exact path = "/sessions/add"
                  render={(e) =>
                    this.isLoggedIn() ? <TrainingSession params = {e} payLoad = {LoggedIn.getPayLoad()} /> : <Redirect to="/login" />

                  }/>
                <Route exact path = "/calendar"
                  render={() =>
                    this.isLoggedIn() ? <Calendar payLoad = {LoggedIn.getPayLoad()} /> : <Redirect to="/login" />

                  }/>
                <Route exact path = "/reoccurance"
                  render={() =>
                    this.isLoggedIn() ? <Reoccurance payLoad = {LoggedIn.getPayLoad()} /> : <Redirect to="/login" />

                  }/>
                <Route exact path = "/forgotpassword"
                  render={() =>
                    <ForgotPassword />

                  }/>

                <Route exact path = "/calendar/add"
                  render={() =>
                    this.isLoggedIn() ? <AddCalendar payLoad = {LoggedIn.getPayLoad()} /> : <Redirect to="/login" />

                  }/>
                <Route exact path = "/calendar/edit"
                  render={(e) =>
                    this.isLoggedIn() ? <EditCalendar params={e} payLoad = {LoggedIn.getPayLoad()} /> : <Redirect to="/login" />

                  }/>
                <Route exact path = "/sessions/edit"
                  render={(params) =>
                    this.isLoggedIn() ? <TrainingSession params = {params} payLoad = {LoggedIn.getPayLoad()} /> : <Redirect to="/login" />

                  }/>
                <Route exact path = "/session/results"
                  render={(e) =>
                    this.isLoggedIn() ? <SessionResults onLogOut={this.handleLogOut} params={e} payLoad = {LoggedIn.getPayLoad()} /> : <Redirect to="/login" />

                  }/>
                <Route exact path = "/sessions"
                  render={(e) =>
                    this.isLoggedIn() ? <SessionList onLogOut={this.handleLogOut} payLoad = {LoggedIn.getPayLoad()} /> : <Redirect to="/login" />

                  }/>
                <Route exact path = "/progress"
                  render={(props) =>
                    this.isLoggedIn() ? <Progress  params = {props} payLoad = {LoggedIn.getPayLoad()} /> : <Redirect to="/login" />

                  }/>
                <Route exact path = "/exercises"
                  render={() =>
                    this.isLoggedIn() ? <Exercise payLoad = {LoggedIn.getPayLoad()} /> : <Redirect to="/login" />

                  }/>
                <Route exact path = "/exercise/edit/:title"
                  render={(props) =>
                    this.isLoggedIn() ? <ExerciseDetails params = {props} title={props.match.params.title} payLoad = {LoggedIn.getPayLoad()} /> : <Redirect to="/login" />

                  }/>
                <Route exact path = "/exercises/add"
                  render={() =>
                    this.isLoggedIn() ? <AddExercise payLoad = {LoggedIn.getPayLoad()} /> : <Redirect to="/login" />

                  }/>

                <Route exact path = "/templates"
                  render={() =>
                    this.isLoggedIn() ? <Templates payLoad = {LoggedIn.getPayLoad()} /> : <Redirect to="/login" />

                  }/>


                <Route exact path = "/profile"
                  render={() =>
                    this.isLoggedIn() ? <Profile payLoad = {LoggedIn.getPayLoad()} /> : <Redirect to="/login" />

                  }/>
                <Route exact path = "/templates/edit/:title"
                  render={(e) =>
                    this.isLoggedIn() ? <TemplateDetails params = {e} payLoad = {LoggedIn.getPayLoad()} /> : <Redirect to="/login" />

                  }/>
                <Route exact path = "/templates/add"
                  render={(e) =>
                    this.isLoggedIn() ? <TemplateAdd payLoad = {LoggedIn.getPayLoad()} /> : <Redirect to="/login" />

                  }/>

                <Route exact path= "/login" component={Login} />
                <Route exact path="/contact" component={Contact} />
                <Route exact path= "/register" component={Register} />
                <Route exact path = "/" component={Home} />
                <Route component={NoMatch} />
              </Switch>
            </div>


          </Row>
          <Footer/>

        </Grid>
      )
    }
  }

  export default App;
