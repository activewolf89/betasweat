import React from "react";
import PropTypes from 'prop-types';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer} from 'recharts';


const ReoccuranceData = (props)=>{
  function monthNames(index){
    var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
return monthNames[index]
  }
  function monthDiff(date1, date2) {

    var year1=date1.getFullYear();
    var year2=date2.getFullYear();
    var month1=date1.getMonth();
    var month2=date2.getMonth();
    if(month1===0){ //Have to take into account
      month1++;
      month2++;
    }
    var numberOfMonths = (year2 - year1) * 12 + (month2 - month1) + 1;
    return numberOfMonths
}
function totalDesiredMonthlySessions(benchMarkDate,startMonth,date1,date2,differenceInDays,frequency,filteredSessions){
  var count = 0;
  var secondCount = 0;
while(differenceInDays >=0 && startMonth === benchMarkDate.getMonth()){

  count = count + 1;

  benchMarkDate = new Date(benchMarkDate.setDate(benchMarkDate.getDate()+frequency))
  differenceInDays = differenceInDays - frequency
}
filteredSessions.forEach((session)=>{

  if(new Date(session.updatedAt).getMonth() == startMonth){
    secondCount = secondCount + 1
  }
})
var countObject = {count:count,remaining:differenceInDays,benchMarkDate:benchMarkDate,secondCount: secondCount};

  return countObject;
}
var data = [];
var differenceInMonths = monthDiff(new Date(props.selectedReoccurance.StartDate),new Date(props.selectedReoccurance.EndDate));
var countdown = differenceInMonths
var startMonth = new Date(props.selectedReoccurance.StartDate).getMonth()
var startYear = new Date(props.selectedReoccurance.StartDate).getFullYear()
var date2 = new Date(props.selectedReoccurance.EndDate);
var date1 = new Date(props.selectedReoccurance.StartDate);

var differenceInDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24));
var benchMarkDate = date1;

  var filteredSessions = props.arrayOfSessions.filter((session)=>{
    if(new Date(session.updatedAt) >= date1 && new Date(session.updatedAt) <= date2)
      if(session._Template._id == props.selectedReoccurance._template._id){
          return (
            session
          )
      }
    })


    for(var i = 0; i < differenceInMonths;i++){

      var pointObject = {}
      pointObject.name = monthNames(startMonth) + ' ' + startYear
      var objectRequired = totalDesiredMonthlySessions(benchMarkDate,startMonth,date1,date2,differenceInDays,props.selectedReoccurance.Frequency,filteredSessions)
      pointObject.SessionsToDo = objectRequired.count;
      pointObject.SessionsThusFar = objectRequired.secondCount

      differenceInDays = objectRequired.remaining
      benchMarkDate = objectRequired.benchMarkDate
      startMonth++;
      data.push(pointObject)
    }

  return (
    <ResponsiveContainer width='100%' minHeight="200px" >
      <BarChart
        data={data}
        onClick = {(e)=>{props.onWeeklyView(e.activeLabel)}}
        margin={{top: 5, right: 30, left: 20, bottom: 5}}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Tooltip/>
        <Legend />
        <Bar dataKey="SessionsThusFar" fill="#82ca9d" minPointSize={0}/>
        <Bar dataKey="SessionsToDo" fill="#8884d8" minPointSize={0}/>

      </BarChart>
    </ResponsiveContainer>
  )

}
ReoccuranceData.propTypes = {
  selectedReoccurance: PropTypes.object.isRequired,
  onWeeklyView: PropTypes.func.isRequired,
  arrayOfSessions:PropTypes.array.isRequired
}
  export default ReoccuranceData
