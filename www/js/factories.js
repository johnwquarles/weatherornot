angular.module('starter.factories', [])

// factories aren't instantiated with the "new" keyword, so don't capitalize them.
.factory('search', function($http) {
  return {

    getCities : function(query, cb) {
      $http
      .get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {address: query}
      })
      .success(cb);
    }

  }
})

.factory('weather', function($http, settings){
  return {

    icon_obj : {
      "clear-day": "sun.gif",
      "clear-night": "sun.gif",
      "rain": "rain.gif",
      "snow": "snow.gif",
      "sleet": "storm.gif",
      "wind": "cloud.gif",
      "fog": "cloud.gif",
      "cloudy": "cloud.gif",
      "partly-cloudy-day": "cloud_or_sun.gif",
      "partly-cloudy-night": "cloud_or_sun.gif"
    },

    getWeather : function(lat, long, cb){
      $http
        // added '?us' to guard against the default ever changing from fahrenheit.
        .get('/api/forecast/' + lat + "," + long + "?us")
        // if you were going to get different units (C or F) as part of the request:
        // (implement somehow; can have a trailing ? even if there are no params.
        // lat & long aren't technically parameters here.
        //.get('/api/forecast' + lat + "," + long + '?' + SI_PARAM;)
        .success(cb);
    },

    converter_obj : {
      "F" : function(f){return f},
      "C" : function(f){return (f - 32) * (5/9)},
      "K" : function(f){return (f + 459.67) * (5/9)},
      "P" : function(f){return (f / (Math.pow(10, 32) * 2.55))},
      "V" : function(f){
              if (f < 10) {return "holy hell just head toward the equator";}
              else if (f < 32) {return "cold as hell!";}
              else if (f < 50) {return "cold!";}
              else if (f < 60) {return "a tiddle bit chilly!"}
              else if (f < 80) {return "pretty nice!";}
              else if (f < 90) {return "getting pretty warm!";}
              else if (f < 100) {return "hot!";}
              else if (f < 110) {return "Find an AC or jump in a fridge!";}
              else if (f < 940) {return "Christ has returned to judge us!";}
              else {return "pretty hot!";}
            }
    },

    convertedTemp : function (f) {
      return this.converter_obj[settings.scale](f);
    }

  }
})

// can have functions fire in a factory. factories are singletons. The functions will fire when factory is injected/instantiated only.
.factory('settings', function() {
  return {

    get scale() {
      return localStorage.scale || 'F';
    },
    get precision() {
      return localStorage.precision || 2;
    },
    set scale(s) {
      localStorage.scale = s;
    },
    set precision(p) {
      localStorage.precision = p;
    }

    // this worked too but the above enables dot notation and is thus nicer, I think.

    // localStorage: function(att, val) {
    //   if (arguments.length === 2) {
    //     localStorage[att] = val;
    //   } else if (arguments.length === 1) {
    //     return localStorage[att];
    //   }
    // }

  };
})

.factory('locations', function() {

  defaultFavorites = [{
      city: 'Cupertino, CA',
      lat: '37.3190',
      lng: '-122.0293'
    }, {
      city: 'Mountain View, CA',
      lat: '37.3897',
      lng: '-122.0816'
    }, {
      city: 'Redmond, WA',
      lat: '47.6786',
      lng: '-122.1310'
    }];

  if (!localStorage.locations) {
    localStorage.locations = JSON.stringify(defaultFavorites);
  }

  return {

    getAll : function() {
      return JSON.parse(localStorage.locations);
    },

    setAll : function(obj) {
      localStorage.locations = JSON.stringify(obj);
    },

    removeOne : function(city_name) {
      //console.log("delete " + city_name);
      var locations = this.getAll();
      //console.log("locations arr at the start is:");
      //locations.forEach(function(city){console.log(city.city)});

                // redo below part with a javascript filter? would be more concise.

      var index_to_delete;
      for (var i = 0; i < locations.length; i++) {
        console.log("checking if saved city name " + locations[i].city + " equals " + city_name);
        if (locations[i].city === city_name) {
          index_to_delete = i;
          break;
        }
      }
      //console.log("index to delete: " + index_to_delete);
      locations = locations.slice(0, index_to_delete).concat(locations.slice(index_to_delete + 1));
      //console.log("locations array is now: ");
      //locations.forEach(function(city){console.log(city.city)});
      this.setAll(locations);
    },

    addOne : function(name, lat, lng) {

      var locations = this.getAll();
      locations.push({
        city: name,
        lat: lat,
        lng: lng
      })
      this.setAll(locations);
    }
  }

})
