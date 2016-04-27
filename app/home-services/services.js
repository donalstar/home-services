'use strict';

/* Services */

var services = angular.module('homeServiceServices', ['ngResource']);

services.factory('CreateProject', function ($resource, $rootScope, Reference) {
  return $resource($rootScope.api_server + '/project');
});

services.factory('BuyGuarantee', function ($resource, $rootScope) {
  return $resource($rootScope.api_server + '/buy_guarantee');
});

services.factory('CompletePayment', function ($resource, $rootScope) {
  return $resource($rootScope.api_server + '/complete_payment');
});


services.factory('GetProject', function ($resource, $rootScope) {
    return $resource($rootScope.api_server + '/project/:id', {}, {
      query: {method:'GET', params:{id:'id'}, isArray:true}
    })
});

services.factory('ConvertId', function ($resource, $rootScope) {
    return $resource($rootScope.api_server + '/convert_id/:id', {}, {
      query: {method:'GET', params:{id:'id'}, isArray:true}
    })
});

services.factory('GetProjects', function ($resource, $rootScope) {
    return $resource($rootScope.api_server + '/projects', {}, {
      query: {method:'GET', isArray:true}
    })
});

services.factory('UpdateProjectStatus', function ($resource, $rootScope) {
    return $resource($rootScope.api_server + '/update_project/:id/:status/:webserver', {}, {
    // should be a "PUT"
     query: {method:'GET', params:{id:'id', status:'status', webserver: 'webserver'}, isArray:true}
//      update: {method:'PUT', params:{id:'id', status: 'status'}, isArray:true}
    })
});

services.factory('UpdateJobStatus', function ($resource, $rootScope) {
    return $resource($rootScope.api_server + '/update_job/:id/:status', {}, {
     query: {method:'GET', params:{id:'id', status:'status'}, isArray:true}
    })
});

services.factory('AddNote', function ($resource, $rootScope) {
  return $resource($rootScope.api_server + '/note');
});

services.factory('GetNotes', function ($resource, $rootScope) {
    return $resource($rootScope.api_server + '/notes/:id', {}, {
      query: {method:'GET', params:{id:'id'}, isArray:true}
    })
});


services.factory('Note', function($resource, $rootScope){
    var Note = $resource($rootScope.api_server + '/note/:project_id/:id',
        { project_id: 'project_id', id:'id' },
    {
        delete: {
            method: 'DELETE'
        }
    });

    return Note;
});

services.factory('AdminLogin', function ($resource, $rootScope) {
  return $resource($rootScope.api_server + '/admin_login');
});


services.service('ProjectData', function () {
    var savedData = {}

    this.save = function (project) {
        savedData = project;
    }

    this.get = function () {
        return savedData;
    }
});

services.factory('Reference', function($q, $timeout, $http) {

    var functions = {
        getCategories : function () {
            return this.loadFile('categories.json');
        },

        getStates : function () {
            return this.loadFile('states.json');
        },

        getProjectStates : function () {
            return this.loadFile('project_states.json');
        },

        getTextFile: function(name) {
            return this.loadFile(name);
        },

        loadFile : function (file) {
            var deferred = $q.defer();

            $timeout(function() {
                $http.get("/app/reference/" + file).success(function(data) {
                    deferred.resolve(data);
                });
            }, 30);

            return deferred.promise;
        },

    }

    return functions;
});


