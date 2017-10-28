  import React,{Component} from "react";
  import {Modal,Button} from 'react-bootstrap';
  import PropTypes from 'prop-types';
  class RemoveCategoryButton extends Component{
    constructor(props){
      super(props);
      this.state={
        selectedOption: "Just Remove Category"
      }
      this.handleRemoveSelect = this.handleRemoveSelect.bind(this);
      this.handleTheSubmit = this.handleTheSubmit.bind(this);
    }
    handleTheSubmit(action){
      this.props.onDecision(this.props.title,action,this.state.selectedOption)
    }
    handleRemoveSelect(value){
      this.setState({
        selectedOption: value
      })
    }
    render(){
      return(
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Removing Category: {this.props.title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <select onChange={(e)=>{this.handleRemoveSelect(e.target.value)}} selected={this.state.selectedOption}>
              <option>Just Remove Category</option>
              <option>Remove Category and Associated Exercises</option>
            </select>
            <h1>Description of Action:</h1>
            {
              this.state.selectedOption === "Just Remove Category" &&
                <p>Remove this Category from database and set all associated exercises to empty</p>
            }
            {
              this.state.selectedOption === "Remove Category and Associated Exercises" &&
                <p>Remove this Category from database and delete all associated exercises</p>
            }
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={()=>{this.handleTheSubmit('exit')}}>Close</Button>
            <Button onClick={()=>{this.handleTheSubmit('proceed')}} bsStyle="primary">Submit Action</Button>
          </Modal.Footer>

        </Modal.Dialog>

      )
    }
  }
  RemoveCategoryButton.propTypes = {
    onDecision: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  }
  export default RemoveCategoryButton;
