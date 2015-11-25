$(function(){

  "use strict";

  var allCities = ['norwich', 'chicago', 'dc', 'toronto', 'san-francisco', 'philadelphia', 'istanbul', 'atlanta', 'new-york', 'nashville', 'london'];

  var city = allCities[Math.floor(Math.random() * allCities.length)];

  // $('#welcome-image').css("background", "url('../img/"+city+".jpg')");
  $('.welcome-city').text(city);
  $('#welcome-image').addClass(city);
  // $('#welcome-image').attr("style", "background: url('../img/chicago.jpg')");
});
