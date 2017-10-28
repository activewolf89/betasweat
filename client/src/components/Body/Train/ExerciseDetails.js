  import React,{Component} from "react";
  import axios from 'axios'
  import {Grid,Row,Col,Button,ButtonToolbar} from 'react-bootstrap';
  import CheckExercise from './../../../CommonHelpers/CheckExercise.js';
  import {Redirect} from 'react-router-dom';
  import TemplateAdd from './TemplateAdd.js';
  class ExerciseDetails extends Component{
    constructor(props){
      super(props);
      this.state = {
        exerciseId: "",
        title:"",
        originalTitle: "",
        description:"",
        templates: [],
        metric: false,
        arrayOfAssociatedTemplates: [],
        allTemplateTitles: [],
        arrayOfTemplateObjects: [],
        message: '',
        formErrors: {},
        quickAddTemplate:false,
        redirect: false,
        bodyWeightQuestion: true,
        preview: '',
        changedPhoto: false,
        file: '',
        imageId: ''
      }
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleTemplateOptions = this.handleTemplateOptions.bind(this);
      this.handleTrainingMetric = this.handleTrainingMetric.bind(this);
      this.handleRemove = this.handleRemove.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleAddTemplate = this.handleAddTemplate.bind(this);
      this.handleReturn = this.handleReturn.bind(this);
      this.handleBodyWeightMetric = this.handleBodyWeightMetric.bind(this);
      this.onPhotoChange = this.onPhotoChange.bind(this);
      this.handleRemoveImage = this.handleRemoveImage.bind(this);

    }
    componentDidMount(){
      axios.get('/train/exercise/details/'+this.props.title + '/' + this.props.payLoad._id).then((res)=>{
        if(res.data){
          var returnImage = res.data.exerciseImage;
          var returnResult = res.data.exerciseObject;
          if(returnImage){
            function base64toBlob(base64Data, contentType) {
                contentType = contentType || '';
                var sliceSize = 1024;
                var byteCharacters = atob(base64Data);
                var bytesLength = byteCharacters.length;
                var slicesCount = Math.ceil(bytesLength / sliceSize);
                var byteArrays = new Array(slicesCount);

                for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                    var begin = sliceIndex * sliceSize;
                    var end = Math.min(begin + sliceSize, bytesLength);

                    var bytes = new Array(end - begin);
                    for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                        bytes[i] = byteCharacters[offset].charCodeAt(0);
                    }
                    byteArrays[sliceIndex] = new Uint8Array(bytes);
                }
                return new Blob(byteArrays);
            }
              var response =   base64toBlob(returnImage)
              var filereader = new FileReader();
              filereader.readAsDataURL(response);
              filereader.onload = (e)=>{
                this.setState({
                  preview: e.target.result,
                  imageId: returnResult.ImageStringId
                })
              }
          }
      var  arrayOfAssociatedTemplates = [];
      var arrayOfTemplateObjects = [];

        for(let i = 0; i < returnResult._Templates.length;i++){
          arrayOfAssociatedTemplates.push(returnResult._Templates[i].Title)
        }

        return axios.get('/seetemplate/show/'+this.props.payLoad._id).then((response)=>{
          var allTemplateTitles = [];
          for(let i = 0; i < response.data.length;i++){
            allTemplateTitles.push(response.data[i].Title)
            arrayOfTemplateObjects.push(response.data[i])

          }
          this.setState({
            exerciseId: returnResult._id,
            title: returnResult.Title,
            originalTitle: returnResult.Title,
            description: returnResult.Description,
            bodyWeightQuestion: returnResult.UsesBodyWeight ? returnResult.UsesBodyWeight: false,
            metric: returnResult.Metric,
            arrayOfTemplateObjects: arrayOfTemplateObjects,
            allTemplateTitles: allTemplateTitles,
            arrayOfAssociatedTemplates: arrayOfAssociatedTemplates,
          })
        })
      }
      })
    }

    handleRemoveImage(){
      this.setState({
        preview: '',
      })
    }
    onPhotoChange(e) {
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
          formErrors: newFormError,
          changedPhoto: true,
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
    handleRemove(){

      axios.get('/train/exercises/remove/' + this.state.exerciseId + '/' + this.props.payLoad._id).then((res)=>{
        this.setState({
          redirect: true
        })
      }).catch((err)=>{
        this.setState({
          message: err
        })
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
          quickAddTemplate:false,
          arrayOfTemplateObjects: arrayOfTemplateObjects,
          allTemplateTitles: allTemplateTitles,
        })
      })
    }
    handleSubmit(){
      var formErrors = CheckExercise.checkUpdateExercise(this.state.title.toUpperCase(), this.state.originalTitle.toUpperCase(), this.state.description, this.state.allTemplateTitles,this.state.arrayOfAssociatedTemplates)
      if(Object.keys(formErrors).length === 0){
        var arrayOfAssociatedIds = []
        for(var m = 0; m <  this.state.arrayOfAssociatedTemplates.length;m++){
          for(var i = 0; i < this.state.arrayOfTemplateObjects.length;i++){
            if(this.state.arrayOfTemplateObjects[i].Title === this.state.arrayOfAssociatedTemplates[m]){
              arrayOfAssociatedIds.push(this.state.arrayOfTemplateObjects[i]._id)
            }
          }

      }
      if(this.state.changedPhoto && !this.state.imageId){
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
            method:'post',
            data: {
               templates: arrayOfAssociatedIds,
              exerciseId: this.state.exerciseId,
              description: this.state.description,
              metric: this.state.metric,
              bodyWeightQuestion: this.state.bodyWeightQuestion,
              ImageStringId: res.data.fileId,
              title: this.state.title.toUpperCase()
            },
            url: '/train/exercises/update'
          }).then((res)=>{
            if(res.data){
              this.setState({
                message: 'Exercise Has Been Updated!'
              })

            }
          })
        })
      }
      if(this.state.changedPhoto && this.state.imageId){
        axios.get('/removePhotoFromDatabase/'+this.state.imageId).then(()=>{
          const formData = new FormData();
          formData.append('myFile',this.state.file)
          const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
          }
        return  axios({
            method:'post',
            url: '/addimage',
            config: config,
            data: formData,
          }).then((res)=>{
            return axios({
              method:'post',
              data: {
                 templates: arrayOfAssociatedIds,
                exerciseId: this.state.exerciseId,
                description: this.state.description,
                metric: this.state.metric,
                bodyWeightQuestion: this.state.bodyWeightQuestion,
                ImageStringId: res.data.fileId,
                title: this.state.title.toUpperCase()
              },
              url: '/train/exercises/update'
            }).then((res)=>{
              if(res.data){
                this.setState({
                  message: 'Exercise Has Been Updated!'
                })
              }
            })
          })
        })
      } else if(this.state.imageId && !this.state.preview){
        axios.get('/removePhotoFromDatabase/'+this.state.imageId).then(()=>{
        return  axios({
            method:'post',
            data: {
               templates: arrayOfAssociatedIds,
              exerciseId: this.state.exerciseId,
              description: this.state.description,
              metric: this.state.metric,
              bodyWeightQuestion: this.state.bodyWeightQuestion,
              title: this.state.title.toUpperCase(),
              ImageStringId: ''

            },
            url: '/train/exercises/update'
          }).then((res)=>{
            if(res.data){
              this.setState({
                message: 'Exercise Has Been Updated!'
              })
            }
          })
        })

      } else {
        axios({
          method:'post',
          data: {
             templates: arrayOfAssociatedIds,
            exerciseId: this.state.exerciseId,
            description: this.state.description,
            metric: this.state.metric,
            bodyWeightQuestion: this.state.bodyWeightQuestion,
            ImageStringId: this.state.imageId,
            title: this.state.title.toUpperCase()
          },
          url: '/train/exercises/update'
        }).then((res)=>{
          if(res.data){
            this.setState({
              message: 'Exercise Has Been Updated!'
            })
          }
        })
      }
    }
      this.setState({
        formErrors:formErrors
      })
    }
    handleTrainingMetric(e){
      this.setState({
        metric: this.state.metric ? false:true
      })
    }
    handleTemplateOptions(e){
      var sliceOfTemplates = this.state.arrayOfAssociatedTemplates.slice();
      var turnedOff = false;
      for(var i = 0; i < sliceOfTemplates.length;i++){
        if(e.target.name === sliceOfTemplates[i]){
          sliceOfTemplates.splice(i,1)
          turnedOff = true;
        }
      }
      if(turnedOff){
        this.setState({
          arrayOfAssociatedTemplates: sliceOfTemplates
        })
      } else{
        sliceOfTemplates.push(e.target.name)
        this.setState({
          arrayOfAssociatedTemplates: sliceOfTemplates
        })
      }
    }
    handleInputChange(name,value){
      this.setState({
        [name]:value
      })
    }

    render(){
        var inputOptions = [];

         inputOptions = this.state.allTemplateTitles.map((title)=>{
           var selected = false;
           for(let i = 0; i < this.state.arrayOfAssociatedTemplates.length;i++){
             if(this.state.arrayOfAssociatedTemplates[i] === title){
               selected = true;
             }
           }
           if(!selected){

          return(
            <div key={title}>

              <input

                style={{marginRight:'10px'}}
                type="checkbox"
                name={title}
                onChange={this.handleTemplateOptions}
              />
              <label>{title}</label>
            </div>
          )
        } else {
          return(
            <div key={title}>

              <input
                defaultChecked = {true}
                style={{marginRight:'10px'}}
                type="checkbox"
                name={title}
                onChange={this.handleTemplateOptions} />
              <label>{title}</label>
            </div>
          )
        }
        })
      return(
        <div>
          {
            !this.state.quickAddTemplate &&

              <Grid fluid>
                {
                  this.state.redirect &&
                    <Redirect to ="/exercises" />
                }

                <form onKeyPress={this.handleKeyPress}>
                  <Row className="show-grid">
                    <Col xs={12} ><h4 style={{textAlign:'center'}}>Update Exercise</h4></Col>
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
                      <h4> Image<span style={{fontStyle:'italics'}}>(optional):</span>
                        {
                              this.state.preview &&
                                <Button bsStyle="danger" onClick={this.handleRemoveImage}>x</Button>
                        }
                      </h4>

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
                      <input type="file" id="imageFile" name="myFile" onChange={this.onPhotoChange} />
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
                      <h4> Title:</h4>
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
                      <h4> Description:</h4>
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
                        checked={this.state.metric}
                        value={this.state.metric}
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
                  <Row className="show-grid" style = {{marginTop:"10px"}}>
                    <Col xs={12}>
                      <h4>Associated Templates </h4>
                    </Col>
                    {
                      inputOptions.length === 0 &&
                        <Col xs={12}>

                          <Button bsStyle="primary" style={{width:'100%', marginTop:'20px', marginBottom:'20px'}} onClick={this.handleAddTemplate}>Quick Add Template</Button>
                        </Col>
                    }
                    {
                        inputOptions.length > 0 &&
                          <Col xs={12}  >
                            <div className={this.state.formErrors.associateTemplate ? 'error':'notError'}>
                              {inputOptions}
                            </div>
                          </Col>
                    }
                    {
                      this.state.formErrors.associateTemplate &&
                        <Row className = "show-grid">
                          <Col xs={12}>
                            <span style={{color:'red'}}>{this.state.formErrors.associateTemplate}</span>
                          </Col>
                        </Row>
                    }
                  </Row>
                  <hr></hr>
                  <Row className="show-grid">
                    <Col xs={12}>
                      <ButtonToolbar>
                        <Button onClick={this.handleSubmit} bsStyle="success">Update Exercise</Button>
                        <Button bsStyle="danger" onClick={this.handleRemove}>Delete Exercise</Button>
                      </ButtonToolbar>
                    </Col>
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

  export default ExerciseDetails;
