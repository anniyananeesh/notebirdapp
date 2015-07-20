angular.module('starter.services', ['ngCookies'])
// Factory for node-pushserver (running locally in this case), if you are using other push notifications server you need to change this
.factory('NodePushServer', function ($http){
  // Configure push notifications server address
  // 		- If you are running a local push notifications server you can test this by setting the local IP (on mac run: ipconfig getifaddr en1)
  var push_server_address = "http://192.168.56.1:3000";

  return {
    // Stores the device token in a db using node-pushserver
    // type:  Platform type (ios, android etc)
    storeDeviceToken: function(userId, type, regId) {

      // Create a random userid to store with it
      var user = { 
        user: userId,
        type: type,
        token: regId
      };

      console.log("Post token for registered device with data " + JSON.stringify(user));

      $http.post(push_server_address+'/device', JSON.stringify(user))
      .success(function (data, status) {
        console.log("Token stored, device is successfully subscribed to receive push notifications.");
      })
      .error(function (data, status) {
        console.log("Error storing device token." + data + " " + status);
      });

    }

  };

})