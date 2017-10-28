import React from "react";
import PropTypes from 'prop-types';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer} from 'recharts';


const WeeklyReoccuranceData = (props)=>{
  function daysInMonth(month,year) {
      return new Date(year, month, 0).getDate();
  }

  function monthToNumber(mon){
    return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
  }
    var data = [];
  var MonthNumber = Number(monthToNumber(props.weeklyTime.split(' ')[0]));
  var YearNumber = Number(props.weeklyTime.split(' ')[1]);
  var benchMarkDate = new Date(`${YearNumber},${MonthNumber},1`)
  var secondBenchMarkDate = new Date(benchMarkDate.getTime()+(7)* 86400000);
  var thirdBenchMarkDate = new Date(benchMarkDate.getTime()+(14)* 86400000);
  var fourthBenchMarkDate = new Date(benchMarkDate.getTime()+(21)* 86400000);
  var fifthBenchMarkDate = new Date(`${YearNumber},${MonthNumber},${daysInMonth(Number(MonthNumber),Number(YearNumber))}`)
  // benchMarkDate = new Date(benchMarkDate.setTime(benchMarkDate.getTime()+(frequency)* 86400000));


  var week1 = [benchMarkDate,secondBenchMarkDate];
  var week2 = [secondBenchMarkDate,thirdBenchMarkDate]
  var week3 = [thirdBenchMarkDate,fourthBenchMarkDate]
  var week4 = [fourthBenchMarkDate,fifthBenchMarkDate]
  var weeks = [week1,week2,week3,week4]
  var count = 0;

  const {selectedReoccurance,arrayOfSessions} = props;
  function totalDesiredWeeklySessions(index,weekArray,selectedReoccurance,arrayOfSessions,MonthNumber,YearNumber,startingPoint){
    var count = 0;
    var secondCount = 0;
    const weekRange = weekArray[index-1]
    var timeDiff = Math.abs(weekRange[1].getTime() - weekRange[0].getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if(new Date(selectedReoccurance.StartDate) > startingPoint){
      startingPoint = new Date(selectedReoccurance.StartDate);
    }


      while(startingPoint <= new Date(selectedReoccurance.EndDate) && (weekRange[0] <= startingPoint && weekRange[1] >= startingPoint)){
        count = count + 1;
        startingPoint = new Date(startingPoint.setTime(startingPoint.getTime()+(selectedReoccurance.Frequency)* 86400000));
      }



    arrayOfSessions.forEach((session)=>{
      if(session._Template._id === selectedReoccurance._template._id){
        if(weekRange[0] <= new Date(session.updatedAt) && weekRange[1] >= new Date(session.updatedAt)){
          if(new Date(selectedReoccurance.StartDate) <=  new Date(session.updatedAt) && new Date(selectedReoccurance.EndDate) >=  new Date(session.updatedAt))
          {
            secondCount = secondCount + 1
          }

        }
      }
    })
    // index,weekArray,selectedReoccurance,arrayOfSessions,startingPoint,endingPoint,beginReoccurance,endReoccurance



    var countObject = {count:count,secondCount: secondCount, startingPoint: startingPoint};

      return countObject;
  }
  var startingPoint = new Date(`${YearNumber},${MonthNumber},1`);
  var endingPoint = new Date(`${YearNumber},${MonthNumber},${daysInMonth(Number(MonthNumber),Number(YearNumber))}`);
  for(var i = 1; i < 5; i++){

    var pointObject = {}
    pointObject.name = 'week ' + i;
    var objectRequired = totalDesiredWeeklySessions(i,weeks,selectedReoccurance,arrayOfSessions, MonthNumber,YearNumber,startingPoint)
    startingPoint = objectRequired.startingPoint
    pointObject.SessionsToDo = objectRequired.count;
    pointObject.SessionsThusFar = objectRequired.secondCount

    data.push(pointObject)
  }


  return (
    <ResponsiveContainer width='100%' minHeight="200px" >

      <BarChart
        width={600}
        height={300}
        data={data}
        onClick = {()=>{props.onMonthlyView()}}
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
WeeklyReoccuranceData.propTypes = {
  selectedReoccurance: PropTypes.object.isRequired,
  onMonthlyView: PropTypes.func.isRequired,
  arrayOfSessions:PropTypes.array.isRequired,
  weeklyTime: PropTypes.string.isRequired
}
  export default WeeklyReoccuranceData
