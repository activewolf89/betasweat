  import React,{Component} from "react";
  import {Grid,Row,Col,Button,ButtonToolbar} from 'react-bootstrap';
  import checkTemplate from './../../../CommonHelpers/CheckTemplate.js';
  import {Redirect}  from 'react-router-dom';
  import axios from 'axios';
  require('./TheTrainingCss.css')
  class TemplateDetails extends Component{
    constructor(props){
      super(props);
      this.state={
        title: '',
        description: '',
        selectedTemplateObject: {},
        originalTitle: '',
        message: '',
        formErrors: {},
        modalShown: 0,
        showModal: false,
        category: '--select--',
        redirect: false
      }
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleRemove = this.handleRemove.bind(this);
      this.handleUpdate = this.handleUpdate.bind(this);
    }
    componentDidMount(){
      if(!this.props.params.location.templateObject){
        this.props.params.history.goBack()

      }else{
        const {Description,Title,Highlighted,Category} = this.props.params.location.templateObject;
        this.setState({
          originalTitle: Title,
          title: Title,
          category: Category,
          description: Description,
          selectedTemplateObject: this.props.params.location.templateObject,
          arrayOfTemplateObjects: this.props.params.location.arrayOfTemplateObjects
        })

      }
    }

    handleUpdate(){
      var inputErrorObjects = checkTemplate.checkUpdateTemplate(this.state.originalTitle.toUpperCase(),this.state.title.toUpperCase(),this.state.description,this.state.category,this.state.highlighted,this.state.arrayOfTemplateObjects)
      if(Object.keys(inputErrorObjects).length === 0){
        axios({
          method: 'post',
          data: {
            originalTitle: this.state.originalTitle,
            title: this.state.title,
            description: this.state.description,
            category: this.state.category,
            userId: this.props.payLoad._id,
            templateId: this.state.selectedTemplateObject._id

          },
          url: '/train/template/update'
        }).then((res)=>{
          this.setState({
            message: `Update Successful for ${this.state.title}`
          })

        }).catch((err)=>{
          this.setState({
            message: err
          })
        })
      }
      this.setState({
        formErrors: inputErrorObjects
      })
    }
    handleRemove(){

      axios.get('/train/templates/remove/' + this.state.selectedTemplateObject._id + '/' + this.props.payLoad._id).then((res)=>{
        this.setState({
          redirect: true
        })
      }).catch((err)=>{
        this.setState({
          message: err
        })
      })
    }
    handleInputChange(value,name){

      this.setState({
        [name]:value
      })

    }
    render(){

      return(
        <Grid fluid>
          {
            this.state.redirect &&
              <Redirect to="/templates" />
          }
          <Row className="show-grid">
            <Col xs={12} ><h4 style={{textAlign:'center'}}>Update Template</h4></Col>
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
                <label> Title</label>
              </Col>

            </Row>
            <Row className="show-grid">
              <Col xs={12}>
                <input
                  style={{width:'100%'}}
                  type="text"
                  className={this.state.formErrors.title ? 'error':'notError'}
                  onChange={(e)=>{this.handleInputChange(e.target.value,e.target.name)}}
                  value={this.state.title}
                  name="title">
                </input>
              </Col>
            </Row>

            {
              this.state.formErrors.title &&
                <Row className = "show-grid">
                  <Col  xs={12}>
                    <span style={{color:'red'}}>{this.state.formErrors.title}</span>
                  </Col>
                </Row>
            }

            <Row className="show-grid">
              <Col xs={12}>
                <label> Category:</label>
              </Col>

            </Row>
            <Row className="show-grid">
              <Col xs={12}>
                <select className={this.state.formErrors.category ? 'error':'notError'} onChange={(e)=>{this.handleInputChange(e.target.value,e.target.name)}} value={this.state.category} name="category">
                  <option disabled name="select">--select--</option>
                  <option>Fingers</option>
                  <option>Arms</option>
                  <option>Shoulders</option>
                  <option>Back</option>
                  <option>Core</option>
                  <option>Legs</option>
                  <option>Multiple</option>
                </select>
              </Col>
            </Row>

            {
              this.state.formErrors.category &&
                <Row className = "show-grid">
                  <Col xs={12}>
                    <span style={{color:'red'}}>{this.state.formErrors.category}</span>
                  </Col>
                </Row>
            }
            <Row className="show-grid">
              <Col xs={12}>
                <label> Description:</label>
              </Col>

            </Row>
            <Row className="show-grid">
              <Col xs={12}>
                <textarea className={this.state.formErrors.description ? 'error':'notError'}
                  type="text" onChange={(e)=>{this.handleInputChange(e.target.value,e.target.name)}} value={this.state.description} name="description" ></textarea>
              </Col>
            </Row>

            {
              this.state.formErrors.description &&
                <Row className = "show-grid">
                  <Col xsOffset={2} xs={12}>
                    <span style={{color:'red'}}>{this.state.formErrors.description}</span>
                  </Col>
                </Row>
            }
            <hr></hr>

            <Row className="show-grid">
              <Col xs={12}>
                <ButtonToolbar style={{display:'flex',justifyContent:'center'}}>
                  <Button bsStyle="success" onClick={this.handleUpdate} style={{width:'100%', marginTop:'20px', marginBottom:'20px'}}>Update Template</Button>
                  <Button bsStyle="danger" onClick={this.handleRemove} style={{width:'100%', marginTop:'20px', marginBottom:'20px'}}>Delete Template</Button>
                </ButtonToolbar>

              </Col>
            </Row>
          </form>
        </Grid>

      )
    }
  }

  export default TemplateDetails;
