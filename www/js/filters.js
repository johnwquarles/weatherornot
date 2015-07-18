angular.module('starter.filters', [])

.filter('tempdisplay', function(settings){
  return function(input){
    if (isNaN(parseInt(input))) {return input;}
    else {return input.toFixed(settings.precision).toString() + "°" + settings.scale;}
  }
})
