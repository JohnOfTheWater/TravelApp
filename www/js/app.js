// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var db = null;

var travel = angular.module('travel', ['ionic', 'lokijs', 'firebase','ngCordova']);

travel.run(function($ionicPlatform, $cordovaSQLite, $timeout) {
  $ionicPlatform.ready(function() {

    $('#map').addClass('google-maps');
    // $timeout(function(){//to make it work more consistently in ionic view

    // alert(window.Document.name);
    // console.log('sqlitePlugin: '+window.sqlitePlugin);
    if(window.cordova) {
      // App syntax
      db = $cordovaSQLite.openDB("myapp.db");
    } else {
      // Ionic serve syntax
      db = window.openDatabase("myapp.db1", "1.0", "My app", -1);
    }

    //create categories table if not exists and insert some default category
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS categories (id integer primary key, categoryname text)").then(function(res){
      // console.log(res);
      var query = "SELECT * FROM categories";
      $cordovaSQLite.execute(db, query).then(function(res){
        if(res.rows.length > 0){
          // console.log(res.rows);
          results = res.rows;
          console.log("categories exists");
          console.log(results);
        }else{
          console.log('way to go!');
          var query = "INSERT INTO categories (categoryname) VALUES ('Hotels'), ('Restaurants'), ('Transportation'), ('Attractions'), ('Next Visit')";
          $cordovaSQLite.execute(db, query).then(function(){
            // $window.location.reload(true);
            // alert('way to go cat!');
          });
        }
      });
    });

    //create cities table if not exists and insert some default cities
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS cities (id integer primary key, cityname text, selected text)").then(function(res){
      // console.log(res);
      var query = "SELECT * FROM cities";
      $cordovaSQLite.execute(db, query).then(function(res){
        if(res.rows.length > 0){
          console.log("cities exists");
          console.log(res.rows);
        }else{
          console.log('way to go!');
          var query = "INSERT INTO cities (cityname, selected) VALUES ('Nashville','yes'), ('Chicago','no'), ('Philadelphia','no'), ('Hong-Kong','no'), ('London','no')";
          // alert(query);
          $cordovaSQLite.execute(db, query).then(function(){
            // alert('way to go cities!');
            // $window.location.reload(true);
          });
        }
      });
    });

    //create NOTES table if not exists already
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS notes (id integer primary key, cityId text, noteAddress text, noteCat text, noteEmail text, noteNotes text, notePhone text, noteSite text, noteTitle text)");
    //create PICTURES table if not exists already
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS pictures (id integer primary key, cityId text, noteId integer, pictureString text)");

    // },700);


    // var adapter = new LokiCordovaFSAdapter({"prefix": "loki"});

    // var loki_db = new loki('dbWithAdapter.json', {adapter: adapter});

    // var children = loki_db.addCollection('children');

    // children.insert({name:'lallo', legs: 8});

    // var child = children.get(1);

    // console.log(children.data);

    // loki_db.saveDatabase(function(){
    //   console.log('db saved');
    // });

    // to drop a table
    // var query = "DROP TABLE categories";
    // $cordovaSQLite.execute(db, query);
    // to select stuff
    // setTimeout(function(){
    //   var x = db;
    //   alert('miao');
    //   var query = "SELECT cityname FROM cities";
    //   $cordovaSQLite.execute(x, query).then(function(res){
    //     // console.dir(res);
    //     var x = res.rows[0].cityname;
    //     alert(x);
    //   });
    // }, 2000); //timeout end for ionic view

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

travel.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
  var self = this;

  // Handle query's and potential errors
  self.query = function (query, parameters) {
    // console.log(query);
    parameters = parameters || [];
    var q = $q.defer();

    $ionicPlatform.ready(function () {
      // var db = $cordovaSQLite.openDB("myapp.db");
      $cordovaSQLite.execute(db, query, parameters)
        .then(function (result) {
          q.resolve(result);
        }, function (error) {
          console.warn('I found an error');
          console.warn(error);
          q.reject(error);
        });
    });
    return q.promise;
  }

  // Proces a result set
  self.getAll = function(result) {
    var output = [];

    for (var i = 0; i < result.rows.length; i++) {
      output.push(result.rows.item(i));
    }
    return output;
  }

  // Proces a single result
  self.getById = function(result) {
    var output = null;
    output = angular.copy(result.rows.item(0));
    return output;
  }

  return self;
});

