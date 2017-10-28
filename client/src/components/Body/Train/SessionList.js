  import React,{Component} from "react";
  import axios from 'axios';
  import {Table,Grid,Row,Col,Button,ButtonToolbar} from 'react-bootstrap';
  import SessionRows from './SessionRows';
  import {Link,Redirect} from 'react-router-dom';
  import PropTypes from 'prop-types';
  import {Icon} from 'react-fa'

  class SessionList extends Component{
    constructor(props){
      super(props);
      this.state = {
        userId: this.props.payLoad._id,
        arrayOfSessions: [],
        filteredArrayOfSessions: [],
        arrayOfTitles: [],
        selectedSession: '',
        redirectToDetails: false,
        filter: 'All',
        orderBy: 'createdAt',
        direction: 'positive'
      }
      this.handleSelectedThisRow = this.handleSelectedThisRow.bind(this);
      this.handleDoubleClick = this.handleDoubleClick.bind(this);
      this.handleFilterChange = this.handleFilterChange.bind(this);
      this.handleOrder = this.handleOrder.bind(this);
      this.sortOrderByBenchmark = this.sortOrderByBenchmark.bind(this);
      this.sortOrderByCreatedAt = this.sortOrderByCreatedAt.bind(this);
      this.sortOrderByUpdatedAt = this.sortOrderByUpdatedAt.bind(this);
      this.sortOrderByArrayOfExercises = this.sortOrderByArrayOfExercises.bind(this);
      this.sortOrderByStrength = this.sortOrderByStrength.bind(this);
      this.sortOrderByTemplate = this.sortOrderByTemplate.bind(this);
    }
    componentDidMount(){
      axios.get('/train/session/show/' + this.state.userId).then((res)=>{
        if(res.data){
          var titles = [];
          for(var i = 0; i < res.data.length;i++){
            if(titles.every((title)=>{
              return title !== res.data[i]._Template.Title
            })){
              titles.push(res.data[i]._Template.Title)
            }
          }
          this.setState({
            arrayOfSessions: res.data,
            filteredArrayOfSessions: res.data,
            arrayOfTitles: titles
          })
        }
      })

    }
    sortOrderByTemplate(first,second){

      var checkBenchmark1 = first._Template.Title;
      var checkBenchmark2 = second._Template.Title;
      if(this.state.direction === "positive"){
        if(checkBenchmark1 > checkBenchmark2){
          return -1;
        } else {
          return 1
        }
      } else {
        if(checkBenchmark1 > checkBenchmark2){
          return 1
        } else {
          return -1
        }
      }
    }
    sortOrderByUpdatedAt(first,second){
      var checkBenchmark1 = first.updatedAt;
      var checkBenchmark2 = second.updatedAt;
      if(this.state.direction === "positive"){
        if(checkBenchmark1 > checkBenchmark2){
          return -1;
        } else {
          return 1
        }
      } else {
        if(checkBenchmark1 > checkBenchmark2){
          return 1
        } else {
          return -1
        }
      }
    }
    sortOrderByStrength(first,second){
      var checkBenchmark1 = first.Strength;
      var checkBenchmark2 = second.Strength;
      if(this.state.direction === "positive"){
        if(checkBenchmark1 > checkBenchmark2){
          return -1;
        } else {
          return 1
        }
      } else {
        if(checkBenchmark1 > checkBenchmark2){
          return 1
        } else {
          return -1
        }
      }
    }
    sortOrderByCreatedAt(first,second){
      var checkBenchmark1 = first.createdAt;
      var checkBenchmark2 = second.createdAt;
      if(this.state.direction === "positive"){
        if(checkBenchmark1 > checkBenchmark2){
          return -1;
        } else {
          return 1
        }
      } else {
        if(checkBenchmark1 > checkBenchmark2){
          return 1
        } else {
          return -1
        }
      }
    }
    sortOrderByBenchmark(first,second){
      var checkBenchmark1 = first.BenchMark;
      if(this.state.direction === "positive"){
        if(checkBenchmark1 === true){
          return -1;
        } else {
          return 1
        }
      } else {
        if(checkBenchmark1 === true){
          return 1
        } else {
          return -1
        }
      }

    }
    sortOrderByArrayOfExercises(first,second){
      var checkBenchmark1 = first.ArrayOfExercises.length;
      var checkBenchmark2 = second.ArrayOfExercises.length;
      if(this.state.direction === "positive"){
        if(checkBenchmark1 > checkBenchmark2){
          return -1;
        } else {
          return 1
        }
      } else {
        if(checkBenchmark1 > checkBenchmark2){
          return 1
        } else {
          return -1
        }
      }

    }
    handleOrder(id){
      var copyOfSessions = this.state.filteredArrayOfSessions.slice()
      switch(id) {
          case 'BenchMark':
              this.setState({
                direction: this.state.direction === "negative"? 'positive':'negative',
                orderBy: 'BenchMark'
              },()=>{
                this.setState({
                  filteredArrayOfSessions:copyOfSessions.sort(this.sortOrderByBenchmark)
                })
              })
              break;
          case 'ArrayOfExercises':
          this.setState({
            direction: this.state.direction === "negative"? 'positive':'negative',
            orderBy: 'ArrayOfExercises'
          },()=>{
            this.setState({
              filteredArrayOfSessions:copyOfSessions.sort(this.sortOrderByArrayOfExercises)
            })
          })
              break;
          case 'Strength':
          this.setState({
            direction: this.state.direction === "negative"? 'positive':'negative',
            orderBy: 'Strength'
          },()=>{
            this.setState({
              filteredArrayOfSessions:copyOfSessions.sort(this.sortOrderByStrength)
            })
          })
              break;
          case 'templateAssociation':
          this.setState({
            direction: this.state.direction === "negative"? 'positive':'negative',
            orderBy: 'templateAssociation'
          },()=>{
            this.setState({
              filteredArrayOfSessions:copyOfSessions.sort(this.sortOrderByTemplate)
            })
          })
              break;
          case 'createdAt':
          this.setState({
            direction: this.state.direction === "negative"? 'positive':'negative',
            orderBy: 'createdAt'
          },()=>{
            this.setState({
              filteredArrayOfSessions:copyOfSessions.sort(this.sortOrderByCreatedAt)
            })
          })
              break;
          case 'updatedAt':
          this.setState({
            direction: this.state.direction === "negative"? 'positive':'negative',
            orderBy: 'updatedAt'
          },()=>{
            this.setState({
              filteredArrayOfSessions:copyOfSessions.sort(this.sortOrderByUpdatedAt)
            })
          })
              break;
          default:
      }
    }

    handleFilterChange(name, value){
      var newFilteredArray = []

      this.setState({
        [name]: value
      })
      if(value !== 'All'){
      newFilteredArray = this.state.arrayOfSessions.filter((session,index,array)=>{
        return (
          session._Template.Title === value
        )
      })
      this.setState({
        filteredArrayOfSessions: newFilteredArray,
        selectedSession: ''
      })
    } else {
      this.setState({
        filteredArrayOfSessions: this.state.arrayOfSessions,
        selectedSession:''
      })
    }
    }
    handleDoubleClick(selectedObject){
      this.setState({
          selectedSession: selectedObject
      },()=>{
        this.setState({
          redirectToDetails: true
        })
      })
    }
    handleSelectedThisRow(selectedObject){
      this.setState({
        selectedSession: selectedObject
      })
    }
    render(){
      var edit = { pathname: '/sessions/edit/', sessionObject: this.state.selectedSession};

      return(
        <Grid fluid>
          {
            this.state.redirectToDetails &&
              <Redirect to={edit} />
          }
          <Row className="show-grid">
            <Col xs={12} ><h4 style={{textAlign:'center'}}>Session List</h4></Col>
          </Row>

          <hr></hr>
          <Row className="show-grid">
            <Col xs={12}>
              <h4 style={{textAlign:'center'}}>
                <select onChange={(e)=>{this.handleFilterChange(e.target.name,e.target.value)}} name="filter" value={this.state.filter}>
                  <option>All</option>
                  {this.state.arrayOfTitles.map((title)=>{
                    return (
                      <option key={title}>
                        {title}
                      </option>
                    )
                  })}
                </select>
              </h4>

            </Col>
          </Row>
          <Row className="show-grid" style={{maxHeight:'400px', overflow: "scroll"}}>
            <Col xs={12}>

              <Table responsive bordered condensed hover >
                <thead>
                  <tr>
                    <th id="createdAt" onClick={(e)=>{this.handleOrder(e.target.id)}}>
                      Completed
                      {this.state.orderBy ==="createdAt" && this.state.direction==="negative" ? <Icon name="arrow-down" style={{color:'red'}} />: ''}
                      {this.state.orderBy ==="createdAt" && this.state.direction==="positive" ? <Icon name="arrow-up" style={{color:'green'}} />: ''}
                    </th>
                    <th id="Strength" onClick={(e)=>{this.handleOrder(e.target.id)}}>
                      Strength
                      {this.state.orderBy ==="Strength" && this.state.direction==="negative" ? <Icon name="arrow-down" style={{color:'red'}} />: ''}
                      {this.state.orderBy ==="Strength" && this.state.direction==="positive" ? <Icon name="arrow-up" style={{color:'green'}} />: ''}
                    </th>
                    <th id="templateAssociation" onClick={(e)=>{this.handleOrder(e.target.id)}}>
                      Template
                      {this.state.orderBy ==="templateAssociation" && this.state.direction==="negative" ? <Icon name="arrow-down" style={{color:'red'}} />: ''}
                      {this.state.orderBy ==="templateAssociation" && this.state.direction==="positive" ? <Icon name="arrow-up" style={{color:'green'}} />: ''}
                    </th>
                    <th id="BenchMark" onClick={(e)=>{this.handleOrder(e.target.id)}}>
                      BenchMarked
                      {this.state.orderBy ==="BenchMark"  && this.state.direction ==="positive"? <Icon name="arrow-up" style={{color:'green'}}/>: '' }
                      {this.state.orderBy ==="BenchMark" && this.state.direction ==="negative"? <Icon name="arrow-down" style={{color:'red'}}/>: '' }

                    </th>


                  </tr>
                </thead>
                <tbody>
                  {this.state.filteredArrayOfSessions.map((session)=>{
                    return (
                      <SessionRows
                        key={session._id}
                        sessionObject = {session}
                        selectedSession = {this.state.selectedSession}
                        OnSelectedThisRow = {this.handleSelectedThisRow}
                        OnDoubleClick = {this.handleDoubleClick}
                      />
                    )
                  })}

                </tbody>
              </Table>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col xs={12}>
              <ButtonToolbar style={{display:'flex',justifyContent:'center'}}>
                <Link to="/sessions/add">
                  <Button  bsStyle="success" style={{marginTop:'20px'}}>Add Session</Button>
                </Link>
                <Button
                  style={{backgroundColor:'lightGray'}}
                  style={{marginTop:'20px'}}
                  onClick={()=>{this.handleDoubleClick(this.state.selectedSession)}}
                  disabled = {!this.state.selectedSession}
                >
                  Modify Session
                </Button>
              </ButtonToolbar>
            </Col>
          </Row>
        </Grid>
      )
    }
  }
  SessionList.propTypes = {
    payLoad: PropTypes.object.isRequired
  }
  export default SessionList;
