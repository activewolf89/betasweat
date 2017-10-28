import React,{Component} from "react";
import PropTypes from 'prop-types';

class TemplateRows extends Component{

  render(){
    function checkIfSelected(selectedSession,particularObject){
      if(selectedSession !== {} && selectedSession._id === particularObject._id){
        return true;
      } else {
        return false;
      }
    }
  return (
    <tr id={this.props.sessionObject._id} style={checkIfSelected(this.props.selectedSession, this.props.sessionObject) ? {background:'gray', color:'white'}: {}}
      key={this.props.sessionObject._id}
      onClick={()=>{this.props.OnSelectedThisRow(this.props.sessionObject)}}
      onDoubleClick={()=>{this.props.OnDoubleClick(this.props.sessionObject)}}
    >
      <td>{new Date(this.props.sessionObject.createdAt).toDateString()}</td>
      <td>{this.props.sessionObject.Strength}</td>
      <td>{this.props.sessionObject._Template.Title}</td>
      <td><input type="checkbox" checked={this.props.sessionObject.BenchMark} disabled /></td>
    </tr>
  )
}
}
TemplateRows.propTypes = {
  sessionObject: PropTypes.object.isRequired,
  OnSelectedThisRow: PropTypes.func.isRequired,
  OnDoubleClick: PropTypes.func.isRequired
}
  export default TemplateRows;
