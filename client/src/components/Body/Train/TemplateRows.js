  import React,{Component} from "react";
  import PropTypes from 'prop-types';
  require('./TrainingCss.css')
  class TemplateRows extends Component{
    render(){
      function checkIfSelected(selectedTemplate,particularTemplate){
        if(selectedTemplate !== {} && selectedTemplate._id === particularTemplate._id){
          return true;
        } else {
          return false;
        }
      }
      return(
        <tr style={checkIfSelected(this.props.selectedTemplate, this.props.templateObject) ? {background:'gray', color:'white'}: {}}
          key={this.props.templateObject._id}
          onClick={()=>{this.props.OnSelectedThisRow(this.props.templateObject)}}
          onDoubleClick={()=>{this.props.OnDoubleClick(this.props.templateObject)}}
        >
          <td>{this.props.templateObject.Title}</td>
          <td>{this.props.templateObject.Category}</td>
          <td>{this.props.templateObject._Exercises.length}</td>
          <td>{this.props.templateObject._Session.length}</td>
        </tr>
      )
    }
  }
  TemplateRows.propTypes = {
    templateObject: PropTypes.object.isRequired,
      selectedTemplate: PropTypes.object.isRequired,
      OnSelectedThisRow: PropTypes.func.isRequired,
      OnDoubleClick: PropTypes.func.isRequired
  }
  export default TemplateRows;
