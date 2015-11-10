travel.controller('MainCtrl', function($scope, Categories, Cities, Notes, CityNotes) {

  $scope.items = Categories;
  $scope.cities = Cities;
  // $scope.newcat = NewCategories;
  // console.log($scope.newcat);

  Categories.$loaded(function(){
    console.log('categories loaded from database!');
  });
  Cities.$loaded(function(){
    console.log('cities loaded from database!');
    // console.log(Cities.orderByChild("selected").equalTo('yes'));
    for (var i = 0; i < Cities.length; i++) {
      if(Cities[i].selected === 'yes'){
        $('#earth-icon').attr('value', Cities[i].cityName);//dinamic
        $('ion-header-bar .title').text(Cities[i].cityName);//dinamic
      }
    }
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
    // console.log(item);
    $scope.category = item.catName;
    var cityId = $('#earth-icon').attr('value');
    $scope.catId = item.$id;
    $scope.notes = CityNotes(item.$id, cityId);
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

  function saveSelectedCity(city){
    console.log(city);
    // angular.forEach(Cities, function(value, key) {
    //   console.log(key, value);
    // });
    for (var i = 0; i < Cities.length; i++) {
      var selected = (Cities[i].cityName != city.cityName ? "no" : "yes");
      Cities[i].selected = selected;
      Cities.$save(i).then(function(){
        console.log('city modified');
      })
    }
  }

  $scope.selectCity = function(city){
    $('.cities-wrapper .city-item').removeClass('selected');
    $('.cities-wrapper .city-item[value="'+city.cityName+'"]').addClass('selected');
    //change the header text to show the selected city...
    $('#earth-icon').attr('value', city.cityName);
    $('ion-header-bar .title').text(city.cityName);
    //...then persist the changes to the database
    saveSelectedCity(city);
  };

});


travel.controller('addController', function($scope, $firebaseArray, $state, Categories, Cities){
  function closeModal(id){
    $('.custom-modal[data-id="'+id+'"]').velocity('transition.slideUpOut',{duration:300});
  }

  $scope.submitCity = function(){
    Cities.$add({
      cityName: $scope.cityName,
      selected: 'no'
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

travel.controller("categoryController", ["$scope", "Notes", "Note",
  function($scope, Notes, Note) {

    function closeModal(){
      $('.custom-modal[data-id="newNote"]').velocity('transition.slideUpOut',{duration:300});
    }


    $scope.newNote = function() {
      var catId = $('#category-header').attr('value'),
          cityId = $('.cities-wrapper .selected').attr('value');
      console.log(catId);
      $scope.note = Notes(catId);
      $scope.note.$add({
        noteTitle: $scope.noteTitle,
        noteCat: catId,
        cityId: cityId,
        notePhone: '',
        noteSite: '',
        noteEmail: '',
        noteNotes: ''
      }).then(function() {//when it's done
        // alert('Profile saved!');
        closeModal();
      }).catch(function(error) {
        console.log(error);
        alert('Error!');
      });
    };
    $scope.openNote = function(note) {
      console.log(note);
      var catId = $('#category-header').attr('value');
      $scope.note = Notes(catId);
      $scope.note = note;
      $('#earth-icon, ion-header-bar .button').velocity('fadeOut', {duration:300});
      $('.note-wrapper').velocity('transition.expandIn', {duration:300});
    };
    $scope.closeNote = function(note) {
      $('#earth-icon, ion-header-bar .button').velocity('fadeIn', {duration:300});
      $('.note-wrapper').velocity('transition.expandOut', {duration:300});
      console.log(note);
    };
    $scope.updateNote = function(note) {
      var noteRef = Note(note.noteCat, note.$id);
      // console.log(note.noteEmail);
      // console.log(noteRef);
      // noteRef.noteEmail = note.noteEmail;
      // console.log(noteRef);
      noteRef.$$scopeUpdated(note).then(function(){
        // console.log('note modified!');
        $('#modify-note-btn').text('SAVED!');
        setTimeout(function(){
          $('#modify-note-btn').text('save changes');
        }, 1500);
      });
    };
  }
]);

travel.controller('includeCtrl', function($scope){
   $scope.templates = [
   {
     template: { categories: 'templates/category.html',
                 cities: 'templates/cities.html',
                 note: 'templates/note.html' }
   }
   ];

   $scope.template = $scope.templates[0].template;
});
