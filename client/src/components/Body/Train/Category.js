  import React,{Component} from "react";
  import {Table,Button,Grid,Row,Col} from 'react-bootstrap';
  import axios from 'axios';
  import RemoveCategoryButton from './RemoveCategoryButton.js';
  class Category extends Component{
    constructor(props){
      super(props);
      this.state = {
      arrayOfCategories: [],
      arrayOfExercises: [],
      selectCategory: "",
      editMode:false,
      selectedEditInput:"",
      editInputError: "",
      removeButton:false,
      removeTitle:"",
      addCategoryMode: false,
      addCategoryTitle: "",
      addCategoryTitleError:""
      }
      this.handleTableRowClick = this.handleTableRowClick.bind(this);
      this.handleCategoryEdit = this.handleCategoryEdit.bind(this);
      this.handleEditValue = this.handleEditValue.bind(this);
      this.handleEditSubmit = this.handleEditSubmit.bind(this);
      this.handleRemoveButton = this.handleRemoveButton.bind(this);
      this.handleDecision = this.handleDecision.bind(this);
      this.handleSubmitCategory = this.handleSubmitCategory.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);
    }
    handleInputChange(name,value){
      this.setState({
        addCategoryTitleError: "",
        [name]:value
      })
    }
    handleSubmitCategory(){
      if(this.state.addCategoryTitle === ""){
        this.setState({
          addCategoryTitleError: "Cannot be blank"
        })
        return;
      }
      for(var i = 0; i < this.state.arrayOfCategories.length;i++){
        if(this.state.arrayOfCategories[i].Title === this.state.addCategoryTitle.toUpperCase()){
          this.setState({
            addCategoryTitleError: "Category title already exists"
          })
          return
        }
      }
      axios({
        method: 'post',
        url: '/train/category/add',
        data: {title: this.state.addCategoryTitle.toUpperCase()}
      }).then((res)=>{
        this.setState({
          addCategoryMode: false,
          arrayOfCategories: res.data,
          addCategoryTitle: ""
        })
      })
    }
    handleDecision(title,action,decision){
      if(action === "exit"){
        this.setState({
          removeButton: false
        })
        return
      }
      if(action==="proceed" && decision ==="Just Remove Category"){
        axios.get('/train/category/remove/'+title).then((res)=>{
          console.log(res)
          if(res.data[0].Exercises){
            this.setState({
              removeButton: false,
              arrayOfCategories: res.data,
              arrayOfExercises: res.data[0].Exercises,
              selectCategory: res.data[0].Title

            })

          } else {
            this.setState({
              removeButton: false,
              selectCategory: "",
              arrayOfExercises: []

            })
          }
        })
        return
      }
      if(action==="proceed" && decision ==="Remove Category and Associated Exercises"){
        axios.get('/train/category/removeBoth/'+title).then((res)=>{
          console.log(res)
          this.setState({
            removeButton: false,
            arrayOfCategories: res.data,
            arrayOfExercises: res.data[0].Exercises,
            selectCategory: res.data[0].Title

          })
        })
        return
      }
      //title,action(proceed/exit),if proceed what to do(Just Remove Category/Remove Category and Associated Exercises)

    }
    handleRemoveButton(name){
      this.setState({removeButton:true,removeTitle:name})
    }
    handleEditSubmit(){
      var checkMatch = this.state.selectedEditInput.toUpperCase();
      if(checkMatch === this.state.selectCategory){
        this.setState({
          editInputError:"Change Category or click out to exit edit mode"
        })
        return;
      }
      if(checkMatch === ""){
        this.setState({
          editInputError:"Category Title Cannot Be Empty"
        })
        return;
      }
      for(var i = 0; i < this.state.arrayOfCategories.length;i++){
        if(checkMatch === this.state.arrayOfCategories[i].Title){
          this.setState({
            editInputError:"Category Already Exists With Title"
          })
          return;
        }
      }
      axios({
        method: 'post',
        url: '/train/category/edit/'+this.state.selectCategory,
        data: {
          newTitle: checkMatch
        }
      }).then((res)=>{
        this.setState({
          arrayOfCategories: res.data,
          editMode: false
        })
      })
    }
    handleEditValue(e){
      if(e.target.value !== ""){
        this.setState({
          editInputError: ""
        })
      }
      this.setState({
        selectedEditInput: e.target.value
      })
    }
    handleCategoryEdit(name){
      this.setState({
        editMode: true,
        selectCategory: name,
        selectedEditInput: this.state.selectCategory
      })
    }
    handleTableRowClick(nameOfSelected){

      var filterToSelect = this.state.arrayOfCategories.filter((category)=>{

         return category.Title === nameOfSelected
      })
      this.setState({
        selectCategory: nameOfSelected,

        arrayOfExercises: filterToSelect[0].Exercises,
      })
      if(this.state.editMode && nameOfSelected !== this.state.selectCategory){
        this.setState({
          editMode:false
        })
      }

    }
    componentDidMount(){
      axios.get("/train/category").then((res)=>{
        if(res.data[0]){
          this.setState({
            arrayOfCategories: res.data,
            selectCategory: res.data[0].Title,
            arrayOfExercises: res.data[0].Exercises
          })

        } else {
          this.setState({
            arrayOfCategories: res.data,
            selectCategory: "",
            arrayOfExercises: []
          })
        }
      })
    }
    render(){
      return(
        <Grid>
          <Row className="show-grid">
            {
              !this.state.addCategoryMode &&
                <Col md={3}>
                  <Button onClick={()=>{this.setState({addCategoryMode:true})}} bsStyle="primary">Add New Category</Button>
                </Col>
            }
          </Row>
          <Row style={{marginBottom:'10px'}} className="show-grid">

            {
              this.state.addCategoryMode &&
                <div>

                  <Col md={2}>
                    <Button onClick={this.handleSubmitCategory} bsStyle="success">Submit Category</Button>
                  </Col>

                  <Col md={2}>
                    <input type="text" onChange = {(e)=>{this.handleInputChange(e.target.name,e.target.value)}} value={this.state.addCategoryTitle} name="addCategoryTitle"/>
                  </Col>

                </div>

            }

          </Row>
          { this.state.removeButton &&
            <RemoveCategoryButton onDecision = {this.handleDecision} title={this.state.removeTitle}/>
          }
          <Row className = "show-grid">
            <Col md={6}>

              <Table style={{background:"white"}}>
                <thead>
                  <tr style={{bottomBorder:"black"}}>
                    <th>#</th>
                    <th>Title</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!this.state.arrayOfCategories ? <tr><td>Loading...</td><td>Loading...</td><td>Loading...</td></tr>:
                    this.state.arrayOfCategories.map((Category,index)=>{
                      if(this.state.selectCategory === Category.Title){
                        if(!this.state.editMode){

                          return(

                            <tr key={index} onClick={()=>{this.handleTableRowClick(Category.Title)}} value={Category.Title} style={{fontWeight:'bold', backgroundColor:'lightPink'}} >
                              <td>{index+1}</td>
                              <td>{Category.Title}</td>
                              <td>
                                <Button style={{marginRight:"20px"}} onClick={()=>{this.handleCategoryEdit(Category.Title)}}>Edit</Button>

                                <Button onClick={()=>{this.handleRemoveButton(Category.Title)}} style={{backgroundColor:'darkGray',color:'white'}}>Remove</Button>
                              </td>
                            </tr>
                          )
                        } else {
                          return(
                            <tr key={index} onClick={()=>{this.handleTableRowClick(Category.Title)}} value={Category.Title} style={{fontWeight:'bold', backgroundColor:'lightPink'}} >

                              <td>{index+1}</td>

                              <td><input type="text" defaultValue={Category.Title} onChange={this.handleEditValue}/></td>
                              {
                                this.state.editInputError !== "" &&
                                  <span style={{color:'red',display:'block'}}>{this.state.editInputError} </span>

                              }
                              <td>
                                <Button onClick={this.handleEditSubmit} style={{marginRight:"10px", backgroundColor:'teal'}}>Submit</Button>

                                <Button onClick={()=>{this.handleRemoveButton(Category.Title)}} style={{backgroundColor:'darkGray',color:'white'}}>Remove</Button>

                              </td>

                            </tr>




                          )
                        }
                      } else {
                        return(

                          <tr key={index} onClick={()=>{this.handleTableRowClick(Category.Title)}} name={Category.Title} >
                            <td>{index+1}</td>
                            <td style={{fontWeight:'bold'}}>{Category.Title}</td>
                            <td>

                              <Button style={{marginRight:"20px"}} onClick={()=>{this.handleCategoryEdit(Category.Title)}}>Edit</Button>

                              <Button style={{backgroundColor:'darkGray',color:'white'}} onClick={()=>{this.handleRemoveButton(Category.Title)}}>Remove</Button></td>
                          </tr>
                        )
                      }
                    })}
                </tbody>
              </Table>
            </Col>
            <Col md={4}>
              <Table style={{background:'white'}}>
                <thead>
                  <tr>
                    <th> Exercises In Category </th>

                  </tr>
                </thead>
                <tbody>
                  {!this.state.arrayOfExercises ? <tr><td>Loading...</td></tr>:
                    this.state.arrayOfExercises.map((exercise)=>{
                      return (
                        <tr key={exercise.Title}>
                          <td>{exercise.Title}</td>
                        </tr>
                      )
                    }
                    )}

                </tbody>
              </Table>
            </Col>
          </Row>



          {this.state.addCategoryTitleError  &&
            <span style={{color:'red'}}>{this.state.addCategoryTitleError}</span>}
        </Grid>
          )
          }
          }

          export default Category;
