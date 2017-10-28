  import React,{Component} from "react";
  import axios from 'axios';
  import {ButtonToolbar,Table,Grid,Row,Col,Button} from 'react-bootstrap';

  import TemplateRows from './TemplateRows';
  import {Link,Redirect} from 'react-router-dom';
  import PropTypes from 'prop-types';

  class Templates extends Component{
    constructor(props){
      super(props);
      this.state = {
        userId: this.props.payLoad._id,
        arrayOfTemplateObjects: [],
        filteredArrayOfTemplateObjects: [],
        selectedTemplate: {},
        redirectToDetails: false,
        filter: 'All'
      }
      this.handleSelectedThisRow = this.handleSelectedThisRow.bind(this);
      this.handleDoubleClick = this.handleDoubleClick.bind(this);
      this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount(){
      axios.get('seetemplate/show/'+ this.state.userId).then((res)=>{

        this.setState({
          arrayOfTemplateObjects: res.data.length === 0 ? []: res.data,
          filteredArrayOfTemplateObjects: res.data.length === 0 ? []: res.data
        })
      })
    }
    handleFilterChange(name, value){
      var newFilteredArray = []
      this.setState({
        [name]: value
      })
      if(value !== 'All'){
      newFilteredArray = this.state.arrayOfTemplateObjects.filter((template,index,array)=>{
        return (
          template.Category === value
        )
      })
      this.setState({
        filteredArrayOfTemplateObjects: newFilteredArray,
        selectedTemplate: ''
      })
    } else {
      this.setState({
        filteredArrayOfTemplateObjects: this.state.arrayOfTemplateObjects,
        selectedTemplate: ''
      })
    }
    }
    handleDoubleClick(selectedObject){
      this.setState({
          selectedTemplate: selectedObject
      },()=>{
        this.setState({
          redirectToDetails: true
        })
      })
    }
    handleSelectedThisRow(selectedObject){
      this.setState({
        selectedTemplate: selectedObject
      })
    }
    render(){
      var newTo = { pathname: '/templates/edit/' + this.state.selectedTemplate.Title, templateObject: this.state.selectedTemplate, arrayOfTemplateObjects: this.state.arrayOfTemplateObjects,  };
      var secondNewTo = {pathname: "/templates/add"}
      var arrayOfTitles = [];
      var templateCategories = this.state.arrayOfTemplateObjects.map((template,index,array)=>{
        if(arrayOfTitles.every((element)=>{return template.Category !== element})){
          arrayOfTitles.push(template.Category)

        return(
          <option key={template._id}>
            {template.Category}
          </option>
        )
      }
      })
      return(
        <Grid fluid>
          {
            this.state.redirectToDetails &&
              <Redirect to={newTo} />
          }
          <Row className="show-grid">
            <Col xs={12} ><h4 style={{textAlign:'center'}}>Template List</h4></Col>
          </Row>
          <hr></hr>
          <Row className="show-grid">

            <Col xs={12}>
              <h4 style={{textAlign:'center'}}> 
                <select onChange={(e)=>{this.handleFilterChange(e.target.name,e.target.value)}} name="filter" value={this.state.filter}>
                  <option>All</option>

                  {templateCategories}

                </select>
              </h4>

            </Col>
          </Row>
          <hr></hr>
          <Row className="show-grid" style={{maxHeight:'400px', overflow: "scroll"}}>
            <Col xs={12}>

              <Table responsive bordered condensed hover >
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th># of exercises</th>
                    <th># of sessions</th>

                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.filteredArrayOfTemplateObjects.map((template)=>{
                      return <TemplateRows
                        key={template._id}
                        templateObject = {template}
                        selectedTemplate = {this.state.selectedTemplate}
                        OnSelectedThisRow = {this.handleSelectedThisRow}
                        OnDoubleClick = {this.handleDoubleClick}
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
                <Link to={secondNewTo}>
                  <Button style={{marginRight:'5px'}} bsStyle="success">Add Template</Button>
                </Link>
                <Link to={newTo}>
                  <Button style={{backgroundColor:'lightGray'}} disabled={Object.keys(this.state.selectedTemplate).length === 0}>Modify Template</Button>
                </Link>
              </ButtonToolbar>
            </Col>
          </Row>

        </Grid>
          )
          }
          }
        Templates.propTypes = {
          payLoad: PropTypes.object.isRequired
        }
  export default Templates;
