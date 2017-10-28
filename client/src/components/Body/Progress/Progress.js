  import React,{Component} from "react";
  import {Grid,Row,Col} from 'react-bootstrap';
  import axios from 'axios';
  import LineChart from 'react-linechart';
  import {ResponsiveContainer} from 'recharts';

  import {Redirect} from 'react-router-dom';
import '../../../../node_modules/react-linechart/dist/styles.css';
  import {Button,ButtonToolbar} from 'react-bootstrap';
  class Progress extends Component{
    constructor(props){
      super(props);
      this.state = {
        selectedTemplate: '',
        strength: 0,
        weight: 0,
        allSessionData: [],
        filteredSessionData: [],
        allUserInfo: '',
        progressMessage: "",
        arrayOfTemplateTitles: [],
        graphData: [],
        keyMetricData: [],
        bodyWeightData: [],
        showOverall: true,
        showSessions: 'Show All Overall',
        min:0,
        max:0,
        redirectToDetail: false,
        toDate: '',
        fromDate: '',
        minBodyWeight: 0,
        maxBodyWeight: 0,
        bodyWeightGraphData: [],
        showBodyweight: false,
        strengthChange: 0
      }
      this.handleTemplateChange = this.handleTemplateChange.bind(this);
      this.loadSpecs = this.loadSpecs.bind(this);
      this.loadOverall = this.loadOverall.bind(this);
      this.loadKeyMetrics = this.loadKeyMetrics.bind(this);
      this.handleSelectChange = this.handleSelectChange.bind(this);
      this.getRandomColor = this.getRandomColor.bind(this);
      this.handleWhichToLoad = this.handleWhichToLoad.bind(this);
      this.handlePointClick = this.handlePointClick.bind(this);
      this.getTodaysDate = this.getTodaysDate.bind(this);
      this.handleCalendarChange = this.handleCalendarChange.bind(this);
      this.showSessionsWithinTime = this.showSessionsWithinTime.bind(this);
      this.loadBodyWeight = this.loadBodyWeight.bind(this);
    }
    componentDidMount(){
      //grabbing all Session data to provide
      // an overall fitness analysis via key metrics in the breakdown.
      //data is split up into allSessionData pertaining to current weight
      //we want to load all types of templates and load that option within Parent
      //component so if it changes we change the metrics
      axios.get('/train/progress/templateTitles/' + this.props.payLoad._id).then((response)=>{
        //find all titles of templates to select from.
        var arrayOfTemplateTitles = []
        if(response.data.length < 1){
          //if there are no templates
          this.setState({
            progressMessage: "You currently have no templates to view"
          })
        } else {
          //if there are template titles, create a unique array of their titles
          for(var i = 0; i < response.data.length;i++){
            let notInside = true;
            for(var m = 0; m < arrayOfTemplateTitles.length;m++){
              if(response.data[i].Title === arrayOfTemplateTitles[m]){
                notInside = false;
              }
            }
            if(notInside){
              arrayOfTemplateTitles.push(response.data[i].Title)
            }
          }

          this.setState({
            arrayOfTemplateTitles: arrayOfTemplateTitles,
            progressMessage:"Select Your Choice Of Template Data To View",
            selectedTemplate: !this.props.params.location.templateObject ? arrayOfTemplateTitles[0]: this.props.params.location.templateObject._Template.Title
          }, this.loadSpecs)
          //anchor
        }

      })
    }
    loadBodyWeight(){
      var seshData = this.state.filteredSessionData;
      var allSessionMin = 0;
      var allSessionMax = 0;

      var bodyWeightObject = {};
        bodyWeightObject["name"] = "BodyWeight";
        bodyWeightObject["id"] = "BodyWeight";
        bodyWeightObject["color"] = "Maroon";
        bodyWeightObject["points"] = [];



        seshData.forEach((session,index)=>{
          if(session.CurrentWeight < allSessionMin){
            allSessionMin = session.CurrentWeight
          }
          if(session.CurrentWeight > allSessionMax){
            allSessionMax = session.CurrentWeight
          }
        var secondPointObject = {x:index + 1,y:Number(session.CurrentWeight)};
        bodyWeightObject["points"].push(secondPointObject);
        })
        this.setState({
          minBodyWeight: allSessionMin,
          maxBodyWeight: allSessionMax,
          bodyWeightGraphData: [bodyWeightObject]
        })
    }
    showSessionsWithinTime(){

      var seshData = this.state.allSessionData;
      var toDate = parseDate(this.state.toDate);
          toDate.setDate(toDate.getDate() + 1);
      var fromDate = parseDate(this.state.fromDate);
      function parseDate(input) {
        var parts = input.split('-');
        // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])

        return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
      }

      var arrayOfSelectedSessions = [];

      for(var i = 0; i < seshData.length;i++){
        var sessionCreatedAt = new Date(seshData[i].createdAt)

        if(sessionCreatedAt >= fromDate && sessionCreatedAt <= toDate){
          arrayOfSelectedSessions.push(seshData[i])
        }
      }
      var theChange = 0;
      if(arrayOfSelectedSessions.length > 1){
        theChange = (((arrayOfSelectedSessions[arrayOfSelectedSessions.length -1].Strength - arrayOfSelectedSessions[0].Strength)/arrayOfSelectedSessions[0].Strength)*100).toFixed(2)
      }
        this.setState({
          filteredSessionData: arrayOfSelectedSessions,
          strengthChange: theChange

        },()=>{
          if(this.state.showOverall){
            this.loadOverall()
          } else {
            this.loadKeyMetrics()
          }
        })
    }

    handleCalendarChange(name,value){

      this.setState({
        [name]:value
      },()=>{
        if(this.state.toDate && this.state.fromDate){
            this.showSessionsWithinTime()

        }
      })
    }
    getTodaysDate(){
      var d = new Date(),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    }
    handlePointClick(event,point){
      this.setState({
        redirectToDetail: this.state.allSessionData[point.x-1]
      })
    }
    getRandomColor(){
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;

    }
    handleWhichToLoad(){
      var copyOfSessionData = this.state.allSessionData.slice();
      var arrayOfFiltered = [];
      var triggerCalendar = false;
    switch(this.state.showSessions){
      case "Show All Overall":
      arrayOfFiltered = copyOfSessionData;
      break;
      case "Since Last Benchmark":
      for(let i = copyOfSessionData.length - 1; i >= 0;i--){
        if(!copyOfSessionData[i].Benchmark){
          arrayOfFiltered.unshift(copyOfSessionData[i])
        }
        if(copyOfSessionData[i].BenchMark){
          arrayOfFiltered.unshift(copyOfSessionData[i])
          break;
        }
      }
      break;
      case "Between Benchmarks":
      copyOfSessionData.forEach((session,index)=>{
        if(session.BenchMark){
          arrayOfFiltered.push(session)
        }
      })
      break;
      case "Within Time Period":
       triggerCalendar = true;
       break;
      default:
      arrayOfFiltered = copyOfSessionData;
      break;

    }
    var theChange = 0;

    if(arrayOfFiltered.length > 1){
      theChange = (((arrayOfFiltered[arrayOfFiltered.length -1].Strength - arrayOfFiltered[0].Strength)/arrayOfFiltered[0].Strength)*100).toFixed(2)
    }

    this.setState({
      filteredSessionData: this.state.showSessions === "Within Time Period"? this.state.filteredSessionData: arrayOfFiltered,
      showCalendarInput: triggerCalendar,
      strengthChange: theChange,
      toDate: triggerCalendar ? this.state.toDate: '',
      fromDate: triggerCalendar ? this.state.toDate: '',
    },()=>{
      if(this.state.showOverall){
        this.loadOverall()
      } else {
        this.loadKeyMetrics()
      }
    })
    }

    loadOverall(){
      this.loadBodyWeight()
      var seshData = this.state.filteredSessionData;
      var allSessionMin = 0;
      var allSessionMax = 0;

      var strengthSessionObject = {};
        strengthSessionObject["name"] = "strength";
        strengthSessionObject["id"] = "strength";
        strengthSessionObject["color"] = "purple";
        strengthSessionObject["points"] = [];



        seshData.forEach((session,index)=>{
          if(session.Strength < allSessionMin){
            allSessionMin = session.Strength
          }
          if(session.Strength > allSessionMax){
            allSessionMax = session.Strength
          }
        var secondPointObject = {x:index + 1,y:Number(session.Strength)};
        strengthSessionObject["points"].push(secondPointObject);
        })
        this.setState({
          min: allSessionMin,
          max: allSessionMax,
          showOverall: true,
          graphData: [strengthSessionObject]
        })
        }
    handleSelectChange(e){
      this.setState({
        showSessions: e.target.value,
      }, this.handleWhichToLoad)
    }
    loadKeyMetrics(){
      //first iterate through all the session data;
      var dataSet = [];
      var listingOfTitles = [];
      var arrayOfColors = ["Orchid","Aqua","Aquamarine","Black","Blue","Chartreuse","Coral","Cornsilk","DarkBlue", "MidnightBlue",
    "DarkGreen","DarkKhaki","DarkMagenta","DarkRed","DeepPink","DimGrey","FireBrick","ForestGreen","LightGoldenRodYellow","LightPink"]
      var seshData = this.state.filteredSessionData
      var mostRecentMetricArray = seshData[seshData.length -1] ? seshData[seshData.length -1].ArrayOfExercises.slice(): [] ;
      for(let i = 0; i < mostRecentMetricArray.length;i++){
        if(mostRecentMetricArray[i].isMetric){
          listingOfTitles.push(mostRecentMetricArray[i].title)
        }
      }
      for(let i = 0; i < listingOfTitles.length;i++){
        var dataSetObject = {};
        dataSetObject["name"] = listingOfTitles[i];
        dataSetObject["id"] = listingOfTitles[i];
        dataSetObject["color"] = arrayOfColors.length > 0 ? arrayOfColors.splice(0,1):this.getRandomColor();
        dataSetObject["points"] = [];

        seshData.forEach((session,index)=>{
          session.ArrayOfExercises.forEach((exercise,index1)=>{
            if(listingOfTitles[i] === exercise.title){
              dataSetObject.points.push({x:index + 1, y:Number(exercise.currentStrength)})
            }
          })
        })
        dataSet.push(dataSetObject);
      }
      this.setState({
        keyMetricData: dataSet,
        showOverall: false,
      })

}

    loadSpecs(){
      //load specs will do the math for the given template selected
      //for now, the code is just finding the current strength - to - weight(of most recent session)
      var allSessionsInTemplate = [];
      if(this.state.selectedTemplate !== ""){
        axios.get('/train/progress/'+this.state.selectedTemplate + '/' + this.props.payLoad._id).then((res)=>{

          if(res.data._Session.length < 1){
            this.setState({
              strength: 0,
              strength_To_Weight: 0,
              graphData: [],
              keyMetricData:[],
              progressMessage: "No Sessions in this Template"
            })
          } else{
            //if there is lets populate most recent data in top and push in
            //data to the graph.
            // strength: 0,weight: 0,  strength_To_Weight: 0,
            var recentSession = res.data._Session[res.data._Session.length -1];
            allSessionsInTemplate = res.data._Session;

            this.setState({
              progressMessage: res.data.Title + " specs have been loaded",
              allSessionData: allSessionsInTemplate,
              strength: recentSession.Strength,
              weight: recentSession.CurrentWeight,
              strength_To_Weight: recentSession.Strength_To_Weight,
            },this.handleWhichToLoad)
          }

        })
    }
    }
    handleTemplateChange(e){
      this.setState({
        selectedTemplate: e.target.value,
        strengthChange: 0
      },this.loadSpecs)
    }

    render(){

      var templateTitles;
      if(this.state.arrayOfTemplateTitles.length > 0){
       templateTitles = this.state.arrayOfTemplateTitles.map((title)=>{
        return(<option key={title}>{title}</option>)
      })
    }
    var edit = { pathname: '/sessions/edit/', sessionObject: this.state.redirectToDetail};
      return(

        <Grid>
          {
            this.state.redirectToDetail &&
              <Redirect to ={edit} />
          }
          <Row className="show-grid">
            <Col xs={12} ><h4 style={{textAlign:'center'}}>Progress</h4></Col>
          </Row>
          <hr></hr>
          <Row className="show-grid">
            <Col xs={12}>
              <h4 style={{textAlign:'center'}}>
                <select value = {this.state.selectedTemplate} onChange={this.handleTemplateChange}>
                  {templateTitles}
                </select>

              </h4>
            </Col>
          </Row>
          {
            this.state.progressMessage &&
              <Row className="show-grid">
                <Col xs={12}>
                  <h5 style={{fontWeight:'bold', textAlign:'center'}}>{this.state.progressMessage}</h5>
                  <h5 style={{fontWeight:'bold', textAlign:'center'}}>{this.state.style}</h5>
                </Col>
              </Row>
          }

          <Row className="show-grid">
            <Col style={{border:'1px solid black'}} xs={6}>
              <h5>Overall Strength</h5>
            </Col>
            <Col style={{border:'1px solid black'}} xs={6}>
              <h5> {this.state.strength} </h5>
            </Col>
          </Row>

          <Row className="show-grid">
            <Col style={{border:'1px solid black'}} xs={6}>
              <h5> Weight </h5>
            </Col>
            <Col style={{border:'1px solid black'}} xs={6}>
              <h5> {this.state.weight} </h5>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col style={{border:'1px solid black'}} xs={6}>
              <h5> Strength Change</h5>
            </Col>
            <Col style={{border:'1px solid black'}} xs={6}>
              <h5> {this.state.strengthChange} % </h5>
            </Col>
          </Row>
          <Row className="show-grid" style={{marginTop:'10px'}}>
            <Col xs={12}>

              <h4 style={{textAlign:'center'}}>
                <select onChange={this.handleSelectChange} value={this.state.showSessions}>
                  <option>Since Last Benchmark</option>
                  <option>Between Benchmarks</option>
                  <option>Within Time Period</option>
                  <option>Show All Overall</option>
                </select>
              </h4>
            </Col>
            <Col xs={12}>

              <h5 style={{textAlign:'center', fontStyle:'italic'}}>
                Clicking any point goes to detailed edit
              </h5>
            </Col>
            <Col xs={12}>
              <ButtonToolbar>
                {
                  this.state.showOverall && !this.state.showBodyWeight &&
                    <Button bsSize="small" onClick={this.loadKeyMetrics} style={{color:'white',backgroundColor:'maroon'}}>Key Metrics</Button>
                }
                {
                        !this.state.showOverall && !this.state.showBodyWeight &&
                          <Button bsSize="small" onClick={this.loadOverall} style={{color:'white',backgroundColor:'maroon'}} > Overall</Button>
                }
                {
                  this.state.showBodyWeight &&
                    <Button bsSize="small" style={{backgroundColor:'lightGray'}} onClick={()=>{this.setState({showBodyWeight: false})}}> Metrics</Button>
                }
                {
                  !this.state.showBodyWeight &&
                    <Button bsSize="small" style={{backgroundColor:'lightGray'}} onClick={()=>{this.setState({showBodyWeight: true})}}>Body Weight</Button>
                }
              </ButtonToolbar>
            </Col>


            {
              this.state.showCalendarInput &&
                <Col xs={12}>
                  <h5 style={{textAlign:'center', fontStyle:'italic'}}>
                    From: <input
                      type="date"
                      name="fromDate"
                      value={this.state.fromDate}
                      onChange={(e)=>{this.handleCalendarChange(e.target.name,e.target.value)}}
                      max = {this.state.toDate ? this.state.toDate: this.getTodaysDate()}
                          />
                    To : <input
                      type="date"
                      name="toDate"
                      value={this.state.toDate}
                      onChange={(e)=>{this.handleCalendarChange(e.target.name,e.target.value)}}
                      min = {this.state.fromDate ? this.state.fromDate:''}
                      max={this.getTodaysDate()}
                         />
                  </h5>
                </Col>
            }
          </Row>
          <Row className="show-grid">
            <Col xs={12}>
              {
                this.state.showOverall && !this.state.showBodyWeight &&
                  <ResponsiveContainer aspect={4.0/3.0} >
                    <LineChart
                      xLabel="Sessions"
                      yLabel="Strength"
                      onPointClick = {this.handlePointClick}
                      showLegends
                      legendPosition="bottom"
                      yMin = {this.state.min -(this.state.min * .1)}
                      yMax={this.state.max + (this.state.max * .1)}

                      data={this.state.graphData}
                    />
                  </ResponsiveContainer>
              }
              {
                !this.state.showOverall && !this.state.showBodyWeight &&
                  <ResponsiveContainer aspect={4.0/3.0} >

                    <LineChart
                      onPointClick = {this.handlePointClick}
                      xLabel="Sessions"
                      yLabel="Strength"
                      width={800}
                      height={400}
                      showLegends
                      legendPosition="bottom"
                      data={this.state.keyMetricData}
                    />
                  </ResponsiveContainer>
              }
              {
                this.state.showBodyWeight &&
                  <ResponsiveContainer aspect={4.0/3.0} >

                    <LineChart
                      onPointClick = {this.handlePointClick}
                      xLabel="Sessions"
                      yLabel="BodyWeight"

                      yMin = {this.state.minBodyWeight * .9}
                      yMax = {this.state.maxBodyWeight * 1.1}
                      showLegends
                      legendPosition="bottom"
                      data={this.state.bodyWeightGraphData}
                    />

                  </ResponsiveContainer>
              }
            </Col>
          </Row>

              </Grid>
              )
            }

  }

  export default Progress;
