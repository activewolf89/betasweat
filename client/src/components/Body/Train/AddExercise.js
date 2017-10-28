
import React,{Component} from "react";
import {Grid,Row,Col,Button} from 'react-bootstrap';
import axios from 'axios';
import {Redirect} from 'react-router';
import CheckExercise from './../../../CommonHelpers/CheckExercise.js';
import TemplateAdd from './TemplateAdd.js';
class AddExercise extends Component{
  constructor(props){
    super(props);
    this.state = {
      title: "",
      trainingMetric: true,
      redirectTo:"",
      templateSelection: [],
      templatesOn: [],
      description: "",
      arrayOfTitles: [],
      exerciseMessage: "",
      templateData: [],
      file: '',
      preview: '',
      payLoad: '',
      quickAddTemplate:false,
      formErrors: {},
      bodyWeightQuestion: true,

    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleTrainingMetric = this.handleTrainingMetric.bind(this);
    this.handleExercise = this.handleExercise.bind(this);
    this.handleTemplateOptions = this.handleTemplateOptions.bind(this);
    this.handleAddTemplate = this.handleAddTemplate.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.handleBodyWeightMetric = this.handleBodyWeightMetric.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.clearForm = this.clearForm.bind(this);

}

componentDidMount(){
  var exerciseString = '';
  if(this.props.goBack){
    exerciseString = this.props.payLoad
  } else {
    exerciseString = this.props.payLoad._id

  }
  this.setState({
    payLoad: exerciseString
  })
  axios.get('/seetemplate/show/'+exerciseString).then((res)=>{
//pin
      var arrayOfTemplateTitles = [];
      for(var i = 0; i < res.data.length;i++){
        arrayOfTemplateTitles.push(res.data[i].Title)
      }
      this.setState({
        templateSelection: arrayOfTemplateTitles,
        templateData: res.data
      })
    })
    axios.get('/train/exercises/showAll/'+ exerciseString).then((res)=>{
      var arrayOfTitles = [];
      for(var i = 0; i < res.data.length;i++){
        arrayOfTitles.push(res.data[i].Title)
      }
      this.setState({
        arrayOfTitles: arrayOfTitles
      })
    })
}
clearForm(){
  var oldInput = document.getElementById('imageFile');
  var newInput = document.createElement("input");
  newInput.addEventListener(
    'change',
    (e)=>{this.onInputChange(e)}
  )

  newInput.type = "file";
  newInput.id = oldInput.id;
  newInput.name = oldInput.name;
  newInput.className = oldInput.className;
  newInput.style.cssText = oldInput.style.cssText;
  oldInput.parentNode.replaceChild(newInput, oldInput);
}
onInputChange(e) {
  if(e.target.files.length > 0 && e.target.files[0].name.match(/\.(png|jpg|jpeg)$/)){
    var file = e.target.files[0];
    var fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (e)=>{
      this.setState({
        preview: e.target.result
      })
    }
    var newFormError = Object.assign({},this.state.formErrors);
    delete newFormError.image
    this.setState({
      file:e.target.files[0],
      formErrors: newFormError
    })
  } else {
    this.setState({
      formErrors: Object.assign({image:"must be .jpg,.png or .jpeg format"},this.state.formErrors)
    })
  }
}
handleBodyWeightMetric(){
  this.setState({
    bodyWeightQuestion: this.state.bodyWeightQuestion ? false : true
  })
}
handleAddTemplate(){
  this.setState({
    quickAddTemplate: true
  })
}
handleReturn(){
   axios.get('/seetemplate/show/'+this.props.payLoad._id).then((response)=>{
    var allTemplateTitles = [];
    var arrayOfTemplateObjects = [];
    for(let i = 0; i < response.data.length;i++){
      allTemplateTitles.push(response.data[i].Title)
      arrayOfTemplateObjects.push(response.data[i])

    }
    this.setState({
      templateSelection: allTemplateTitles,
      templateData: arrayOfTemplateObjects,
      quickAddTemplate:false,

    })
  })
}
handleSubmitForm(e){
  var formErrors = CheckExercise.checkAddExercise(this.state.title.toUpperCase(), this.state.description, this.state.arrayOfTitles,this.state.templatesOn)
  if(Object.keys(formErrors).length === 0){

        var templateIds = []
        for(let i = 0; i < this.state.templateData.length;i++){
            for(let m = 0; m < this.state.templatesOn.length;m++){

            if(this.state.templateData[i].Title === this.state.templatesOn[m]){
              templateIds.push(this.state.templateData[i]._id)
            }
          }
        }
        if(this.state.file){
          const formData = new FormData();
          formData.append('myFile',this.state.file)
          const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
          }
          axios({
            method:'post',
            url: '/addimage',
            config: config,
            data: formData,
          }).then((res)=>{
            return axios({
              method: 'post',
              url: '/train/exercises/add/'+this.state.payLoad,
              data: {
                title: this.state.title.toUpperCase(),
                description: this.state.description,
                templates: templateIds,
                metric: this.state.trainingMetric,
                bodyWeightQuestion: this.state.bodyWeightQuestion,
                image: res.data.fileId
              }
            }).then((res)=>{
              this.setState({
                arrayOfTitles: [...this.state.arrayOfTitles,(this.state.title.toUpperCase())],
                title: "",
                description: "",
                clearCheck: false,
                exerciseMessage: "Successfully Added " + this.state.title,
                formErrors: {},
                preview: '',
                file: ''
              })
              this.clearForm()
            })
          })
        } else {
          axios({
            method: 'post',
            url: '/train/exercises/add/'+this.state.payLoad,
            data: {
              title: this.state.title.toUpperCase(),
              description: this.state.description,
              templates: templateIds,
              metric: this.state.trainingMetric,
              bodyWeightQuestion: this.state.bodyWeightQuestion,
              image: ''
            }
          }).then((res)=>{
            this.setState({
              arrayOfTitles: [...this.state.arrayOfTitles,(this.state.title.toUpperCase())],
              title: "",
              description: "",
              clearCheck: false,
              exerciseMessage: "Successfully Added " + this.state.title,
              formErrors: {}
            })
          })
        }


  } else {
    this.setState({
      formErrors:formErrors
    })
  }
}
handleTemplateOptions(e){
  var sliceOfTemplates = this.state.templatesOn.slice();
  var turnedOff = false;
  for(var i = 0; i < sliceOfTemplates.length;i++){
    if(e.target.name === sliceOfTemplates[i]){
      sliceOfTemplates.splice(i,1)
      turnedOff = true;
    }
  }
  if(turnedOff){
    this.setState({
      templatesOn: sliceOfTemplates
    })
  } else{
    sliceOfTemplates.push(e.target.name)
    this.setState({
      templatesOn: sliceOfTemplates
    })
  }
}


handleExercise(){
  this.setState({
    redirectTo: "/train/exercise"
  })
}
handleTrainingMetric(e){

  this.setState({
    trainingMetric: this.state.trainingMetric ? false: true
  })
}


handleInputChange(name,value){

  this.setState({
    [name]:value
  })
}
render(){

  var inputOptions = [];
  if(this.state.templateSelection.length > 0){

   inputOptions = this.state.templateSelection.map((title)=>{
    return(
      <div key={title}>

        <input
          style={{marginRight:'10px'}}
          type="checkbox"
          name={title}
          onChange={this.handleTemplateOptions} />
        <label>{title}</label>
      </div>
    )
  })
}


  return(
    <div>
      {
        !this.state.quickAddTemplate &&

          <Grid fluid>


            {this.state.redirectTo !== "" &&
              <Redirect to ={this.state.redirectTo}/>
            }

            <form onKeyPress={this.handleKeyPress}>
              <Row className="show-grid">
                <Col xs={12} ><h4 style={{textAlign:'center'}}>New Exercise</h4></Col>
              </Row>
              {
                this.state.exerciseMessage &&
                  <Row className="show-grid">
                    <Col xs={12}>
                      <h4 style={{color:'purple', textAlign:'center'}}>{this.state.exerciseMessage}</h4>

                    </Col>
                  </Row>
              }
              <hr></hr>
              <Row className="show-grid">
                <Col xs={12}>
                  <label> Img<span style={{fontStyle:'italic'}}>(optional)</span>:</label>
                </Col>

              </Row>
              <Row className="show-grid">
                <Col xs={12}>
                  <img
                    alt = ""
                    src={this.state.preview ? this.state.preview:''}
                    style={{width:'200px',height:'200px', border:'2px solid black'}}
                  />

                </Col>
              </Row>
              <Row className="show-grid">
                <Col xs={12}>
                  <input type="file"
                    id="imageFile"
                    name="myFile"
                    onChange={this.onInputChange}
                  />
                </Col>
              </Row>
              {
                  this.state.formErrors.image &&
                    <Row className = "show-grid">
                      <Col  xs={12}>
                        <span style={{color:'red'}}>{this.state.formErrors.image}</span>
                      </Col>
                    </Row>
              }
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
                    onChange={(e)=>{this.handleInputChange(e.target.name,e.target.value)}}
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
                  <label> Description:</label>
                </Col>

              </Row>
              <Row className="show-grid">
                <Col xs={12}>
                  <textarea className={this.state.formErrors.description ? 'error':'notError'}
                    type="text" onChange={(e)=>{this.handleInputChange(e.target.name,e.target.value)}} value={this.state.description} name="description" ></textarea>
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
                  <input
                    onChange = {this.handleTrainingMetric}
                    checked={this.state.trainingMetric}
                    value={this.state.trainingMetric}
                    style={{marginRight:'10px'}}
                    type="checkbox">


                  </input>
                  <label>Track Metric</label>
                </Col>

              </Row>

              <Row className="show-grid">
                <Col xs={12}>
                  <input
                    onChange = {this.handleBodyWeightMetric}
                    checked={this.state.bodyWeightQuestion}
                    value={this.state.bodyWeightQuestion}
                    name="bodyWeightQuestion"
                    style={{marginRight:'10px'}}

                    type="checkbox"></input>
                  <label>Uses your own bodyweight</label>
                </Col>

              </Row>


              <Row style={{marginTop:"10px"}} className="show-grid">
                <Col xs={12}>
                  <label>Associated Templates: </label>
                </Col>

                {
                  inputOptions.length > 0 &&
                    <Col xs={12}  >
                      <div className={this.state.formErrors.associateTemplate ? 'error':'notError'}>
                        {inputOptions}
                      </div>
                    </Col>
                }
              </Row>
              {
                this.state.formErrors.associateTemplate &&
                  <Row className = "show-grid">
                    <Col xs={12}>
                      <span style={{color:'red'}}>{this.state.formErrors.associateTemplate}</span>
                    </Col>
                  </Row>
              }
              <Row className="show-grid" style = {{marginTop:"10px"}}>
                {
                  inputOptions.length === 0 &&
                    <Col xs={12}>
                      <Button style={{width:'100%', backgroundColor:'gray',color:'white', marginTop:'20px', marginBottom:'20px'}} onClick={this.handleAddTemplate}>Quick Add Template</Button>
                    </Col>
                }
                <Col xs={12}>
                  <Button onClick={this.handleSubmitForm} style={{width:'100%', marginTop:'20px', marginBottom:'20px'}} bsStyle="success">Add Exercise</Button>
                </Col>


                {this.props.goBack &&
                  <Col xs={12} >
                    <Button bsStyle="danger" style={{width:'100%', marginTop:'20px', marginBottom:'20px'}} onClick={this.props.goBack}>Back To Session</Button>
                  </Col>
                }

              </Row>
            </form>
          </Grid>
      }
      {
        this.state.quickAddTemplate &&
          <TemplateAdd payLoad={this.props.payLoad} onReturn={this.handleReturn}/>
      }
    </div>
          )
        }
      }
//prop types check if prop is what you want it to be..
export default AddExercise;
