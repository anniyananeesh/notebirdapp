angular.module('starter.services', ['ngCookies'])
.factory('Auth', function ($cookieStore) {
   var _user = $cookieStore.get('starter.user');
   var setUser = function (user) {
      _user = user;
      $cookieStore.put('starter.user', _user);
   }

   return {
      setUser: setUser,
      isLoggedIn: function () {
         return _user ? true : false;
      },
      getUser: function () {
         return _user;
      },
      logout: function () {
         $cookieStore.remove('starter.user');
         _user = null;
      }
   }
})

.factory("Data", ['$http',
    function ($http) {
        var serviceBase = 'http://192.168.56.1:3000/'; //45.33.67.32 production
        
        var obj = {};
        obj.get = function (q) {
            return $http.get(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        obj.post = function (q, object) {
            return $http.post(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        return obj;
}])

.service('Cache', ['CacheFactory', function (CacheFactory) {

  var AppCache;

  // Check to make sure the cache doesn't already exist
  if (!CacheFactory.get('AppCache')) {
    AppCache = CacheFactory('AppCache');
  }
  
  var obj = {};
  
  obj.get = function( key){
      return AppCache.get( key);
  };
  
  obj.set = function( key, data){
      return AppCache.put( key, data);      
  };
  
  obj.remove = function( key){
     return AppCache.remove( key); 
  };
  
  obj.removeAll = function(){
      return AppCache.destroy();
  }
  
  return obj;
 
}])

// PUSH NOTIFICATIONS
.service('PushNotificationsService', function (GCM_SENDER_ID, PUSHBOTS_APP_ID){
    
    this.register = function(tagName){

        if(PushbotsPlugin.isiOS()){
          PushbotsPlugin.initializeiOS(PUSHBOTS_APP_ID);
        }
        if(PushbotsPlugin.isAndroid()){
          PushbotsPlugin.initializeAndroid(PUSHBOTS_APP_ID, GCM_SENDER_ID);
        }

        PushbotsPlugin.getToken(function(token){
          console.log(token);
        });

        //Set the tag name for the subscriber
        PushbotsPlugin.tag(tagName);

    };

});