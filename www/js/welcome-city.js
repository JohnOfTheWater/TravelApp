$(function(){

  "use strict";

  var allCities = ['norwich', 'chicago', 'dc', 'toronto', 'san-francisco'];

  var city = allCities[Math.floor(Math.random() * allCities.length)];

  $('#welcome-image').css("background", "url('../img/"+city+".jpg')");
  $('.welcome-city').text(city);
  // $('#welcome-image').attr("style", "background: url('../img/chicago.jpg')");
});
