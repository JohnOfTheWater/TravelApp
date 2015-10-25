travel.controller('MainCtrl', function($scope, Cities, Categories, Notes) {

  // $scope.items = Categories;
  $scope.cities = Cities;
  console.log($scope.cities);

  Cities.$loaded(function(){
    $scope.items = Categories("-K1UmnFI9u6XP2keG000");
    // console.log('categories loaded from database!');
  });

  $scope.addStuff = function(){
    if($('.category-wrapper').hasClass('opened')){
      var form = $('.custom-modal[data-id="newNote"]');
    }else{//show new category modal in home page
      var form = $('.custom-modal[data-id="newCat"]');
    }
    form.velocity('transition.slideDownIn',{duration:300});
  };

  $scope.closeModal = function(){
    if($('.category-wrapper').hasClass('opened')){
      var form = $('.custom-modal[data-id="newNote"]');
    }else{//show new category modal in home page
      var form = $('.custom-modal[data-id="newCat"]');
    }
    form.velocity('transition.slideUpOut',{duration:300});
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
      $scope.catId = item.$id;
      $scope.notes = Notes(item.$id);
      // alert('clicked');
      $('.category-wrapper')
        .velocity('transition.slideRightIn',{duration:300})
        .addClass('opened');
  };
  $scope.hideCategory = function(item){
      $('.category-wrapper')
        .velocity('transition.slideRightOut',{duration:300})
        .removeClass('opened');
  };

});


travel.controller('addController', function($scope, $firebaseArray, $state, Cities, Categories){
  function closeModal(id){
    $('.custom-modal[data-id="'+id+'"]').velocity('transition.slideUpOut',{duration:300});
  }

  $scope.submitCategory = function(){
    $scope.newCat = Categories;
    $scope.newCat.$add({
      catName: $scope.catName
    }).then(function(){//when it's done
    var id = 'newCat';
      closeModal(id);
    });
  };

  $scope.submitCity = function(){
    $scope.newCity = Cities;
    $scope.newCity.$add({
      cityName: $scope.cityName
    }).then(function(){//when it's done
    var id = 'newCity';
      closeModal(id);
    });
  };


});

// travel.controller("categoryController", function($scope, $stateParams, $state, $firebaseArray, Categories, Notes) {

//   function closeModal(){
//     $('.custom-modal[data-id="newNote"]').velocity('transition.slideUpOut',{duration:300});
//   }

//   $scope.newNote = function(){
//     console.log('miao');
//     var catId = $('#category-header').attr('value');
//     $scope.newNote = Notes(catId);
//     $scope.newNote.$add({
//       noteTitle: $scope.noteName,
//       noteCat: catId
//     }).then(function(){//when it's done
//       closeModal();
//     });
//   };


// });

travel.controller("categoryController", ["$scope", "Notes", "Cities", "Categories",
  function($scope, Notes, Cities, Categories) {

    function closeModal(id){
      $('.custom-modal[data-id="'+id+'"]').velocity('transition.slideUpOut',{duration:300});
    }

    $scope.newCategory = function() {
      var cityId = $('#earth-icon').attr('value');//Nashville
      $scope.cat = Categories(cityId);
      $scope.cat.$add({
        catName: $scope.catName,
        catCity: cityId
      }).then(function() {//when it's done
        // alert('Profile saved!');
        var id = 'newCat';
        closeModal(id);
      }).catch(function(error) {
        console.log(error);
        alert('Error!');
      });
    };
    

    $scope.newNote = function() {
      var catId = $('#category-header').attr('value');
      console.log(catId);
      $scope.note = Notes(catId);
      $scope.note.$add({
        noteTitle: $scope.noteTitle,
        noteCat: catId
      }).then(function() {//when it's done
        // alert('Profile saved!');
        var id = 'newNote';
        closeModal(id);
      }).catch(function(error) {
        console.log(error);
        alert('Error!');
      });
    };
  }
]);

travel.controller('includeCtrl', function($scope){
   $scope.templates = [
   {
     template: { url: 'templates/category.html' }
   }
   ];

   $scope.template = $scope.templates[0].template;
});
