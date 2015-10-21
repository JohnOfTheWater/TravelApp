// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var travel = angular.module('starter', ['ionic','firebase']);

// travel.run(function($ionicPlatform) {
//   $ionicPlatform.ready(function() {
//     // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//     // for form inputs)
//     if(window.cordova && window.cordova.plugins.Keyboard) {
//       cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//     }
//     if(window.StatusBar) {
//       StatusBar.styleDefault();
//     }
//   });
// });

//factory
travel.factory('Items', ['$firebaseArray', function($firebaseArray){
  var itemsRef = new Firebase('https://radiant-torch-278.firebaseio.com');
  return $firebaseArray(itemsRef);
}]);

//controller
travel.controller('ListCtrl', function($scope, Items) {

  $scope.items = Items;

  Items.$loaded(function(){
    // console.log('categories loaded from database!');
  });

  $scope.addItem = function(){
    var name = prompt('Please insert a new Category');
    var city = $('#earth-icon').attr('value');
    if(name){
      $scope.items.$add({
        'name': name,
        'city': city
      });
    }
  };

  $scope.deleteItem = function(item){
    console.log(item.$id);
    $scope.items
      .$remove(item)
      .then(function(){
        alert('category deleted!')
      });
  };

});
