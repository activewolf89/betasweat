  import React,{Component} from "react";
  import axios from 'axios';

  class ShowImage extends Component{
    constructor(props){
      super(props);
      this.state = {
        preview: ''
      }
    }
    componentDidMount(){
      function base64toBlob(base64Data, contentType) {
          contentType = contentType || '';
          var sliceSize = 1024;
          var byteCharacters = atob(base64Data);
          var bytesLength = byteCharacters.length;
          var slicesCount = Math.ceil(bytesLength / sliceSize);
          var byteArrays = new Array(slicesCount);

          for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
              var begin = sliceIndex * sliceSize;
              var end = Math.min(begin + sliceSize, bytesLength);

              var bytes = new Array(end - begin);
              for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                  bytes[i] = byteCharacters[offset].charCodeAt(0);
              }
              byteArrays[sliceIndex] = new Uint8Array(bytes);
          }
          return new Blob(byteArrays, { type: contentType });
      }

      if(this.props.props){
        console.log('2')
        axios.get('/getimage/'+this.props.props.location.imageId).then((res)=>{
          console.log(res);
          let contentType = "image/jpeg"
        var response =   base64toBlob(res.data,contentType)
        console.log(response)
        var filereader = new FileReader();
        filereader.readAsDataURL(response);
        filereader.onload = (e)=>{
          this.setState({
            preview: e.target.result
          })
        }


        })
      }
  }
    render(){
      return(
        <img src={this.state.preview} style={{width:'200px',height:'200px', border:'2px solid black'}} />

      )
    }
  }

  export default ShowImage;
