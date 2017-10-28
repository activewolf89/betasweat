import React from "react";
import PropTypes from 'prop-types';
const ReminderRow = (props)=>{
  const {reminderObject} = props
  function checkIfSelected(selectedReminder,reminderObject){
    if(selectedReminder !== {} && selectedReminder._id === reminderObject._id){
      return true;
    } else {
      return false;
    }
  }
  return (
    <tr
      style={checkIfSelected(props.selectedReminder, props.reminderObject) ? {background:'blue', color:'white'}: {}}
      onClick = {(e)=>{props.OnSelectedThisRow(props.reminderObject)}}
      onDoubleClick = {(e)=>{props.OnDoubleClick(props.reminderObject)}}
    >
      <td>{reminderObject._template.Title}</td>
      <td><input type="checkbox" disabled checked={reminderObject.EndDate >= reminderObject.StartDate}/></td>
      <td><input type="checkbox" disabled checked={reminderObject.EmailNotification}/></td>
      <td>{reminderObject.Frequency}</td>
    </tr>
  )
}
ReminderRow.propTypes = {
  selectedReminder: PropTypes.object.isRequired,
  reminderObject: PropTypes.object.isRequired,
  OnSelectedThisRow:PropTypes.func.isRequired,
  OnDoubleClick: PropTypes.func.isRequired
}
  export default ReminderRow;
