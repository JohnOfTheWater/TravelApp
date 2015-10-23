// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var travel = angular.module('travel', ['ionic','firebase']);

travel.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // console.log('ready');
  });
});

//factory
travel.factory('Categories', ['$firebaseArray', function($firebaseArray){
  var itemsRef = new Firebase('https://radiant-torch-278.firebaseio.com');
  // console.log(itemsRef);
  return $firebaseArray(itemsRef);
}]);

travel.factory('Notes', ['$firebaseArray', function($firebaseArray){
  return function(catId){
    var itemsRef = new Firebase('https://radiant-torch-278.firebaseio.com');
    // var category = $('#category-header').attr('value');
    var notesRef = itemsRef.child(catId);
    // console.log(itemsRef);
    return $firebaseArray(notesRef);
  }
}]);

// travel.factory('Notes', ['$firebaseArray', function($firebaseArray){
//   var notesRef = new Firebase('https://radiant-torch-278.firebaseio.com');
//   return $firebaseArray(itemsRef);
// }]);


//routing
travel.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')

  // $stateProvider
  //   .state('test', {
  //     url: '/test',
  //     templateUrl: 'templates/test.html',
  //     controller: 'testController'
  //   });

});
