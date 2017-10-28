  import React,{Component} from "react";
  import NoMatches from './/big.jpg';

  class NoMatch extends Component{
    render(){
      return(
        <img src={NoMatches} style={{border: '3px solid green', width:'100%',height:'auto'}} />
      )
    }
  }

  export default NoMatch;