travel.factory('CordovaCategory', function($cordovaSQLite, DBA) {
  var self = this;

  self.all = function() {
    return DBA.query("SELECT id, categoryname FROM categories")
      .then(function(result){
        // console.log(results);
        return DBA.getAll(result);
      });
  }


  self.get = function(id) {
    var parameters = [id];
    return DBA.query("SELECT id, categoryname FROM categories WHERE id = (?)", parameters)
      .then(function(result) {
        return DBA.getById(result);
      });
  }

  self.add = function(item) {
    var parameters = [item.categoryname];
    return DBA.query("INSERT INTO categories (categoryname) VALUES (?)", parameters);
  }

  self.remove = function(item) {
    console.log(item.id);
    var parameters = [item.id];
    return DBA.query("DELETE FROM categories WHERE id = (?)", parameters);
  }

  // self.update = function(origMember, editMember) {
  //   var parameters = [editMember.id, editMember.name, origMember.id];
  //   return DBA.query("UPDATE team SET id = (?), name = (?) WHERE id = (?)", parameters);
  // }

  return self;
});

travel.factory('CordovaCity', function($cordovaSQLite, DBA) {
  var self = this;

  self.all = function() {
    return DBA.query("SELECT id, cityname, selected FROM cities ORDER BY cityname ASC")
      .then(function(result){
        // console.log(result);
        return DBA.getAll(result);
      });
  }


  self.get = function(id) {
    var parameters = [id];
    return DBA.query("SELECT id, cityname FROM cities WHERE id = (?)", parameters)
      .then(function(result) {
        return DBA.getById(result);
      });
  }

  self.add = function(item) {
    var parameters = [item.cityname, item.selected];
    return DBA.query("INSERT INTO cities (cityname, selected) VALUES (?,?)", parameters);
  }

  self.remove = function(item) {
    console.log(item.id);
    var parameters = [item.id];
    return DBA.query("DELETE FROM cities WHERE id = (?)", parameters);
  }

  self.update = function(item) {
    var parameters = [item.selected, item.id];
    return DBA.query("UPDATE cities SET selected = (?) WHERE id = (?)", parameters);
  }

  return self;
});

travel.factory('CordovaNote', function($cordovaSQLite, DBA) {
  var self = this;

  self.all = function(item) {
    var parameters = [item.cityId, item.noteCat];
    // console.log(parameters);
    // return DBA.query("SELECT id, noteTitle FROM notes WHERE cityId = 'Nashville' AND noteCat = 1", parameters)
    //   .then(function(result){
    //     console.log(result);
    //     return DBA.getAll(result);
    //   });
    var query = "SELECT id, noteTitle FROM notes WHERE cityId = '"+item.cityId+"' AND noteCat = '"+item.noteCat+"' ORDER BY noteTitle ASC";
    return $cordovaSQLite.execute(db, query).then(function(res){
      console.log(res.rows);
      return DBA.getAll(res);
    });
  }


  self.get = function(id) {
    var parameters = [id];
    return DBA.query("SELECT id, cityId, noteAddress, noteCat, noteEmail, noteNotes, notePhone, noteSite, noteTitle FROM notes WHERE id = (?)", parameters)
      .then(function(result) {
        return DBA.getById(result);
      });
  }

  self.add = function(item) {
    var parameters = [item.cityId, item.noteAddress, item.noteCat, item.noteEmail, item.noteNotes, item.notePhone, item.noteSite, item.noteTitle];
    return DBA.query("INSERT INTO notes (cityId, noteAddress, noteCat, noteEmail, noteNotes, notePhone, noteSite, noteTitle) VALUES (?,?,?,?,?,?,?,?)", parameters);
  }

  self.remove = function(item) {
    console.log(item.id);
    var parameters = [item.id];
    return DBA.query("DELETE FROM notes WHERE id = (?)", parameters);
  }

  // self.update = function(origMember, editMember) {
  //   var parameters = [editMember.id, editMember.name, origMember.id];
  //   return DBA.query("UPDATE team SET id = (?), name = (?) WHERE id = (?)", parameters);
  // }
  self.update = function(note) {
    var parameters = [note.noteAddress, note.noteEmail, note.noteNotes, note.notePhone, note.noteSite, note.id];
    return DBA.query("UPDATE notes SET noteAddress = (?), noteEmail = (?), noteNotes = (?), notePhone = (?), noteSite = (?) WHERE id = (?)", parameters);
  }

  return self;
});

