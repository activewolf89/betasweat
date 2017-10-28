import React,{Component} from "react";
import Proptypes from 'prop-types';
class EditButton extends Component{
  render(){

    return(
      <button onClick={()=> this.props.onEditClick(this.props.whichObject, this.props.whichTitle)}> Edit </button>
    )
  }
}
EditButton.propTypes = {
  onEditClick: Proptypes.func.isRequired,
  whichObject: Proptypes.string.isRequired,
  whichTitle: Proptypes.string.isRequired
}
export default EditButton;
