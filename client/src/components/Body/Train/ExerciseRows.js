  import React,{Component} from "react";
  import PropTypes from 'prop-types';
  class ExerciseRows extends Component{
    constructor(props){
      super(props);
      this.templateTitles = this.templateTitles.bind(this);
    }
    templateTitles(){
      var templateString = '';

      for(var i = 0; i < this.props.exerciseObject._Templates.length;i++){
        if(this.props.exerciseObject._Templates.length > i + 1){
          templateString += this.props.exerciseObject._Templates[i].Title + ','
        } else {
          templateString += this.props.exerciseObject._Templates[i].Title

        }
      }
      return templateString;
    }
    render(){
      function checkIfSelected(selectedExercise,exerciseObject){
        if(selectedExercise !== {} && selectedExercise._id === exerciseObject._id){
          return true;
        } else {
          return false;
        }
      }

      return(
        <tr style={checkIfSelected(this.props.selectedExercise, this.props.exerciseObject) ? {background:'gray', color:'white'}: {}}
          key={this.props.exerciseObject._id}
          onClick={()=>{this.props.OnSelectedThisRow(this.props.exerciseObject)}}
          onDoubleClick={()=>{this.props.OnDoubleClick(this.props.exerciseObject)}}
        >
          <td><input type="checkbox" style={{}} disabled checked={this.props.exerciseObject.Metric}/></td>
          <td>{this.props.exerciseObject.Title}</td>
          <td>{this.props.exerciseObject.Description}</td>
          <td>{this.templateTitles()}</td>
        </tr>
      )
    }
  }
  ExerciseRows.propTypes = {
    selectedExercise: PropTypes.object.isRequired,
    exerciseObject: PropTypes.object.isRequired,
    OnSelectedThisRow: PropTypes.func.isRequired,
    OnDoubleClick: PropTypes.func.isRequired
  }
  export default ExerciseRows;
