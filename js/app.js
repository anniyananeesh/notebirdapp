// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var serverURL = "http://localhost:3000";

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','starter.config','ngCordova','ngStorage'])

.run(function($ionicPlatform) {
  
  $ionicPlatform.on("deviceready", function(){
    
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
 
  });

  $ionicPlatform.on("resume", function(){
    
  });

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    
    $ionicConfigProvider.tabs.position('bottom');

  $stateProvider

  //TODO Splash Page
  //Login Page
  .state('login', {
    url: "/",
    templateUrl: "templates/login.html",
    controller: 'AppCtrl'
  })
 
  
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl',
    onEnter: function($state, Auth){
        if(!Auth.isLoggedIn()){
           $state.go('login');
        }
    }
  })

  //Dashboard
  .state('app.dashboard', {
      url: "/dashboard",
      views: {
        'menuContent': {
          templateUrl: "templates/dashboard.html",
          controller: 'DashboardCtrl'
        }
      }
  })

  //Send Notification
  .state('app.send', {
    url: "/send",
    views: {
      'menuContent': {
        templateUrl: "templates/send.html",
        controller: 'SendCtrl'
      }
    }
  })

  //Notifications
  .state('app.notifications', {
    url: "/notifications",
    views: {
      'menuContent': {
        templateUrl: "templates/notifications.html",
        controller: 'NotificationsCtrl'
      }
    }
  })

  //Notification detail
  .state('app.single', {
    url: "/notifications/:noteId",
    views: {
      'menuContent': {
        templateUrl: "templates/notification-detail.html",
        controller: 'NoteDetailCtrl'
      }
    }
  })

  //TODO Settings Page
  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "templates/settings.html",
        controller: 'SettingsCtrl'
      }
    }
  })

  //Followers List (optional)
  .state('app.followers', {
    url: "/followers",
    views: {
      'menuContent': {
        templateUrl: "templates/followers.html",
        controller: 'FollowersCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
});