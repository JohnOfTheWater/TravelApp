travel.controller('MainCtrl', function($scope, $ionicPlatform, $timeout, $cordovaLaunchNavigator, $cordovaEmailComposer, $cordovaProgress, $cordovaFlashlight, $cordovaAppAvailability, $cordovaCamera, Categories, Cities, Notes, CityNotes, CordovaCategory, CordovaCity, CordovaNote, Lokidb) {

  //hide categories on page-load
  $('.category-list .item-complex').css('opacity', '0');

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
    // console.log(parameters);
    CordovaNote.all(parameters).then(function(item){
      // console.log(item);
      $scope.notes = item;
    });
  }

  $scope.updateItems();
  $scope.updateCities();

  //dev tools to comment out later on
  $scope.refresh = function(){
    $scope.updateItems();
    $scope.updateCities();
    // var x = 'roffo';
    // Lokidb.addCategory(x);
    //console.log(cordova.file);//Cordova not available in the browser, only on device.
  };
  $scope.getLocation = function(){
    // $cordovaProgress.showSimple(true);
    initMap();
    $timeout(function(){
      $('#map').removeClass('google-maps');
    },500);
  };

  $scope.toggleCtrlPanel = function(){
    $scope.refresh();
    // console.log('stuff');
    var coordinates = ($('.control-panel-wrapper').hasClass('open') ? ['40px','-300px'] : ['-300px','40px']);
    $('.control-panel-wrapper').velocity({translateY:coordinates},
                                         {duration:350});
    if($('.control-panel-wrapper').hasClass('open')){
      $('.control-panel-wrapper').removeClass('open');
    }else{
      $('.control-panel-wrapper').addClass('open');
    }
  }


  $scope.welcome = function(){
    $('#welcome-image').fadeOut();
    $scope.refresh();
    setTimeout(function(){
      $('.category-list .item-complex').velocity('transition.expandIn' ,{drag: true, stagger: 100, duration:400});
    }, 100);
  };
  $('#welcome-image').click(function(){
    //interesting angular code
    // ionic.DomUtil.ready(function(){
    // angular.element(document.querySelector('#bar'))
  });

  // $('#image-test')

  //loki initdb
  $ionicPlatform.ready(function() {
    Lokidb.initDatabase();
  });

  // document.addEventListener("deviceready", onDeviceReady, false);
  // function onDeviceReady() {
  //     console.log(cordova.file);
  // }

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
      var category = $('#category-header').attr('value');
      var parameters = {cityId: cityId, noteCat: category};
      $scope.updateNotes(parameters);
    }
  };

  $scope.showCategory = function(item){
    console.log(item);
    $scope.category = item.categoryname;
    var cityId = $('#earth-icon').attr('value');
    $scope.catId = item.id;
    // $scope.notes = CityNotes(item.$id, cityId);
    var parameters = {cityId: cityId, noteCat: item.categoryname};
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

  $scope.optionsPanel = function(note){
    if($('.options-panel-wrapper').hasClass('opened')){//category-wrapper is open
      $('.options-panel-wrapper').fadeOut(300).removeClass('opened');
      $('.option-button').text('options');
    }else{//cities-wrapper is open
      $('.options-panel-wrapper').fadeIn(300).addClass('opened');
      $('.option-button').text('close');
    }
  }

  $scope.launchNavigator = function(note) {
    if(note.noteAddress != ''){
      var destination = note.noteAddress;
      var start = null;
      // $cordovaAppAvailability.check('comgooglemaps://')
      // .then(function() {
      //   alert('google maps available');
      // }, function () {
      //   alert('google maps not available');
      // });
      $cordovaLaunchNavigator.navigate(destination, start).then(function() {
        console.log("Navigator launched");
      }, function (err) {
        console.error(err);
      });
    }else{
      alert('address field empty');
    }
  }

  $scope.composeEmail = function(note){
    console.log(note);
    var email = {
      to: 'giovanni.delacqua@gmail.com',
      cc: '',
      subject: note.noteTitle+' in '+note.cityId,
      body: '<h3>I want to share this with you!</h3><br><h4 style="margin:0">Title: '+note.noteTitle+'</h4><br><h4 style="margin:0">Phone: '+note.notePhone+'</h4><br><h4 style="margin:0">Address: '+note.noteAddress+'</h4><br><h4 style="margin:0">Email: '+note.noteEmail+'</h4><br><h4 style="margin:0">Site: '+note.noteSite+'</h4><br><h4 style="margin:0">Notes: '+note.noteNotes+'</h4><br>',
      isHtml: true
    };
    $cordovaEmailComposer.open(email).then(null, function () {
    // user cancelled email
    });
  }

  $scope.toogleFlashlight = function(){
    $cordovaFlashlight.toggle()
    .then(function () {
      console.log('success');
    });
  }

  $scope.takePicture = function(){
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true,
      correctOrientation:true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      // var image = document.getElementById('myImage');
      // image.src = "data:image/jpeg;base64," + imageData;
      //put the save imageData to pictures table here
      $('.note-title').text(imageData);
    }, function(err) {
      // error
    });
  }

  $scope.openPicturesPanel = function(){
    var id = $('.note-title').attr('data-id');
    CordovaNote.get(id).then(function(res){
      console.log(res.noteTitle);
      $scope.res = res;
      // CordovaPicture.all(note).then(function(pictures){ //add CordovaPicture in app.js
        // if(pictures){
      if(res){
        $('.pictures-panel-wrapper').velocity('transition.expandIn', {duration:300});
      }else{
        alert('no pictures for '+res.noteTitle+' note.');
      }
      // });
    });
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

// travel.controller("refreshCtrl", function($scope, $firebaseArray, Categories, Notes) {

//   function test(){
//   }

//   $scope.refresh = function(){

//   };


// });

travel.controller("categoryController", ["$scope", "Notes", "Note", "CordovaNote",
  function($scope, Notes, Note, CordovaNote) {

    function closeModal(){
      $('.custom-modal[data-id="newNote"]').velocity('transition.slideUpOut',{duration:300});
    }


    $scope.newNote = function() {
      var category = $('#category-header').attr('value'),
        cityId = $('.cities-wrapper .selected').attr('value'),
        item = {noteTitle: $scope.noteTitle,
                  noteCat: category,
                  cityId: cityId,
                  notePhone: '',
                  noteAddress: '',
                  noteSite: '',
                  noteEmail: '',
                  noteNotes: ''};
      CordovaNote.add(item).then(function(){
        closeModal();
        var parameters = {cityId: cityId, noteCat: category};
        $scope.updateNotes(parameters);
      });
    };

    $scope.openNote = function(note) {
      console.log(note);
      CordovaNote.get(note.id).then(function(note){
        console.log(note.noteTitle);
        $scope.note = note;
        $('#earth-icon, ion-header-bar .button').velocity('fadeOut', {duration:300});
        $('.note-wrapper').velocity('transition.expandIn', {duration:300});
      });
      // var catId = $('#category-header').attr('value');
      // $scope.note = Notes(catId);
      // $scope.note = note;
    };

    $scope.closeNote = function(note) {
      $('#earth-icon, ion-header-bar .button').velocity('fadeIn', {duration:300});
      $('.note-wrapper').velocity('transition.expandOut', {duration:300});
      console.log(note);
    };

    $scope.updateNote = function(note) {
      // var noteRef = Note(note.noteCat, note.$id);
      // console.log(note.noteEmail);
      // console.log(noteRef);
      // noteRef.noteEmail = note.noteEmail;
      // console.log(noteRef);

      // noteRef.$$scopeUpdated(note).then(function(){
        // console.log('note modified!');
      //   $('#modify-note-btn').text('SAVED!');
      //   setTimeout(function(){
      //     $('#modify-note-btn').text('save changes');
      //   }, 1500);
      // });
      // sql from here
      // var newNote = {noteAddress: note.noteAddress,
      //             noteEmail: note.noteEmail,
      //             noteNotes: note.noteNotes,
      //             notePhone: note.notePhone,
      //             noteSite: note.noteSite};
      // console.log(note);
      // console.log(newNote);
      CordovaNote.update(note);
      $('#modify-note-btn').text('SAVED!');
      setTimeout(function(){
        $('#modify-note-btn').text('save changes');
      }, 1500);
    };
  }
]);

travel.controller("picturesPanelController", ["$scope", "Notes", "Note", "CordovaNote",
  function($scope, Notes, Note, CordovaNote) {

    $scope.closePicturesPanel = function() {
      $('.pictures-panel-wrapper').velocity('transition.expandOut', {duration:300});
    };

  }
]);

travel.controller('includeCtrl', function($scope){
   $scope.templates = [
   {
     template: { categories: 'templates/category.html',
                 cities: 'templates/cities.html',
                 note: 'templates/note.html',
                 controlPanel: 'templates/control-panel.html',
                 optionsPanel: 'templates/options-panel.html',
                 picturesPanel: 'templates/pictures-panel.html' }
   }
   ];

   $scope.template = $scope.templates[0].template;
});
