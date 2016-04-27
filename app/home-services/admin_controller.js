'use strict';

/* Controllers */

var controllers = angular.module('homeServiceAdminControllers', ["ngMessages"]);

/*
Admin Controller
*/
controllers.controller("AdminController", ['$scope', '$rootScope', '$routeParams',
   'AdminLogin', 'Reference', 'GetProjects', 'GetProject', 'UpdateProjectStatus',
   'AddNote', 'GetNotes', 'Note',
    function($scope, $rootScope, $routeParams, AdminLogin, Reference, GetProjects, GetProject,
        UpdateProjectStatus, AddNote, GetNotes, Note) {

     // pagination variables
     $scope.currentPage = 1;
     $scope.pageSize = 10;

     $scope.message = "";
     $scope.processing = false;

     Reference.getProjectStates().then(function(data) {
         $scope.types = data;
     });

     $scope.user = {
       username: "",
       password: ""
     };

     $scope.dialogShown = true;

     // add notes
     $scope.note_data = {};

     $scope.add_note = function() {
         if($scope.note !=''){
           $scope.note_date = new Date();

           $scope.note_data.push({
              date: $scope.note_date,
              value: $scope.note
           });

           var n = {};
           n.value = $scope.note;
           n.date = $scope.note_date;
           n.project_id = $routeParams.param;

           var newNote = new AddNote(n);
           newNote.$save(function() {});

           $scope.note = "";
         }
     }

     $scope.delete_note = function($index) {
        Note.delete({ project_id: $routeParams.param, id: $scope.note_data[$index].id }, function(data) {
            $scope.note_data.splice($index, 1);
        });
     }

     $scope.init = function() {
        if ($routeParams.param != null) {
            $scope.processing = true;
            GetProject.get({ id: $routeParams.param }, function(data) {
                $scope.processing = false;
                $scope.project = data;

                $scope.project.provider.status =
                    ($scope.project.provider.TrustcheckStatus.Validated == true)
                    ? 'TrustCheck Validated' : 'Not TrustCheck Validated';
            });

             GetNotes.query({ id: $routeParams.param }, function(data) {
                 $scope.note_data = data;
             });
        }
     }

     $scope.submit = function(isValid) {
       if (isValid) {
         var login = new AdminLogin($scope.user);

         login.$save(function() {
           if (login.status != 200) {
            $scope.message = "Login credentials incorrect for username [" + $scope.user.username + "]";
           }
           else {
            $rootScope.loginStatus = true;
            $rootScope.loggedInUser = $scope.user.username;

            GetProjects.query( function(data) {
                $rootScope.saved_projects = data;
            });

            window.location = "/#/admin_main/";
           }
         });
       } else {
         $scope.message = "There are still invalid fields below";
       }
     };

     $scope.view = function(id) {
        window.location = "/#/admin_view_project/" + id;
     }

     $scope.approve = function() {
        $scope.note = "Project approved by " + $rootScope.loggedInUser;
        $scope.add_note();

        $scope.updateStatus("Approved");
     };

     $scope.decline = function() {
        $scope.note = "Project declined by " + $rootScope.loggedInUser;
        $scope.add_note();

        $scope.updateStatus("Declined");
     };

     $scope.reopen = function() {
        $scope.note = "Project re-opened by " + $rootScope.loggedInUser;
        $scope.add_note();

        $scope.updateStatus("Pending");
     };

     $scope.logout = function() {
         $rootScope.loginStatus = false;
         window.location = "/#/admin";
     };

     $scope.back_to_list = function() {
         window.location = "/#/admin_main";
     };

     $scope.updateStatus = function(status) {
        $scope.processing = true;

        UpdateProjectStatus.get({ id: $routeParams.param, status: status, webserver: $rootScope.webserver },
        function(data) {
            $scope.project.status = status;
            $scope.processing = false;
        });
     };

     $scope.init();
}]);

