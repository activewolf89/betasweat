import React,{Component} from "react";
import Proptypes from 'prop-types';
class RemoveButton extends Component{
  render(){

    return(
      <button onClick={()=>this.props.onRemoveClick(this.props.whichObject, this.props.whichTitle)}> Remove </button>
    )
  }
}
RemoveButton.propTypes = {
  onRemoveClick: Proptypes.func.isRequired,
  whichObject: Proptypes.string.isRequired,
  whichTitle: Proptypes.string.isRequired
}
export default RemoveButton;
