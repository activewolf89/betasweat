module.exports = {
  getToken:function(){
    var token = sessionStorage.getItem('myToken');
    return token
  },
  isLoggedIn:function() {
  var token = sessionStorage.getItem('myToken');

  var payload;

  if(token){
    payload = token.split('.')[1];
    payload = window.atob(payload);
    payload = JSON.parse(payload);

    return true;
  } else {
    return false;
  }
},
getPayLoad: function(){
  var token = sessionStorage.getItem('myToken');
  var payload;

  payload = token.split('.')[1];
  payload = window.atob(payload);
  payload = JSON.parse(payload);
  return payload;
},
logOut: function(){
  sessionStorage.removeItem("myToken");
  return
}
}
