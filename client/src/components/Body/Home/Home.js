  import React,{Component} from "react";
  import axios from 'axios';
  import {Redirect} from 'react-router-dom';
  import {Grid,Row,Col,Table} from 'react-bootstrap';
  import {Icon} from 'react-fa';
  import YoutubePlayer from 'react-youtube-player';
  <link rel="stylesheet" href="/css/video-react.css" />

  class Home extends Component{
    constructor(props) {
      super(props);
      this.state ={

      }

    }

    render() {

      return (
        <Grid>
          <Row className="show-grid">
            <Col xs={12} ><h4 style={{textAlign:'center'}}>Major Features</h4></Col>
          </Row>
          <Row className="show-grid">
            <Col xs={12} >

              <Table>

                <tbody>
                  <tr>
                    <td>Ability for Systematic Workouts</td>
                    <td><Icon style={{color:'green'}} name="check" /></td>
                  </tr>
                  <tr>
                    <td>Flexible Start/Stop Clock For Accurate Timings</td>
                    <td><Icon style={{color:'green'}} name="check" /></td>
                  </tr>
                  <tr>
                    <td>Track Progress with Visual Data Representation</td>
                    <td><Icon style={{color:'green'}} name="check" /></td>
                  </tr>
                  <tr>
                    <td>Ability to Set Up Scheduling</td>
                    <td><Icon style={{color:'green'}} name="check" /></td>
                  </tr>
                  <tr>
                    <td>Email Notifications On Exercise Days</td>
                    <td><Icon style={{color:'green'}} name="check" /></td>
                  </tr>

                </tbody>
              </Table>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col xs={12} style={{height:'400px'}}>

              <YoutubePlayer
                height= '390'
                width= '640'
                videoId="dkMIr5q8wM4"

              />
            </Col>
          </Row>

        </Grid>
     )
    }
  }

  export default Home;
