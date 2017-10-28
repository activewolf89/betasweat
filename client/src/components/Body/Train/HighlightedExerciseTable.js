import React,{Component} from "react";
import {Table,Row,Col} from 'react-bootstrap';
import axios from 'axios';
class HighlightedExerciseTable extends Component{
  constructor(props){
    super(props);
    this.state = {

    }
  }
  componentDidMount(){
    axios.get('/train/highlightedTemplate').then((res)=>{
      console.log(res)
    })
  }
  render(){
    return(
      <Col md={8} mdOffset={2} style={{background:'white', border:'1px solid black',height:'500px'}}>
        <Row className="show-grid">
          <h1 style={{textAlign:'center'}}>Public Exercises</h1>
        </Row>
        <Row className="show-grid">


          <Table bordered condensed hover >
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
          </Table>

        </Row>
      </Col>
        )
        }
        }

        export default HighlightedExerciseTable;