travel.factory('CordovaPicture', function($cordovaSQLite, DBA) {
  var self = this;

  self.all = function(item) {
    var parameters = [item.cityId, item.id];
    // console.log(parameters);
    // return DBA.query("SELECT id, noteTitle FROM notes WHERE cityId = 'Nashville' AND noteCat = 1", parameters)
    //   .then(function(result){
    //     console.log(result);
    //     return DBA.getAll(result);
    //   });
    var query = "SELECT id, pictureString FROM pictures WHERE cityId = '"+item.cityId+"' AND noteId = '"+item.id+"' ORDER BY id ASC";
    return $cordovaSQLite.execute(db, query).then(function(res){
      console.log(res.rows);
      return DBA.getAll(res);
    });
  }


  self.get = function(id) {
    var parameters = [id];
    return DBA.query("SELECT id, cityId, noteId, pictureString FROM pictures WHERE id = (?)", parameters)
      .then(function(result) {
        return DBA.getById(result);
      });
  }

  self.add = function(item) {
    var parameters = [item.cityId, item.noteId, item.pictureString];
    return DBA.query("INSERT INTO pictures (cityId, noteId, pictureString) VALUES (?,?,?)", parameters);
  }

  self.remove = function(item) {
    console.log(item.id);
    var parameters = [item.id];
    return DBA.query("DELETE FROM pictures WHERE id = (?)", parameters);
  }

  return self;
});

//Loki factory
travel.factory('Lokidb', function($q, Loki){

  var self = this;
  var loki_db;
  var categories;
  var cat;

  self.initDatabase = function(){

    var adapter = new LokiCordovaFSAdapter({"prefix": "my_loki"});

    // var idbAdapter = new LokiIndexedAdapter('cities');



    if(window.cordova) {
      loki_db = new loki('loki.json',
                      {
                        // persistenceMethod: 'adapter',
                        autosave: true,
                        autosaveInterval: 1000,
                        adapter: adapter,
                        // autoload: true,
                      });
      // alert('persistent');
      console.log(cordova.file.dataDirectory);
      // loki_db.loadDatabase({}, function (result) {
      //     console.log('results of loadDatabase'+result);
          // alert(loki_db.getCollection("Categories"));
      // });
    }else{
      loki_db = new loki('loki.json');
    }




    categories = loki_db.addCollection('Categories');

    cat = loki_db.getCollection('Categories');
    console.log('categories length: '+cat.data.length);
    if(cat.data.length === 0){
      categories.insert({
        categoryname: 'Hotels'
      });
      categories.insert({
        categoryname: 'Restaurants'
      });
    }

    loki_db.saveDatabase(function(){
      console.log('db saved!!!!');
    });

    console.log(cat.data[0].categoryname);
  }

  self.addCategory = function(x){
    var options = {};
    loki_db.loadDatabase(options, function(){
      var categories = loki_db.getCollection('Categories');
      if(!categories){
        categories.insert({
            categoryname: x
        });
      }else{
        categories.insert({
            categoryname: x
        });
        for (var i = 0; i < categories.data.length; i++) {
          console.log('cat name: '+categories.data[i].categoryname);
        }
      }
    });
    console.log(categories.data);
  }

  return self;

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


