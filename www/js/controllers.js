travel.controller('MainCtrl', function($scope, Categories, Cities, Notes, CityNotes, CordovaCategory, CordovaCity, CordovaNote) {

  $scope.items = [];
  // console.log('here');
  // $scope.cities = Cities;
  $scope.cities = [];
  $scope.notes = [];
  // $scope.newcat = NewCategories;
  // console.log($scope.newcat);

  $scope.updateItems = function() {
    CordovaCategory.all().then(function(item){
      $scope.items = item;
    });
  }

  $scope.updateCities = function() {
    CordovaCity.all().then(function(item){
      $scope.cities = item;
      //check what city is selected and update topbar
      for (var i = 0; i < item.length; i++) {
        if(item[i].selected === 'yes'){
          $('#earth-icon').attr('value', item[i].cityname);//dinamic
          $('ion-header-bar .title').text(item[i].cityname);//dinamic
        }
      }
    });
  }

  $scope.updateNotes = function(parameters) {
    console.log(parameters);
    CordovaNote.all(parameters).then(function(item){
      // console.log(item);
      $scope.notes = item;
    });
  }

  $scope.updateItems();
  $scope.updateCities();

  Categories.$loaded(function(){
    console.log('categories loaded from database!');
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

  $scope.deleteItem = function(item, itemtype){
    switch(itemtype) {
      case "category":
          var factory = CordovaCategory;
          break;
      case "city":
          var factory = CordovaCity;
          break;
      case "note":
          var factory = CordovaNote;
          break;
    }
    console.log(item);
    factory.remove(item);
    $scope.updateItems();
    $scope.updateCities();
    if(itemtype === 'note'){
      var cityId = $('#earth-icon').attr('value');
      var catId = $('#category-header').attr('value');
      var parameters = {cityId: cityId, noteCat: catId};
      $scope.updateNotes(parameters);
    }
  };

  $scope.showCategory = function(item){
    // console.log(item);
    $scope.category = item.categoryname;
    var cityId = $('#earth-icon').attr('value');
    $scope.catId = item.id;
    // $scope.notes = CityNotes(item.$id, cityId);
    var parameters = {cityId: cityId, noteCat: item.id};
    console.log(parameters);
    $scope.updateNotes(parameters);
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
    // console.log(city);
    // angular.forEach(Cities, function(value, key) {
    //   console.log(key, value);
    // });
    var that = city;
    CordovaCity.all().then(function(item){
      for (var i = 0; i < item.length; i++) {
        var selected = (item[i].cityname != that.cityname ? "no" : "yes");
        var city = {selected: selected, id: item[i].id};
        CordovaCity.update(city);
      }
    });
  }

  $scope.selectCity = function(city){
    $('.cities-wrapper .city-item').removeClass('selected');
    $('.cities-wrapper .city-item[value="'+city.cityname+'"]').addClass('selected');
    //change the header text to show the selected city...
    $('#earth-icon').attr('value', city.cityname);
    $('ion-header-bar .title').text(city.cityname);
    //...then persist the changes to the database...
    saveSelectedCity(city);
    //...and go back to category page
    $scope.hideTab();
  };

});


travel.controller('addController', function($scope, $firebaseArray, $state, Categories, Cities, CordovaCategory, CordovaCity){
  function closeModal(id){
    $('.custom-modal[data-id="'+id+'"]').velocity('transition.slideUpOut',{duration:300});
  }

  $scope.submitCity = function(){
    console.log($scope.cityName);
    var item = {cityname: $scope.cityName,
                selected: "no"};
    CordovaCity.add(item).then(function(){
      var id = "newCity";
      closeModal(id);
      $scope.updateCities();
    });
  };

  $scope.submitCategory = function(){
    var item = {categoryname: $scope.catName};
    CordovaCategory.add(item).then(function(){
      var id = "newCat";
      closeModal(id);
      $scope.updateItems();
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

travel.controller("categoryController", ["$scope", "Notes", "Note", "CordovaNote",
  function($scope, Notes, Note, CordovaNote) {

    function closeModal(){
      $('.custom-modal[data-id="newNote"]').velocity('transition.slideUpOut',{duration:300});
    }


    $scope.newNote = function() {
      var catId = $('#category-header').attr('value'),
      cityId = $('.cities-wrapper .selected').attr('value');
      var item = {noteTitle: $scope.noteTitle,
                  noteCat: catId,
                  cityId: cityId,
                  notePhone: '',
                  noteAddress: '',
                  noteSite: '',
                  noteEmail: '',
                  noteNotes: ''};
      CordovaNote.add(item).then(function(){
        closeModal();
        var parameters = {cityId: cityId, noteCat: catId};
        $scope.updateNotes(parameters);
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
