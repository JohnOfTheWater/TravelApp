travel.controller('MainCtrl', function($scope, Items) {

  $scope.items = Items;

  Items.$loaded(function(){
    // console.log('categories loaded from database!');
  });

  $scope.showCatModal = function(){
    $('.custom-modal').velocity('transition.slideDownIn',{duration:300});
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
      $scope.category = item.catName;
      $('.category-wrapper').velocity('transition.slideRightIn',{duration:300});
  };
  $scope.hideCategory = function(item){
      $('.category-wrapper').velocity('transition.slideRightOut',{duration:300});
  };

});

travel.controller('addController', function($scope, $firebaseArray, $state, Items){

  function closeModal(){
    $('.custom-modal').velocity('transition.slideUpOut',{duration:300});
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
