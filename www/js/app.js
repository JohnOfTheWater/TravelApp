// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var db = null;

var travel = angular.module('travel', ['ionic','firebase', 'ngCordova']);

travel.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // console.log('ready');
    // db = $cordovaSQLite.openDB({ name: "my.db"});
    // db = window.openDatabase("test", "1.0", "Test DB", 1000000);
    // db = window.openDatabase("test1", "1.0", "Test1 DB", 1000000);
    // $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS categories (id integer primary key, categoryname text)");
    // $cordovaSQLite.execute(db, "INSERT INTO categories (categoryname) VALUES ('Hotels'), ('Restaurants'), ('Business Cards'), ('Transportation'), ('Entertainment')");
  });
});

//factory
travel.factory('Cities', ['$firebaseArray', function($firebaseArray){
  var citiesRef = new Firebase('https://radiant-torch-278.firebaseio.com/cities');
  // console.log(itemsRef);
  return $firebaseArray(citiesRef);
}]);

travel.factory('Categories', ['$firebaseArray', function($firebaseArray){
  var itemsRef = new Firebase('https://radiant-torch-278.firebaseio.com/categories');
  // console.log(itemsRef);
  return $firebaseArray(itemsRef);
}]);

//$cordovaSQLite
travel.factory('NewCategories', function($cordovaSQLite){
  db = window.openDatabase("test7", "1.0", "Test7 DB", 1000000);
  $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS categories (id integer primary key, categoryname text)");
  // $cordovaSQLite.execute(db, "INSERT INTO categories (categoryname) VALUES ('Hotels'), ('Restaurants'), ('Business Cards'), ('Transportation'), ('Entertainment')");
  var query = "SELECT * FROM categories";
  console.log('query: '+query);
  $cordovaSQLite.execute(db, query).then(function(res){
    if(res.rows.length > 0){
      console.log(res.rows);
      var results = res.rows;
      console.log("data exists");
      return results;
    }else{
      var query = "INSERT INTO categories (categoryname) VALUES ('Hotels'), ('Restaurants'), ('Business Cards'), ('Transportation'), ('Entertainment')";
      $cordovaSQLite.execute(db, query).then(function(res){
        var query = "SELECT * FROM categories";
        $cordovaSQLite.execute(db, query).then(function(res){
          console.log(res.rows);
          var results = res.rows;
          console.log("created and returned!");
          return results;
        }
      });
    }
  }, function(error){
    console.log(error);
  });
  return '';
});

travel.factory('Notes', ['$firebaseArray', function($firebaseArray){
  return function(catId){
    var itemsRef = new Firebase('https://radiant-torch-278.firebaseio.com/categories');
    var notesRef = itemsRef.child(catId);
    // console.log(itemsRef);
    return $firebaseArray(notesRef);
  }
}]);

travel.factory('CityNotes', ['$firebaseArray', function($firebaseArray){
  return function(catId, cityName){
    var itemsRef = new Firebase('https://radiant-torch-278.firebaseio.com/categories/'+catId);
    var notesRef = itemsRef.orderByChild("cityId").equalTo(cityName);
    return $firebaseArray(notesRef);
  }
}]);

travel.factory('Note', ['$firebaseObject', function($firebaseObject){
  return function(noteCat, noteId){
    var itemsRef = new Firebase('https://radiant-torch-278.firebaseio.com/categories/'+noteCat);
    var noteRef = itemsRef.child(noteId);
    return $firebaseObject(noteRef);
  }
}]);


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

//cordovaSQLite
travel.controller("DbController", function($scope, $cordovaSQLite){

  $scope.insert = function(firstname, lastname){
    var query = "INSERT INTO people (firstname, lastname) VALUES (?, ?)";
    $cordovaSQLite.execute(db, query, [firstname, lastname]).then(function(res){
      console.log("INSERT ID -> "+ res.insertId);
    }, function(error){
      console.log(error);
    });
  }

  $scope.select = function(lastname){
    console.log(lastname);
    var query = "SELECT firstname, lastname FROM people WHERE lastname = ?";
    console.log('query: '+query);
    $cordovaSQLite.execute(db, query, [lastname]).then(function(res){
      console.log(res.rows);
      if(res.rows.length > 0){
        console.log("SELECTED -> "+ res.rows.item(0).lastname);
        for (var i = 0; i < res.rows.length; i++) {
          var text = res.rows.item(i).lastname;
          var $result = $('<div>').text(text);
          $('#select-result').append($result);
        }
      }else{
        console.log("no rows exist");
      }
    }, function(error){
      console.log(error);
    });
  }

});

