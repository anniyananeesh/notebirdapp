var serverURL = 'http://192.168.56.1:3000';

angular.module('starter.controllers', [])

.controller('AppCtrl',['$scope', '$state', 'Auth', 'Data', '$ionicLoading', function($scope, $state, Auth, Data, $ionicLoading) {
  // Form data for the login modal
  $scope.loginData = {};  

  $scope.logout = function() {
    Auth.logout();
    $state.go("login");
  };


   // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
 
    $ionicLoading.show({template: 'Authenticating'});
    var paramsQry = {
      u: $scope.loginData.username,
      pwd: $scope.loginData.password
    }

    Data.post('auth', paramsQry).then(function (result) {
      $ionicLoading.hide();
      if(!result.error)
      {
        Auth.setUser({
          username: $scope.loginData.username,
          ref: result._tkn,
          pro: result.pro,
          limit: result.limit
        });

        $state.go("app.dashboard");
      }else{
        $ionicLoading.show({template:result.message, duration: 1000});
      }
      
    }); 
    
  };

}])

.controller('DashboardCtrl',['$scope', '$state', 'Auth','Data', function($scope,$state,Auth,Data) {
 
  var rtUsr = Auth.getUser();
  $scope.followers_count = 0;
  $scope.notifications_count = 0;

  Data.get('followers_count?ref='+rtUsr.ref).then(function(result){
     $scope.followers_count = result.data;
  });

  Data.get('notifications_count?ref='+rtUsr.ref).then(function(result){
     $scope.notifications_count = result.data;
  });

  $scope.goToSendNotification = function()
  { 
    $state.go("app.send");
  }

}])

//Controller for notification send
.controller('SendCtrl',['$scope', '$state', '$ionicLoading','Auth','Data', function($scope,$state,$ionicLoading,Auth,Data) {
  
  var rtUsr = Auth.getUser();
  $scope.notify = {
    title: '',
    message: ''
  }
  
  $scope.sendNotification = function()
  {
      var paramsQry = {
        title: $scope.notify.title,
        message: $scope.notify.message,
        ref: rtUsr.ref
      }

      Data.post('send_notification',paramsQry).then(function(result){
        if(!result.error)
        {
          $ionicLoading.show({template:'Your notification has been send', duration: 1500});
          
          $scope.notify = {
            title: '',
            message: ''
          }

          $state.go('app.dashboard');
        }else{
          $ionicLoading.show({template:result.message, duration: 1500});
        }
 
      });
  };

}])

//Controller for showing followers list
.controller('FollowersCtrl',['$scope', '$state', '$ionicLoading', 'Auth', 'Data', function($scope,$state,$ionicLoading, Auth, Data) {

  var rtUsr = Auth.getUser();
  $scope.followers = [];
  
  Data.get('followers?ref='+rtUsr.ref).then(function(result){
     $scope.followers = result.data;
  });

}])

//Controller for showing notifications list
.controller('NotificationsCtrl',['$scope', '$state', '$ionicLoading', 'Auth', 'Data', function($scope,$state,$ionicLoading,Auth,Data) {
 
  var rtUsr = Auth.getUser();
  $scope.notifications = [];
  
  Data.get('notifications?ref='+rtUsr.ref).then(function(result){
     $scope.notifications = result.data;
  });

}])

.controller('NoteDetailCtrl',['$scope', '$state', '$ionicLoading', function($scope,$state,$ionicLoading) {
  $scope.notify = {
    name: 'Sample title',
    content: 'Sample message'
  }

}])

.controller('SettingsCtrl',['$scope', '$state', '$ionicLoading','Auth','Data', function($scope,$state,$ionicLoading,Auth,Data){

  $scope.profileImage = '';

  //Get the user authenticated
  var rtUsr = Auth.getUser(),
      userid = rtUsr.ref;

  $scope.takeSnap = function (e) {
    
    var options = {
      quality: 100,
      targetWidth: 640,
      targetHeight: 640,
      destinationType: Camera.DestinationType.FILE_URI,
      encodingType: Camera.EncodingType.JPEG,
      sourceType: Camera.PictureSourceType.CAMERA
    };

    navigator.camera.getPicture(
      function (imageURI) {
        
        //Upload the iamge to web server
        upload(imageURI,userid);

      }, resOnError, options);

    return false;

  };

  var rtUsr = Auth.getUser();
  
  Data.get('user?ref='+rtUsr.ref).then(function(result){
    console.log(result);
  });

}]);

// Upload image to server
function upload(imageURI,userid) {

    var ft = new FileTransfer(),
        options = new FileUploadOptions();

    options.fileKey = "file";
    options.fileName = 'filename.jpg'; // We will use the name auto-generated by Node at the server side.
    options.mimeType = "image/jpeg";
    options.chunkedMode = false;
    options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
      "description": "Uploaded from my phone",
      "ref" : userid
    };

    ft.upload(imageURI, serverURL + "/image",
        function (e) {
          
          alert(IsJsonString(e));

          for(var propertyName in e) {
            alert(response);
          }

          alert(e);
          alert(JSON.stringify(e));
          alert(e.response.error+'res');
          alert(e.error+'w/o res');

          if(!e.response.error)
          {
            alert('True block');
            alert(JSON.stringify(e.response));

            alert(e.response.image+' res');
            alert(e.image+' w/o res');

            //OnSuccess Move file to local storage
            movePic(imageURI,e.image);

          }else{
            alert('Error block');
            alert(JSON.stringify(e.response));
            //On failed show the error message
            alert(e.message);
          }
          
        }, resOnError, options);

};


function movePic(file,imageName){ 

    var myFolderApp = "NoteBird/Profile";

    window.resolveLocalFileSystemURI(file, function(entry){

      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys){      

        //The folder is created if doesn't exist
        fileSys.root.getDirectory( myFolderApp,
          {create:true, exclusive: false},
          function(directory) {
                entry.moveTo(directory, imageName,  successMove, resOnError);
          }, resOnError);

      }, resOnError);

    }, resOnError); 
}  

//Callback function when the file has been moved successfully - inserting the complete path
function successMove(entry) {
    //I do my insert with "entry.fullPath" as for the path
    $scope.profileImage = entry.fullPath;
}

function resOnError(error) {
    alert(error.code);
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}