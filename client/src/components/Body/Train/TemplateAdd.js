  import React,{Component} from "react";
  import {Grid,Row,Col,Button} from 'react-bootstrap';
  import checkTemplate from './../../../CommonHelpers/CheckTemplate.js';
  import axios from 'axios';
  import PropTypes from 'prop-types';

  class TemplateAdd extends Component{
    constructor(props){
      super(props);
      this.state = {
        title: '',
        description: '',
        category: '--select--',
        message: '',
        formErrors: {},
        arrayOfTemplateObjects: [],
        userId: this.props.payLoad._id
      }
    this.handleAdd = this.handleAdd.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

    }
    componentDidMount(){
      axios.get('/seetemplate/show/'+ this.state.userId).then((res)=>{

        this.setState({
          arrayOfTemplateObjects: res.data.length === 0 ? []: res.data,
        })
      })
    }
    handleKeyPress(e){
      if (e.key === 'Enter') {
      this.handleAdd()
    }
    }
    handleInputChange(value,name){


        this.setState({
          [name]:value
        })

    }
    handleAdd(){
      var inputErrorObjects = checkTemplate.checkAddTemplate(this.state.title.toUpperCase(),this.state.description, this.state.category, this.state.arrayOfTemplateObjects)
      if(Object.keys(inputErrorObjects).length === 0){

        axios({
          method:'post',
          url: '/train/templates/add',
          data: {
            title: this.state.title.toUpperCase(),
            description: this.state.description,
            userId: this.props.payLoad._id,
            category:this.state.category,
            arrayOfTemplateObjects: this.state.arrayOfTemplateObjects
          }
        }).then((res)=>{
          this.setState({
            title: '',
            style: '--select--',
            category: '--select--',
            description: '',
            message: 'Successfully Added ' + this.state.title ,
            formErrors: {},
            arrayOfTemplateObjects: res.data
          })
        }).catch((err)=>{
          console.log(err)
          this.setState({
            message: 'There were errors in saving'
          })
        })

      }
      this.setState({
        formErrors: inputErrorObjects
      })
    }
    render(){
      return(
        <Grid>

          <form onKeyPress={this.handleKeyPress}>
            <Row className="show-grid">
              <Col xs={12} ><h4 style={{textAlign:'center'}}>New Template</h4></Col>
            </Row>
            {
              this.state.message &&
                <Row className="show-grid">
                  <Col xs={12}>
                    <h4 style={{color:'purple', textAlign:'center'}}>{this.state.message}</h4>
                  </Col>
                </Row>
            }
            <hr></hr>
            <Row className="show-grid">
              <Col xs={12}>
                <label> Title:</label>
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
                  <Col xs={12}>
                    <span style={{color:'red'}}>{this.state.formErrors.description}</span>
                  </Col>
                </Row>
            }

            <Row className="show-grid">
              <Col xs={12}>
                <Button bsStyle="success" onClick={this.handleAdd} style={{width:'100%', marginTop:'20px', marginBottom:'20px'}}>Add</Button>

              </Col>

            </Row>
            {
              this.props.onReturn &&
                <Row className="show-grid">
                  <Col xs={12}>
                    <Button bsStyle="primary" onClick={this.props.onReturn} style={{width:'100%', marginTop:'20px', marginBottom:'20px'}}>Return To Exercises</Button>

                  </Col>

                </Row>
            }
            {
              this.props.returnToSession &&
                <Row className="show-grid">
                  <Col xs={12}>
                    <Button bsStyle="primary" onClick={this.props.returnToSession} style={{width:'100%', marginTop:'20px', marginBottom:'20px'}}>Return To Session</Button>

                  </Col>

                </Row>
            }

          </form>
        </Grid>
      )
    }
  }
TemplateAdd.propTypes = {
  payLoad: PropTypes.object.isRequired,
  onReturn: PropTypes.func,
  returnToSession: PropTypes.func,
}
  export default TemplateAdd;
