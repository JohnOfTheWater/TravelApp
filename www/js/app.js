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
travel.factory('Items', ['$firebaseArray', function($firebaseArray){
  var itemsRef = new Firebase('https://radiant-torch-278.firebaseio.com');
  return $firebaseArray(itemsRef);
}]);

//controller
travel.controller('MainCtrl', function($scope, Items) {

  $scope.items = Items;

  Items.$loaded(function(){
    // console.log('categories loaded from database!');
  });

  // $scope.addCategory = function(){
  //   var name = prompt('Please insert a new Category');
  //   var city = $('#earth-icon').attr('value');
  //   if(name){
  //     $scope.items.$add({
  //       'name': name
  //     });
  //   }
  // };
  
  $scope.showCatModal = function(){
    $('.custom-modal').velocity('transition.slideDownIn',{duration:200});
  };

  $scope.deleteItem = function(item){
    // console.log(item.$id);
    $scope.items
      .$remove(item)
      .then(function(){
        alert('category deleted!')
      });
  };
  $scope.showCategory = function(item){
      console.log(item);
  };

});

travel.controller('addController', function($scope, $firebaseArray, $state, Items){

  function closeModal(){
    $('.custom-modal').velocity('transition.slideUpOut',{duration:200});
  }

  $scope.closeModal = function(){
    closeModal();
  };

  $scope.submitCategory = function(){
    $scope.newCat = Items;
    $scope.newCat.$add({
      catName: $scope.catName
    }).then(function(){//when it's done
      closeModal();
    });
  };


});

travel.controller("categoryController", function($scope, $stateParams) {
 
    // console.log('finally!');

 
});


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
