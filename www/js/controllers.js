angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, locations) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

// $http doesn't belong in controllers!
.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('SearchCtrl', function ($scope, $ionicLoading, search, locations) {

  // function saveToLocations(data){
  //   locations.addOne(data.results[0].formatted_address, data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
  // }

  $scope.queryChanged = _.debounce(function(){

    $ionicLoading.show({
      template: "<div class='loading'><img src='http://i.imgur.com/bvaKfDm.gif'/><p>Loading!</p></div>"
    });

    search.getCities($scope.query, function(data){
      console.log(data);
      $scope.geocode_data = data;
      $ionicLoading.hide();
      // saveToLocations(data);
    });

  }, 1000);
})

.controller('WeatherCtrl', function($scope, $stateParams, weather, $ionicLoading, locations) {
  //$scope.params = $stateParams;

  $scope.city = $stateParams.city;
  $scope.icon_obj = weather.icon_obj;
  //$scope.precision = settings.precision;

  $ionicLoading.show({
    template: "<div class='loading'><img src='http://i.imgur.com/bvaKfDm.gif'/><p>Loading!</p></div>"
  });

  weather.getWeather($stateParams.lat, $stateParams.long, function(data){
    var temperature = data.currently.temperature;
    $scope.temperature = weather.convertedTemp(temperature);
    //$scope.tempSymbol = settings.scale;
    $scope.icon = data.currently.icon;
    $scope.summary = data.currently.summary;
    $ionicLoading.hide();
    console.log(data);
  })


  // should be able to move this back into menu; will still work since weather is a child of menu.
  // $scope.addToLocations = function(name, lat, long) {
  //   console.log("add to locations: " + name + " " + lat + " " + long);
  //   locations.addOne(name, lat, long);
  // }

})

.controller('SettingsCtrl', function($scope, settings) {
  $scope.precision = settings.precision;
  $scope.scale = settings.scale;

  // looking on the scope for changes to scale
  $scope.$watchGroup(['scale', 'precision'], function(change) {
    settings.scale = change[0];
    settings.precision = change[1];
  })

})

.controller('MenuCtrl', function($scope, locations, $stateParams, $rootScope) {
  $scope.params = $stateParams;
  $scope.fav_cities = locations.getAll();

  $rootScope.$on('menuItemChanged', function (event, message){
    $scope.fav_cities = locations.getAll();
  })

  $scope.delete = function(city_name){
    locations.removeOne(city_name);
    $rootScope.$emit('menuItemChanged');
  }

  $scope.addToLocations = function(name, lat, long) {
    console.log("add to locations: " + name + " " + lat + " " + long);
    locations.addOne(name, lat, long);
    $rootScope.$emit('menuItemChanged');
  }

});
