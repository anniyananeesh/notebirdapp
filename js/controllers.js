var serverURL = 'http://192.168.56.1:3000';

angular.module('starter.controllers', [])

.controller('AppCtrl',['$scope', '$state', 'Auth', 'Data', '$ionicLoading', 'PushNotificationsService', function($scope, $state, Auth, Data, $ionicLoading, PushNotificationsService) {
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
          limit: result.limit,
          tag: result.tagName,
          code: result.code,
          image: result.image
        });

        //Register on push service
        PushNotificationsService.register(result.tagName);

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
  $scope.user = rtUsr;

  Data.get('followers_count?ref='+rtUsr.ref).then(function(result){
     $scope.followers_count = result.data;
  });

  Data.get('notifications_count?ref='+rtUsr.ref).then(function(result){
     $scope.notifications_count = result.data;
  });

  Data.get('user?ref='+rtUsr.ref).then(function(result){
      if(!result.error)
      {
        $scope.accountTitle = result.name;
        $scope.accountStatus = (result.pro == 1) ? 'PRO' : 'TRIAL';
      }
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
.controller('NotificationsCtrl',['$scope', '$state', '$ionicLoading', 'Auth', 'Data','$cordovaToast', function($scope,$state,$ionicLoading,Auth,Data,$cordovaToast) {
 
  var rtUsr = Auth.getUser();
  $scope.notifications = [];
  
  Data.get('notifications?ref='+rtUsr.ref).then(function(result){
     $scope.notifications = result.data;
  });

  $scope.resendNotification = function(noteId)
  {

    $cordovaToast.showShortBottom('Resending notification ...').then(function(success) {
      // success
    }, function (error) {
      // error
    });

    alert(noteId);

    //Get notification details by id
    Data.get('notification_by_pk?pk='+noteId).then(function(result){
      if(!result.error)
      {
        
        //Post the send notification command
        var paramsQry = {
          title: result.data.title,
          message: result.data.message,
          ref: rtUsr.ref
        }

        Data.post('send_notification',paramsQry).then(function(result){

          if(!result.error)
          {
            $cordovaToast.showLongBottom('Notification has been send').then(function(success) {
              // success
            }, function (error) {
              // error
            });

            $scope.notify = {
              title: '',
              message: ''
            }

            $state.go('app.dashboard');

          }else{
            $cordovaToast.showLongBottom('Sorry! unknown error '+result.message).then(function(success) {
              // success
            }, function (error) {
              // error
            });
          }
   
        });

      }else{

        //Show toast message

        $cordovaToast.showLongBottom('Sorry! unknown error :(').then(function(success) {
          // success
        }, function (error) {
          // error
        });
      }

    });
 
  }

}])

.controller('NoteDetailCtrl',['$scope', '$state', '$ionicLoading', function($scope,$state,$ionicLoading) {
  
  $scope.notify = {
    name: 'Sample title',
    content: 'Sample message'
  }

}])

.controller('SettingsCtrl',['$scope', '$state', '$ionicLoading','Auth','Data', function($scope,$state,$ionicLoading,Auth,Data){

  $scope.picData = '';
  $scope.accountTitle = 'first';

  //Get the user authenticated
  var rtUsr = Auth.getUser(),
      userid = rtUsr.ref;

  $scope.user = rtUsr;
 

  var rtUsr = Auth.getUser();
  
  Data.get('user?ref='+rtUsr.ref).then(function(result){
      if(!result.error)
      {
        $scope.accountTitle = result.name;
        $scope.picData = result.image;
      }
  });
 
  //Update account title
  $scope.updateAccount = function()
  {
     var params = {
        title : $scope.accountTitle,
        ref : rtUsr.ref
     };

     //Send a query to update the accoutn title of the user
     Data.post('user',params).then(function(result){
        if(!result.error)
        {
          $ionicLoading.show({template:'Updated account title', duration: 1500});
        }else{
          $ionicLoading.show({template: result.message, duration: 1500});
        }
     });
  };


  //Password change settings
  $scope.settings = {
    current_pass: '',
    newpwd: '',
    cpwd: ''
  }

  $scope.updatePassword = function()
  {
      var params = {
         cpass: $scope.settings.current_pass,
         pwd: $scope.settings.newpwd,
         cpwd: $scope.settings.cpwd,
         ref: rtUsr.ref
      }

      Data.post('change_password', params).then(function(result){

        if(result.error && result.message == "invalid_current_pass")
        {
          $ionicLoading.show({template: 'Current password is invalid', duration: 1500});
        }

        if(result.error && result.message == "passwords_not_matching")
        {
          $ionicLoading.show({template: 'Your passwords not matching', duration: 1500});
        }

        if(!result.error && result.message == "success")
        {
          $ionicLoading.show({template:'Successfully updated password',duration: 1500});
        }

        if(result.error && result.message == "error_unknown")
        {
          $ionicLoading.show({template: 'Unknown error occurred', duration: 1500});
        }

      });
  };

}]);