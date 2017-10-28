import React,{Component} from "react";

import PropTypes from 'prop-types';
import axios from 'axios'
import {Grid,Row,Col,Button} from 'react-bootstrap';

class ExerciseReadOnly extends Component{
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
  }
    componentDidMount(){
      axios.get('/train/exercise/details/' + this.props.exerciseDetails.title + '/' + this.props.userId).then((res)=>{

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

        return axios.get('/seetemplate/show/'+this.props.userId).then((response)=>{
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
              disabled={true}
              style={{marginRight:'10px'}}
              type="checkbox"
              name={title}
            />
            <label>{title}</label>
          </div>
        )
      } else {
        return(
          <div key={title}>

            <input
              disabled={true}
              defaultChecked = {true}
              style={{marginRight:'10px'}}
              type="checkbox"
              name={title}
            />
            <label>{title}</label>
          </div>
        )
      }
      })
    return(
      <div>
        <Row className="show-grid">
          <Col md={12}>
            <h4>Img:</h4>
          </Col>
        </Row>
        <Row className="show-grid">
          <Col md={12}>
            <img
              alt = ""
              src={this.state.preview ? this.state.preview:''}
              style={{width:'200px',height:'200px', border:'2px solid black'}}
            />

          </Col>
        </Row>
        <Row className="show-grid">
          <Col md={12}>
            <h4> Title</h4>
          </Col>

        </Row>
        <Row className="show-grid">
          <Col md={12}>
            <input
              style={{width:'100%'}}
              type="text"
              value={this.state.title}
              disabled={true}
              name="title">
            </input>
          </Col>
        </Row>
        <Row className="show-grid">
          <Col md={12}>
            <h4> Description:</h4>
          </Col>

        </Row>
        <Row className="show-grid">
          <Col md={12}>
            <textarea
              type="text"
              disabled={true}
              value={this.state.description} name="description" ></textarea>
          </Col>
        </Row>
        <Row className="show-grid">
          <Col md={12}>
            <input
              checked={this.state.metric}
              value={this.state.metric}
              disabled={true}
              style={{marginRight:'10px'}}
              type="checkbox">

            </input>
            <label>Track Metric</label>
          </Col>

        </Row>
        <Row className="show-grid">
          <Col md={12}>
            <input
              checked={this.state.bodyWeightQuestion}
              value={this.state.bodyWeightQuestion}
              name="bodyWeightQuestion"
              style={{marginRight:'10px'}}
              disabled={true}
              type="checkbox"></input>
            <label>This exercise uses your own bodyweight</label>
          </Col>

        </Row>
        <Row className="show-grid" style = {{marginTop:"10px"}}>
          <Col md={12}>
            <h4>Associated Templates</h4>
          </Col>

          {
              inputOptions.length > 0 &&
                <Col md={12}  >
                  <div>
                    {inputOptions}
                  </div>
                </Col>
          }

        </Row>
      </div>
    )
  }
}
ExerciseReadOnly.propTypes = {

}
 export default ExerciseReadOnly
