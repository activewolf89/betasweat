import React,{Component} from "react";
import axios from 'axios';
import {Table,Button,Grid,Row,Col,ButtonToolbar} from 'react-bootstrap';
import {Link,Redirect} from 'react-router-dom';
import ExerciseRows from './ExerciseRows.js'
class Exercise extends Component{
  constructor(props){
    super(props);
    this.state = {
      selectedExercise: {},
      filter: '',
      filteredArrayOfExerciseObjects: [],
      arrayOfExerciseObjects: [],
      userId: this.props.payLoad._id,
      message: '',
      listOfTemplateObjects: [],
      redirectToDetails: false
    }
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSelectedThisRow = this.handleSelectedThisRow.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }
  componentDidMount(){
    axios.get('/seetemplate/show//' + this.state.userId).then((templateResponse)=>{
      this.setState({
        listOfTemplateObjects: templateResponse.data.length !== 0 ? templateResponse.data: []
      })

   })
    axios.get('/train/exercises/showAll/'+ this.state.userId).then((exerciseResponse)=>{
        this.setState({
          arrayOfExerciseObjects: exerciseResponse.data,
          filteredArrayOfExerciseObjects: exerciseResponse.data
        })

    }).catch((error)=>{
      this.setState({
        message: error
      })
    })
  }
  handleDoubleClick(selectedObject){
    this.setState({
        selectedExercise: selectedObject
    },()=>{
      this.setState({
        redirectToDetails: true
      })
    })
  }
  handleSelectedThisRow(selectedObject){
    this.setState({
      selectedExercise: selectedObject
    })
  }
  handleFilterChange(name,value){
    var arrayOfFilteredObjects = this.state.arrayOfExerciseObjects.slice()
    if(value === "UNASSOCIATED"){
      arrayOfFilteredObjects = arrayOfFilteredObjects.filter((exercise)=>{
        return(exercise._Templates.length === 0)
      })
      }
    if(value !== "UNASSOCIATED" && value !== "ALL"){
      arrayOfFilteredObjects = arrayOfFilteredObjects.filter((exercise)=>{
        return(exercise._Templates.some((templates)=>{
          return(
            templates.Title === value
          )
        }))
      })
    }

    this.setState({
      [name]:value,
      filteredArrayOfExerciseObjects: arrayOfFilteredObjects,
      selectedExercise: ''
    })
  }
  render(){

      var newTo = { pathname: '/exercise/edit/' + this.state.selectedExercise.Title, templateObject: this.state.selectedExercise, arrayOfExerciseObjects: this.state.arrayOfExerciseObjects  };

    return(
      <Grid fluid>
        {
          this.state.redirectToDetails &&
            <Redirect to={newTo} />
        }
        <Row className="show-grid">
          <Col xs={12} ><h4 style={{textAlign:'center'}}>Exercise List</h4></Col>
        </Row>
        <hr></hr>
        <Row className="show-grid">
          <Col xs={12}>
            <h4 style={{textAlign:'center'}}> 
              <select onChange={(e)=>{this.handleFilterChange(e.target.name,e.target.value)}} name="filter" value={this.state.filter}>
                <option>ALL</option>
                {
                  this.state.listOfTemplateObjects.map((template)=>{
                    return(
                      <option key={template._id}>{template.Title}</option>
                    )
                  })
                }
                <option>UNASSOCIATED</option>

              </select>
            </h4>

          </Col>
        </Row>
        {
          this.state.message &&
            <Row className="show-grid">
              <Col xs={12}>
                <h4>{this.state.message}</h4>
              </Col>
            </Row>
        }
        <hr></hr>
        <Row className="show-grid" style={{ maxHeight:'400px', overflow: "scroll"}}>
          <Col xs={12}>
            <Table bordered condensed hover >
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Associated Templates</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.filteredArrayOfExerciseObjects.map((exercise)=>{
                    return <ExerciseRows
                      key={exercise._id}
                      exerciseObject = {exercise}
                      OnSelectedThisRow = {this.handleSelectedThisRow}
                      OnDoubleClick = {this.handleDoubleClick}
                      selectedExercise = {this.state.selectedExercise}

                    />
                  })
                }
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="show-grid">
          <Col xs={12}>
            <ButtonToolbar style={{display:'flex',justifyContent:'center'}}>
              <Link to='/exercises/add'>
                <Button bsStyle="success" style={{marginRight:'5px'}}>Add Exercise</Button>
              </Link>
              <Link to={newTo}>
                <Button style={{backgroundColor:'lightGray'}} disabled={Object.keys(this.state.selectedExercise).length === 0}>Modify Exercise</Button>
              </Link>
            </ButtonToolbar>
          </Col>
        </Row>
      </Grid>

    )
  }
}

export default Exercise;
