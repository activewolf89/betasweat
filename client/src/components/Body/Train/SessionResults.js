  import React,{Component} from "react";
  import {Grid,Row,Col,Button,Table} from 'react-bootstrap';
  import {Redirect,Link} from 'react-router-dom';
import {Icon} from 'react-fa'
  class SessionResults extends Component{
    render(){
      const ArrayOfExercises = !this.props.params.location.singleSessionObjectArray ? []:  this.props.params.location.singleSessionObjectArray.ArrayOfExercises
      var tableRows = ArrayOfExercises.map((exercise)=>{
        return (
          <tr key={exercise.key}>
            <td>

              {exercise.currentStrength - exercise.pastStrength > 0 ? <Icon name="arrow-up" style={{color:'green'}} />
                : exercise.currentStrength - exercise.pastStrength < 0 ? <Icon name="arrow-down" style={{color:'red'}} />:""}
              {isNaN((((exercise.currentStrength - exercise.pastStrength)/exercise.pastStrength)*100).toFixed(2)) ? 0:(((exercise.currentStrength - exercise.pastStrength)/exercise.pastStrength)*100).toFixed(2)}
              %
            </td>
            <td>{exercise.title}</td>
            <td>{exercise.currentStrength.toFixed(2)}</td>
            <td>{exercise.pastStrength.toFixed(2)}</td>
          </tr>

        )
      })
      const progress = {pathname: '/progress', templateObject: this.props.params.location.singleSessionObjectArray }
      return(
        <Grid style={{background:'white', border:'1px solid black'}}>
          {
            ArrayOfExercises.length===0 &&
              <Redirect to="/" />
          }
          <Row className="show-grid">
            <Col md={12}>
              <h3 style={{textAlign:'center'}}>
              </h3>
            </Col>
          </Row>
          <hr></hr>
          <Row className="show-grid">
            <Table bordered style={{background:'white'}}>
              <thead>
                <tr>

                  <th>
                    Change
                    %
                  </th>
                  <th>
                    Title
                  </th>
                  <th>
                    Current Session
                  </th>
                  <th>
                    Previous Session
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableRows}
              </tbody>
            </Table>
          </Row>
          <hr></hr>
          <Row className="show-grid">
            <Col md={12}>
              <h3 style={{textAlign:'center'}}>What's Next?</h3>
            </Col>
          </Row>
          <Row className="show-grid" style={{marginBottom:'20px'}}>
            <Col md={12}>
              <Link to={progress}>
                <Button bsStyle="primary" style={{width:'100%'}}>See Detailed Performance</Button>
              </Link>
            </Col>
          </Row>
          <Row className="show-grid" style={{marginBottom:'20px'}}>

            <Col md={12}>
              <Link to="/sessions/add">
                <Button bsStyle="success" style={{width:'100%'}}>Start A New Session</Button>
              </Link>
            </Col>
          </Row>
          <Row className="show-grid" style={{marginBottom:'20px'}}>

            <Col md={12}>
              <Button onClick={this.props.onLogOut} bsStyle="danger" style={{width:'100%'}}>Exit And Log Out</Button>
            </Col>
          </Row>
        </Grid>

      )
    }
  }

  export default SessionResults;
