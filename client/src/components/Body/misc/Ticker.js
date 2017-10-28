  import React,{Component} from "react";

  class Ticker extends Component{
    constructor(props){
      super(props);
      this.state = {
        key: 1,
        day: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      };
      this.tick = this.tick.bind(this);
      this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount(){
      var intervalId = setInterval(this.tick,1000)
      this.setState({intervalId: intervalId});
    }
    componentWillUnmount(){
      clearInterval(this.state.intervalId);
    }
     tick(){
      this.setState(()=>{this.setState({time: new Date().toLocaleTimeString()})})
    }
    handleSelect(Key){
      console.log('selected' + Key)
      this.setState({key: Key})
    }
    render(){
      return(
      )
    }
  }

  export default Ticker;
