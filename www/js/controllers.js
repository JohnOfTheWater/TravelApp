travel.controller('MainCtrl', function($scope, Categories, Cities, Notes) {

  $scope.items = Categories;
  $scope.cities = Cities;
  console.log($scope.items);

  Categories.$loaded(function(){
    // console.log('categories loaded from database!');
  });

  $scope.addStuff = function(){
    if($('.category-wrapper').hasClass('opened')){//show new category modal
      var form = $('.custom-modal[data-id="newNote"]');
    }else if($('.cities-wrapper').hasClass('opened')){//show new city modal
      var form = $('.custom-modal[data-id="newCity"]');
    }else{//show new category modal in home page
      var form = $('.custom-modal[data-id="newCat"]');
    }
    form.velocity('transition.slideDownIn',{duration:300});
  };

  $scope.closeModal = function(){
    if($('.category-wrapper').hasClass('opened')){//hide new category modal
      var form = $('.custom-modal[data-id="newNote"]');
    }else if($('.cities-wrapper').hasClass('opened')){//hide new city modal
      var form = $('.custom-modal[data-id="newCity"]');
    }else{//hide new category modal in home page
      var form = $('.custom-modal[data-id="newCat"]');
    }
    form.velocity('transition.slideUpOut',{duration:300});
  };

  $scope.deleteItem = function(item){
    // console.log(item.$id);
    if($('.category-wrapper').hasClass('opened')){
      // var catId = $('#category-header').attr('value');
      // $scope.notes = Notes(catId);//don't need it cause scope is defined already at this point
      var pool = $scope.notes;
    }else if($('.cities-wrapper').hasClass('opened')){
      var pool = $scope.cities;
    }else{
      var pool = $scope.items;
    }
    pool.$remove(item)
        .then(function(){
           console.log('item deleted!');
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
  $scope.hideTab = function(){
    if($('.category-wrapper').hasClass('opened')){//category-wrapper is open
      var tab = $('.category-wrapper'),
          direction = 'transition.slideRightOut';
    }else{//cities-wrapper is open
      var tab = $('.cities-wrapper'),
          direction = 'transition.slideLeftOut';
    }
    tab.velocity(direction, {duration:300})
       .removeClass('opened');
  };
  $scope.showCities = function(){
      $('.cities-wrapper')
        .velocity('transition.slideLeftIn',{duration:300})
        .addClass('opened');
  };

});


travel.controller('addController', function($scope, $firebaseArray, $state, Categories, Cities){
  function closeModal(id){
    $('.custom-modal[data-id="'+id+'"]').velocity('transition.slideUpOut',{duration:300});
  }

  $scope.submitCity = function(){
    Cities.$add({
      cityName: $scope.cityName
    }).then(function(){//when it's done
      var id = "newCity";
      closeModal(id);
    });
  };

  $scope.submitCategory = function(){
    $scope.newCat = Categories;
    $scope.newCat.$add({
      catName: $scope.catName
    }).then(function(){//when it's done
      var id = "newCat";
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

travel.controller("categoryController", ["$scope", "Notes",
  function($scope, Notes) {

    function closeModal(){
      $('.custom-modal[data-id="newNote"]').velocity('transition.slideUpOut',{duration:300});
    }


    $scope.newNote = function() {
      var catId = $('#category-header').attr('value');
      console.log(catId);
      $scope.note = Notes(catId);
      $scope.note.$add({
        noteTitle: $scope.noteTitle,
        noteCat: catId,
        cityId: 'Nashville'
      }).then(function() {//when it's done
        // alert('Profile saved!');
        closeModal();
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
     template: { url: 'templates/category.html',
                 cities: 'templates/cities.html' }
   }
   ];

   $scope.template = $scope.templates[0].template;
});
