'use strict';

/* Controllers */

var controllers = angular.module('homeServiceControllers', ["ngMessages"]);

/*
Project Controller
*/
controllers.controller('ProjectController', ['$scope', '$rootScope', '$routeParams', '$sce', '$http',
    'ProjectData', 'Reference', 'CreateProject', 'GetProject',
    function($scope, $rootScope, $routeParams, $sce, $http, ProjectData, Reference, CreateProject, GetProject) {

    $scope.reset = function() {
          window.optimizely.push(["activate", 2435720313]);

          $scope.processing = false;
          $scope.newProject = false;
          $scope.user_agreed = false;
          $scope.form_submitted = false;
          $scope.step1_complete = false;
          $scope.showEUA = false;
          $scope.job_cost_limit = 1000;

          Reference.getTextFile('t_and_c.txt').then(function(data) {
              $scope.t_and_c_text = $sce.trustAsHtml(data);
          });

          if (typeof $routeParams.param === 'undefined') {
            if ($scope.getPath(window.location.href) != "step1") {
                $scope.project = angular.copy(ProjectData.get());


            }
            else {
                $scope.project = {}
            }

            $scope.initializeNewProject();

            if ($scope.getPath(window.location.href) == "step2") {
                 Reference.getStates().then(function(data) {
                     $scope.states = data;
                     $scope.project.user = {};
                     $scope.project.user.state = $scope.states[0].name;
                 });
            }
          }
          else {
           $scope.processing = true;

           GetProject.get({ id: $routeParams.param },
               function(data) {
                   $scope.project = data;
                   $scope.processing = false;

                   $scope.initializeNewProject();
               },
               function(error) {
                   $rootScope.error = "API Services Error";
               }
           );
          }
    };

    $scope.getPath = function(string) {
        $scope.array = string.split('/');
        return $scope.result = $scope.array[$scope.array.length - 1];
    }

    $scope.initializeNewProject = function() {
         Reference.getStates().then(function(data) {
             $scope.states = data;

             if(typeof $scope.project.provider === 'undefined'){
                   $scope.initializeNewProvider();
             }
         });

         Reference.getTextFile('eua.txt').then(function(data) {
             $scope.eua_text = $sce.trustAsHtml(data);
         });

         if(typeof $scope.project.job === 'undefined'){
              $scope.newProject = true;

              Reference.getCategories().then(function(data) {
                  $scope.categories = data;

                  $scope.project.job = {};
                  $scope.project.job.type = $scope.categories[0];
              });
         }
    }

    $scope.initializeNewProvider = function() {
         $scope.project.provider = {};
         $scope.project.provider.state = $scope.states[0].name;
    }

    $scope.createNewProject = function() {
        if (!$scope.job_cost_invalid) {
            $scope.processing = true;
            $scope.project.provider.type = $scope.project.job.type;
            var project = new CreateProject($scope.project);

            project.$save(function() {
               // persist locally
               ProjectData.save($scope.project);

               $scope.processing = false;
               window.location = "/#/project_created"
           });
       }
    }

    $scope.completed_step_1 = function() {
        $scope.step1_complete = true;

        $scope.job_type_invalid = ( $scope.project.job.type == "Project Type");

        $scope.job_cost_invalid = ($scope.project.job.cost > $scope.job_cost_limit);

        $scope.job_date_invalid = (typeof $scope.project.job.startdateraw === 'undefined');

        if (!$scope.job_cost_invalid && !$scope.job_date_invalid && !$scope.job_type_invalid) {
            ProjectData.save($scope.project);

            window.location = "/#/step2"
        }
    }

    $scope.clicked_submit = function() {
        $scope.form_submitted = true;
    }

    $scope.checked_agreement = function() {
        $scope.user_agreed = true;
    }

    // For the date picker
    $scope.beforeToday = function(d) {
        var Today = new Date();

        return (d >= Today);
    }
    $scope.show_eua = function() {
       $scope.showEUA = true;
    };

    $scope.tc = function() {
       $scope.showTandC = true;
    };

    $scope.reset();
  }]);


  controllers.controller('CertSuccessController', ['$scope', '$rootScope', '$location', '$sce', '$routeParams', 'GetProject',
    'BuyGuarantee', 'CompletePayment', 'UpdateJobStatus', 'Reference', 'ConvertId',
      function($scope, $rootScope, $location, $sce, $routeParams, GetProject, BuyGuarantee, CompletePayment,
      UpdateJobStatus, Reference, ConvertId) {

      $scope.validProject = false;
      $scope.processing = false;
      $scope.buying = false;
      $scope.period_to_file = period_to_file;

      $scope.init = function() {

        console.log("init - id = [" + $routeParams.param +"]");

            if ($location.path().indexOf("purchase_complete") > -1) {
                $scope.payment_status = $routeParams.status;

                console.log("PAYMENT STATUS - " + $routeParams.status);

                console.log("Google tracking conversion");

                window.google_trackConversion({
                  google_conversion_id: 951222498,
                  google_conversion_label: 'x-MGCI7FjloQ4oHKxQM',
                  google_conversion_language: "en",
                  google_conversion_format: "2",
                  google_conversion_color: "ffffff",
                  google_conversion_value: 0
                });
            }

            $scope.processing = true;

             Reference.getTextFile('t_and_c.txt').then(function(data) {
                 $scope.t_and_c_text = $sce.trustAsHtml(data);
             });

            if ((typeof $routeParams.token !== 'undefined') && (typeof $routeParams.PayerID !== 'undefined')) {
                $scope.twitterShareLink = "share({network:'twitter', self: this, url: '', " +
                    "message: 'I just used @TrustCloud to ensure satisfaction on my project.'})";

                UpdateJobStatus.get({ id: $routeParams.param, status: 1 },
                function(data) {});
            }

            ConvertId.get({ id: $routeParams.param },
                function(data) {
                  //  var id = data;

                    console.log("ID - " + $routeParams.param + " converted id " + data.id);

                    GetProject.get({ id: data.id },
                        function(data) {
                            $scope.project = data;

                            // ugh
                            if ($scope.project.job.Id != 0) {
                                $scope.validProject = true;
                                $scope.processing = false;

                                if ($location.path().indexOf("purchase_complete") > -1) {
                                    if ($scope.payment_status == 'paid') {
                                        var paymentDetails = {};
                                        paymentDetails.payer_id = $routeParams.PayerID;
                                        paymentDetails.token = $routeParams.token;
                                        paymentDetails.plan_cost = $scope.project.job.plan_cost;
                                        paymentDetails.project_id = $scope.project.Id;

                                        var pay = new CompletePayment(paymentDetails);

                                        pay.$save(function() {});
                                    }
                                }
                            }
                        },
                        function(error) {
                            $rootScope.error = "API Services Error";
                        }
                    );
                }
            );


      }

      $scope.checkout = function() {
        var project_id = encodeURIComponent($routeParams.param);

        $scope.transaction = {};
        $scope.transaction.project_id = $routeParams.param;
        $scope.transaction.return_url
            = "http://" + $rootScope.webserver + "/#/purchase_complete/" + project_id + "/paid";

        $scope.transaction.cancel_url
            = "http://" + $rootScope.webserver + "/#/purchase_complete/" + project_id + "/cancelled";

        $scope.transaction.plan_cost = $scope.project.job.plan_cost;

        var buy = new BuyGuarantee($scope.transaction);

        $scope.buying = true;

        buy.$save(function() {

          window.location = buy.url;
        });
      };

      $scope.share = function(network) {
        var data = {};
        data.network = network;
        data.message = "I just used @TrustCloud to ensure satisfaction on my " + $scope.project.job.type + " project.";
        data.url = '';

        share(data);
      }

      $scope.tc = function() {
         $scope.showTandC = true;
      };

      $scope.init();
    }]);

