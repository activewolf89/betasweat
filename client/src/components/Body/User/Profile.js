  import React,{Component} from "react";
  import {Grid,Row,Col,Button,ButtonToolbar} from 'react-bootstrap';
  import LoggedIn from './../../../CommonHelpers/LoggedIn.js';
  import CheckUpdateErrors from './../../../CommonHelpers/Update.js';
  import updateImage from './UpdateImages.js';
  import PasswordMask from 'react-password-mask';
  import {Icon} from 'react-fa'

  import axios from 'axios';

  class Profile extends Component{
    constructor(props){
      super(props);
      this.state = {
        updatedName: '',
        updatedBodyWeight: '',
        updatedEmail: '',
        updatedPassword: '',
        updatedConfirmPassword: '',
        name: '',
        bodyWeight: '',
        email: '',
        editName: false,
        editBodyWeight: false,
        editEmail: false,
        editPassword: false,
        formErrors: {},
        successObject: {},
        beforeFile: '',
        beforePreview: '',
        afterPreview: '',
        afterFile: '',
        swapped: false,
        message: '',
        beforeImagePresent: true,
        afterImagePresent: true,
        removeBeforeImage: false,
        removeAfterImage: false
      }
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleEdit = this.handleEdit.bind(this);
      this.handleUpdateChange = this.handleUpdateChange.bind(this);
      this.handleUpdate = this.handleUpdate.bind(this);
      this.onPhotoChange = this.onPhotoChange.bind(this);
      this.handleSwap = this.handleSwap.bind(this);
      this.revert = this.revert.bind(this);
      this.handlePhotoUpdate = this.handlePhotoUpdate.bind(this);
    }
    componentDidMount(){
      var payLoad = LoggedIn.getPayLoad();
      axios.get('/getprofile/'+payLoad.email).then((res)=>{
        if(res.data){
        return axios.get('/user/images/'+this.props.payLoad._id).then((responseImages)=>{
          if(responseImages.data.beforeImage){
            var filereader = new FileReader();
            var beforeResponse = updateImage.base64toBlob(responseImages.data.beforeImage)
            filereader.readAsDataURL(beforeResponse);
            filereader.onload = (e)=>{
              this.setState({
                beforePreview: e.target.result,
                beforeImagePresent: true
              })
            }
          }
          if(responseImages.data.afterImage){
            var filereader = new FileReader();
            var afterResponse = updateImage.base64toBlob(responseImages.data.afterImage)
            filereader.readAsDataURL(afterResponse);
            filereader.onload = (e)=>{
              this.setState({
                afterPreview: e.target.result,
                afterImagePresent: true
              })
            }
          }
              this.setState({
                updatedBodyWeight: res.data.bodyWeight[res.data.bodyWeight.length - 1],
                updatedName: res.data.name,
                updatedEmail: res.data.email,
                bodyWeight: res.data.bodyWeight[res.data.bodyWeight.length - 1],
                name: res.data.name,
                email: res.data.email
              })
          })
        }
      })
    }
    revert(e){
      var newFormError = this.state.formErrors;
      switch(e.target.name){
        case "name":
        delete newFormError.name;
        this.setState({
        editName: false,
        updatedName: this.state.name,
        formErrors: newFormError
        })
        break;
        case "bodyWeight":
        delete newFormError.bodyWeight;
        this.setState({
          editBodyWeight: false,
          updatedBodyWeight: this.state.bodyWeight,
          formErrors: newFormError
        })
        break;
        case "email":
        delete newFormError.email
        this.setState({
          editEmail: false,
          updatedEmail: this.state.email,
          formErrors: newFormError
        })
        break;
        case "password":
        delete newFormError.password;
        delete newFormError.passwordMatch;

        this.setState({
          editPassword: false,
          formErrors:  newFormError,
          updatedPassword: '',
          confirmPassword: ''
        })
        break;
        default:
        this.setState({
          editName: false,
          updatedName: this.state.name,
          editBodyWeight: false,
          updatedName: this.state.bodyWeight,
          editEmail: false,
          updatedEmail: this.state.email,
          editPassword: false,
          updatedPassword: '',
          updatedConfirmPassword: ''
        })
        break
      }
    }
    handlePhotoUpdate(){
      if(!this.state.removeAfterImage && !this.state.removeBeforeImage){

      if(this.state.afterFile && !this.state.beforeFile){
        if(this.state.swapped){
          updateImage.swapFiles(this.props.payLoad._id,"after",this.state.afterFile)
        } else {
          updateImage.afterFile(this.state.afterFile,this.props.payLoad._id)
        }
      }
      if(this.state.beforeFile && !this.state.afterFile){
        if(this.state.swapped){
          updateImage.swapFiles(this.props.payLoad._id,"before",this.state.beforeFile)

        } else {
          updateImage.beforeFile(this.state.beforeFile,this.props.payLoad._id)
        }
      }
      if(!this.state.beforeFile && !this.state.afterFile){
        updateImage.swapFiles(this.props.payLoad._id)
      }
      if(this.state.afterFile && this.state.beforeFile){
        updateImage.afterFile(this.state.afterFile,this.props.payLoad._id)
        updateImage.beforeFile(this.state.beforeFile,this.props.payLoad._id)
      }
    } else {
      if(this.state.removeAfterImage && !this.state.removeBeforeImage){
        if(this.state.swapped){
            updateImage.swapFiles(this.props.payLoad._id,"removeAfter")

        } else {
          updateImage.removeAfterImage(this.props.payLoad._id)
        }
      }
      if(!this.state.removeAfterImage && this.state.removeBeforeImage){
        if(this.state.swapped){

          updateImage.swapFiles(this.props.payLoad._id,"removeBefore")
        } else {

          updateImage.removeBeforeImage(this.props.payLoad._id)
        }
      }
      if(this.state.removeAfterImage && this.state.removeBeforeImage && !this.state.afterFile && !this.state.beforeFile){
        updateImage.removeBeforeImage(this.props.payLoad._id)
        updateImage.removeAfterImage(this.props.payLoad._id)
      }
    }
    //pin

      this.setState({
        message: "Your Photos have been updated",
        swapped: false,
        beforeFile: '',
        afterFile: ''

      })
    }
    handleSwap(){
      if(this.state.beforePreview || this.state.afterPreview){
        var tempPreview = this.state.beforePreview;
        var tempFile = this.state.beforeFile;
        var beforePreviewInput = document.getElementById('beforePreview')
        var afterPreviewInput = document.getElementById('afterPreview')
        var newBeforePreviewInput = document.createElement("input");
        var newAfterPreviewInput = document.createElement("input");

        newAfterPreviewInput.addEventListener(
          'change',
          (e)=>{this.onPhotoChange(e)}
        );
        newBeforePreviewInput.addEventListener(
          'change',
          (e)=>{this.onPhotoChange(e)}
        );
        newBeforePreviewInput.type = "file";
        newBeforePreviewInput.id = beforePreviewInput.id;
        newBeforePreviewInput.name = beforePreviewInput.name;
        newBeforePreviewInput.className = beforePreviewInput.className;
        newBeforePreviewInput.style.cssText = beforePreviewInput.style.cssText;
        newBeforePreviewInput.files = afterPreviewInput.files;
        beforePreviewInput.parentNode.replaceChild(newBeforePreviewInput, beforePreviewInput);

        newAfterPreviewInput.type = "file";
        newAfterPreviewInput.id = afterPreviewInput.id;
        newAfterPreviewInput.files = beforePreviewInput.files;
        newAfterPreviewInput.name = afterPreviewInput.name;
        newAfterPreviewInput.className = afterPreviewInput.className;
        newAfterPreviewInput.style.cssText = afterPreviewInput.style.cssText;
        afterPreviewInput.parentNode.replaceChild(newAfterPreviewInput, afterPreviewInput);
        this.setState({
          beforePreview: this.state.afterPreview,
          afterPreview: tempPreview,
          beforeFile: this.state.afterFile,
          afterFile: tempFile,
          swapped: this.state.swapped ? false: true,
          removeAfterImage: false,
          removeBeforeImage: false
        })
      }
    }
    onPhotoChange(e){
      var myId = e.target.id;
      var which = e.target.id.slice(0,1)
      if(e.target.files.length > 0 && e.target.files[0].name.match(/\.(png|jpg|jpeg)$/)){

        var file = e.target.files[0];
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (e)=>{
          this.setState({
            [myId]: e.target.result
          })
        }

        this.setState({
          [e.target.name]:e.target.files[0],
          [which === "a" ? "removeAfterImage":"removeBeforeImage"]: false
        })
      }
    }
    handleUpdate(e){
      var formErrors = {};
      switch(e.target.name) {
    case 'name':
        formErrors = CheckUpdateErrors.updateProfileName(this.state.updatedName, this.props.payLoad._id)
        break;
    case 'email':
        formErrors = CheckUpdateErrors.updateProfileEmail(this.state.updatedEmail, this.props.payLoad._id,(res)=>{
          this.setState({
            formErrors: res
          })
          return res
        },
      (res)=>{
        this.setState({
          editEmail: false,
          email: this.state.updatedEmail
        })
      })
        break;
    case 'bodyWeight':
        formErrors = CheckUpdateErrors.updateProfileBodyWeight(this.state.updatedBodyWeight, this.props.payLoad._id)

        break;
    case 'password':
        formErrors = CheckUpdateErrors.updateProfilePassword(this.state.updatedPassword,this.state.updatedConfirmPassword, this.props.payLoad._id)
        break;
    default:
        formErrors = {}
}
if(Object.keys(formErrors).length === 0 && e.target.name !== "email"){
  function jsUcfirst(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  var string = "updated" + jsUcfirst(e.target.name)
  this.setState({
    ["edit" + jsUcfirst(e.target.name)]: false,
    [e.target.name]: e.target.name === "name" ? this.state.updatedName: e.target.name === "bodyWeight" ? this.state.updatedBodyWeight: "",
  })
}
  this.setState({
    formErrors: formErrors
  })
    }
    handleUpdateChange(e){
      this.setState({
        [e.target.name]: e.target.value
      })
    }
    handleSubmit(){

    }
    handleEdit(e){
      this.setState({
        [e.target.name]: true
      })
    }
    render(){
      return(
        <div>
          <Grid>
            <Row className="show-grid">
              <Col xs={12} ><h4 style={{textAlign:'center'}}>Profile</h4></Col>
            </Row>
            <hr></hr>
            <Row className="show-grid">
              <Col xs={2}>
                <Row className="show-grid">
                  <Col xs={1}>
                    <label style={{fontWeight:'bold'}}>Name:</label>
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col xs={12}>
                    {
                        !this.state.editName &&
                          <p>{this.state.name}</p>
                    }
                    {
                        this.state.editName &&
                          <p>
                            <input
                              value = {this.state.updatedName}
                              onChange = {this.handleUpdateChange}
                              name = "updatedName"
                              type="text"
                              style = {this.state.formErrors.name ? {border:'1px solid red'}:{}}
                            />
                          </p>
                    }

                  </Col>
                </Row>
              </Col>
              <Col  xsOffset={6} smOffset={6} mdOffset={7} xs={4} sm={4} md={3}>

                {
                    !this.state.editName &&
                      <Button
                        name="editName"
                        onClick = {this.handleEdit}
                        style={{background:'lightgray', marginTop:'20px'}}>Edit
                      </Button>
                }
                {
                    this.state.editName &&
                      <ButtonToolbar>
                        <Button
                          name="name"
                          onClick = {this.handleUpdate}
                          bsStyle="success">Update
                        </Button>
                        <Button
                          onClick={this.revert}
                          name="name"
                          style={{backgroundColor:'gray'}}>Revert</Button>
                      </ButtonToolbar>
                }
              </Col>
              <Col xs={12}>
                {
                    this.state.formErrors.name &&
                      <p style={{color:'red'}}>{this.state.formErrors.name}</p>
                }
              </Col>
            </Row>
            <hr></hr>
            <Row className="show-grid">
              <Col xs={2}>
                <Row className="show-grid">
                  <Col xs={1}>
                    <label style={{fontWeight:'bold'}}>Body Weight:</label>
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col xs={1}>

                    {
                          !this.state.editBodyWeight &&
                            <p>{this.state.bodyWeight}</p>
                    }
                    {
                          this.state.editBodyWeight &&
                            <p>
                              <input
                                value = {this.state.updatedBodyWeight}
                                onChange = {this.handleUpdateChange}
                                name = "updatedBodyWeight"
                                style = {this.state.formErrors.bodyWeight ? {border:'1px solid red'}:{}}
                                type="number" />
                            </p>
                    }
                  </Col>
                </Row>
              </Col>
              <Col  xsOffset={6} smOffset={6} mdOffset={7} xs={4} sm={4} md={3}>

                {
                      !this.state.editBodyWeight &&
                        <Button
                          style={{background:'lightgray', marginTop:'20px'}}
                          onClick={this.handleEdit}
                          name="editBodyWeight"
                        >Edit</Button>
                }
                {
                    this.state.editBodyWeight &&
                      <ButtonToolbar>
                        <Button
                          bsStyle="success"
                          onClick={this.handleUpdate}
                          name="bodyWeight"
                        >Update</Button>
                        <Button
                          name="bodyWeight"
                          onClick={this.revert}
                          style={{backgroundColor:'gray'}}>Revert</Button>
                      </ButtonToolbar>
                }
              </Col>
              <Col xs={12}>
                {
                        this.state.formErrors.bodyWeight &&
                          <p style={{color:'red'}}>{this.state.formErrors.bodyWeight}</p>
                }
              </Col>
            </Row>
            <hr></hr>
            <Row className="show-grid" >
              <Col xs={2}>
                <Row className="show-grid">
                  <Col xs={1}>
                    <label style={{fontWeight:'bold'}}>Email:</label>
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col xs={1}>
                    {
                              !this.state.editEmail &&
                                <p>{this.state.email}</p>
                    }
                    {
                              this.state.editEmail &&
                                <p>
                                  <input
                                    value = {this.state.updatedEmail}
                                    onChange = {this.handleUpdateChange}
                                    name = "updatedEmail"
                                    style = {this.state.formErrors.email ? {border:'1px solid red'}:{}}
                                    type="text" />
                                </p>
                    }
                  </Col>
                </Row>

              </Col>

              <Col  xsOffset={6} smOffset={6} mdOffset={7} xs={4} sm={4} md={3}>

                {
                     !this.state.editEmail &&
                       <Button
                         style={{background:'lightgray', marginTop:'20px'}}
                         onClick = {this.handleEdit}
                         name = "editEmail"
                       >
                       Edit</Button>
                }
                {
                     this.state.editEmail &&
                       <ButtonToolbar>

                         <Button
                           bsStyle="success"
                           onClick = {this.handleUpdate}
                           name = "email"
                         >
                         Update</Button>
                         <Button
                           name="email"
                           onClick={this.revert}
                           style={{backgroundColor:'gray'}}>Revert</Button>
                       </ButtonToolbar>
                }
              </Col>
              <Col xs={12}>
                {
                    this.state.formErrors.email &&
                      <p style={{color:'red'}}>{this.state.formErrors.email}</p>
                }
                {
                    this.state.successObject.email &&
                      <p style={{color:'green'}}>{this.state.successObject.email}</p>

                }
              </Col>
              <Col xs={12}>
                {
                    this.state.formErrors.email &&
                      <p style={{color:'red'}}>{this.state.formErrors.bodyWeight}</p>
                }
              </Col>
            </Row>
            <hr></hr>
            <Row className="show-grid" >
              <Col xs={2}>
                <Row className="show-grid">
                  <Col xs={1}>
                    <label style={{fontWeight:'bold'}}>Password:</label>
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col xs={1}>

                    {
                        !this.state.editPassword &&
                          <p>*************</p>
                    }

                  </Col>
                </Row>

              </Col>
              <Col  xsOffset={6} smOffset={6} mdOffset={7} xs={4} sm={4} md={3}>

                {
                    !this.state.editPassword &&
                      <Button
                        style={{background:'lightgray', marginTop:'20px'}}
                        onClick = {this.handleEdit}
                        name="editPassword"
                      >Edit</Button>
                }
                {
                  this.state.editPassword &&
                    <ButtonToolbar>
                      <Button
                        bsStyle="success"
                        onClick = {this.handleUpdate}
                        name="password"
                      >Update</Button>
                      <Button
                        name="password"
                        onClick={this.revert}
                        style={{backgroundColor:'gray'}}
                      >Revert</Button>
                    </ButtonToolbar>
                }
              </Col>
            </Row>
            {
                this.state.editPassword &&
                  <div>
                    <Row className="show-grid">
                      <Col xs={12} sm={6} md={4}>
                        <PasswordMask
                          id="updatedPassword"
                          name = "updatedPassword"
                          placeholder="Enter password"
                          value = {this.state.updatedPassword}
                          inputStyles = {{height:'30px'}}
                          buttonStyles={{backgroundColor:'gray', height:'25px'}}
                          style = {this.state.formErrors.password ? {border:'1px solid red'}:{}}
                          onChange = {this.handleUpdateChange}
                        />

                      </Col>
                      <Col xs={12} sm={6} md={4}>
                        {
                          this.state.formErrors.password &&
                            <p style={{color:'red'}}>{this.state.formErrors.password}</p>
                        }
                      </Col>
                    </Row>
                    <Row >
                      <Col xs={12}>
                        <label style={{fontWeight:'bold'}}>Confirm Password:</label>
                      </Col>
                    </Row>
                    <Row className="show-grid">
                      <Col xs={12} sm={6} md={4}>
                        <PasswordMask
                          id="updatedConfirmPassword"
                          name = "updatedConfirmPassword"
                          placeholder="re-enter new password"
                          value = {this.state.updatedConfirmPassword}
                          inputStyles = {{height:'30px'}}
                          buttonStyles={{backgroundColor:'gray', height:'25px'}}
                          style = {this.state.formErrors.passwordMatch ? {border:'1px solid red'}:{}}
                          onChange = {this.handleUpdateChange}
                        />
                      </Col>
                      <Col xs={12} sm={6} md={4}>
                        {
                          this.state.formErrors.passwordMatch &&
                            <p style={{color:'red'}}>{this.state.formErrors.passwordMatch}</p>
                        }
                      </Col>
                    </Row>
                  </div>
            }
            {
              this.state.message &&
                <Row className="show-grid">
                  <Col xs={12}>
                    <h4>{this.state.message}</h4>
                  </Col>
                </Row>
            }

            <Row className="show-grid">
              <Col xs={6} md={6}>

                <Row className="show-grid">
                  <Col xs={4} md={3}>
                    <h4 >Photo1
                    </h4>
                  </Col>
                  <Col xs={3} xsOffset={4} md={3} mdOffset={4}>
                    <h4>

                      <Icon
                        name="window-close"
                        style={{color:'red', opacity: !this.state.beforePreview ? .3:1 }}
                        disabled = {!this.state.beforePreview}
                        onClick={()=>{this.setState({
                          removeBeforeImage: true,
                          beforePreview: ''
                        })}}
                      />
                    </h4>
                  </Col>
                </Row>
                <Row className="show-grid">

                  <Col xs={12}>


                    <img
                      src= {this.state.beforePreview}
                      alt="no image"
                      style={{width:'100%',maxWidth:'300px', minWidth:'150px', minHeight:'150px', maxHeight:'300px', height:'auto', border:'2px solid black'}}


                    />
                    <input
                      type="file"
                      id="beforePreview"
                      name="beforeFile"
                      onChange={this.onPhotoChange}
                    ></input>
                  </Col>

                </Row>
              </Col>
              <Col xs={6} md={6}>

                <Row className="show-grid">
                  <Col xs={4} md={3}>
                    <h4 >Photo2
                    </h4>
                  </Col>
                  <Col xs={3} xsOffset={4} md={3} mdOffset={4}>
                    <h4>

                      <Icon
                        name="window-close"
                        style={{color:'red', opacity: !this.state.afterPreview ? .3:1 }}
                        disabled = {!this.state.afterPreview}
                        onClick={()=>{this.setState({
                          removeAfterImage: true,
                          afterPreview: ''
                        })}}
                      />
                    </h4>
                  </Col>
                </Row>
                <Row className="show-grid">

                  <Col xs={12}>


                    <img
                      src= {this.state.afterPreview}
                      alt="no image"
                      style={{width:'100%',maxWidth:'300px', minWidth:'150px', minHeight:'150px', maxHeight:'300px', height:'auto', border:'2px solid black'}}

                    />
                    <input
                      type="file"
                      id="afterPreview"
                      name="afterFile"
                      onChange={this.onPhotoChange}
                    ></input>
                  </Col>

                </Row>
              </Col>
            </Row>
            <Row className="show-grid" style={{marginTop:'20px',marginBottom:'20px'}}>
              <Col xs={12} >
                <ButtonToolbar>
                  <Button
                    bsStyle="success"
                    disabled={!this.state.swapped && this.state.beforeFile == '' && this.state.afterFile == '' && !this.state.removeAfterImage && !this.state.removeAfterImage}
                    onClick={this.handlePhotoUpdate}
                  >Update</Button>
                  <Button
                    onClick={this.handleSwap}
                  >Swap</Button>
                </ButtonToolbar>
              </Col>
            </Row>
          </Grid>


        </div>
          )
    }
  }

  export default Profile;
