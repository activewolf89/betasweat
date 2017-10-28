var axios = require('axios') ;

var self = module.exports = {
beforeFile: function(file,userId){
  const formData = new FormData();
  formData.append('myFile',file)
  const config = {
    headers: {
        'content-type': 'multipart/form-data'
    }
  }
  axios({
    method:'post',
    url: '/profile/image/before/'+userId,
    config: config,
    data: formData,
  })
  return
},
afterFile: function(file,userId){
  const formData = new FormData();
  formData.append('myFile',file)
  const config = {
    headers: {
        'content-type': 'multipart/form-data'
    }
  }
  axios({
    method:'post',
    url: '/profile/image/after/'+userId,
    config: config,
    data: formData,
  })
  return
},
swapFiles: function(userId,order,file){
  axios.get('/profile/swapimages/'+userId).then(()=>{

    if(order ==="before"){
      self.beforeFile(file,userId)
    }
    if(order ==="after"){
      self.afterFile(file,userId)
    }
    if(order ==="removeAfter"){
      self.removeAfterImage(userId)
    }
    if(order ==="removeBefore"){
      self.removeBeforeImage(userId);
    }


  })
  return
},
removeBeforeImage: function(userId){
  axios.get('/profile/removeBeforeImage/'+userId).then((res)=>{
    console.log(res)
    return
  })
},
removeAfterImage: function(userId){
  axios.get('/profile/removeAfterImage/'+userId).then((res)=>{
    console.log(res)
    return
  })
},
base64toBlob: function (base64Data, contentType) {
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
    return new Blob(byteArrays);
}
}
