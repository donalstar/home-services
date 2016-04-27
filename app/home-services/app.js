'use strict';

/* App Module */

var app = angular.module('homeServicesApplication', [
  'angularUtils.directives.dirPagination',
  'ngRoute',
  'ngQuickDate',
  'ngModal',
  'filters',
  'homeServiceControllers',
  'homeServiceAdminControllers',
  'homeServiceServices',
  'ui.mask',
  'ui.utils.masks'
]);



app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'app/partials/home.html',
        controller: 'ProjectController'
      }).
      when('/step1', {
        templateUrl: 'app/partials/create_project1.html',
        controller: 'ProjectController'
      }).
	  when('/step2', {
        templateUrl: 'app/partials/create_project2.html',
        controller: 'ProjectController'
      }).
      when('/fail', {
        templateUrl: 'app/partials/scoring_fail.html',
        controller: 'ProjectController'
      }).
      when('/project_created', {
        templateUrl: 'app/partials/project_created.html',
        controller: 'ProjectController'
      }).
      when('/project_created/:param', {
        templateUrl: 'app/partials/project_created.html',
        controller: 'ProjectController'
      }).
      when('/cert_success/:param', {
        templateUrl: 'app/partials/certification_success.html',
        controller: 'CertSuccessController'
      }).
      when('/purchase_complete/:param/:status', {
        templateUrl: 'app/partials/purchase_complete.html',
        controller: 'CertSuccessController'
      }).
      when('/admin', {
        templateUrl: 'app/partials/admin_login.html',
        controller: 'AdminController'
      }).
      when('/admin_main', {
        templateUrl: 'app/partials/admin_main.html',
        controller: 'AdminController'
      }).
      when('/admin_view_project/:param', {
        templateUrl: 'app/partials/admin_view_project.html',
        controller: 'AdminController'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);

  app.run(['$rootScope', '$routeParams', '$location', '$window',
    function ($rootScope,$routeParams,$location, $window){
     // window.optimizely.push(["activate", 2435720313]);

      $rootScope.host = $location.host();

      $rootScope.api_server = api_server;
      $rootScope.webserver = web_server;

      console.log("API Server " + $rootScope.api_server);
  }]);


/*
Google Analytics
  */
app.factory('myGoogleAnalytics', function ($rootScope, $window, $location) {

    var myGoogleAnalytics = {};

    /**
     * Set the page to the current location path
     * and then send a pageview to log path change.
     */
    myGoogleAnalytics.sendPageview = function() {
      if ($window.ga) {
        $window.ga('set', 'page', $location.path());
        $window.ga('send', 'pageview');
      }
    }

    // subscribe to events
    $rootScope.$on('$viewContentLoaded', myGoogleAnalytics.sendPageview);

    return myGoogleAnalytics;
  })
  .run(function(myGoogleAnalytics) {
    // inject self
  });

