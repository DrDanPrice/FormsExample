'use strict';


// Declare app level module which depends on filters, and services
angular.module('HealthyHomes', [
    'ngRoute',
    'HealthyHomes.filters',
    'HealthyHomes.services',
    'HealthyHomes.directives',
    'HealthyHomes.controllers',
    'ui.bootstrap',
    'ngTouch'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partial/login.html', controller: 'LoginController'});
    $routeProvider.when('/home', {templateUrl: 'partial/home.html', controller: 'HomeController'});
    $routeProvider.when('/forms', {templateUrl: 'partial/forms.html', controller: 'FormController'});
    $routeProvider.when('/summary', {templateUrl: 'partial/summary.html', controller: 'PageSummaryController'});
    $routeProvider.when('/summary', {templateUrl: 'partial/summary.html', controller: 'PageSummaryController'});
  /*$routeProvider.when('/intProjectTimeEntry', {templateUrl: 'partial/projectTimesheet.html', controller: 'TimesheetController'});
  $routeProvider.when('/timesheet/:mode/:id', {templateUrl: 'partial/timesheet.html', controller: 'TimesheetController'});
  $routeProvider.when('/myprofile', {templateUrl: 'partial/profileWrapper.html', controller: 'ProfileController'});
  $routeProvider.when('/changePassword', {templateUrl: 'partial/changePassword.html', controller: 'ChangePasswordController'});*/
    $routeProvider.when('/login', {templateUrl: 'partial/login.html', controller: 'LoginController'});
    $routeProvider.otherwise({redirectTo: '/home'});
}]);

//move below into a filters, services, directives, controllers.js, etc
        window._cordovaNative = true;
        var HealthyHomes = angular.module('HealthyHomes', ['checklist-model', 'ngTouch']);

        HealthyHomes.config(['$httpProvider', function($httpProvider) {
                $httpProvider.defaults.useXDomain = true;
                $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
                delete $httpProvider.defaults.headers.common['X-Requested-With'];
            }
        ]);

          HealthyHomes.controller('login', function ($scope, $http, $log, $timeout) {

            sessionStorage.clear();

            $scope.submit = function(url) 
            {
              $scope.submitted = true;

              if ($scope.loginForm.$invalid) {
              $scope.message = 'Enter all required fields';
                return;
              }
               else 
            {
                $scope.message = '';
                 $http.post(' http://www.housuggest.org/healthyhomes/login.php', {'uname': $scope.name, 'pswd': $scope.password}
                            ).success(function(data, status, headers, config) {
                                if (data.msg !== '')
                                {
                                sessionStorage.setItem('inspector', $scope.name);
                                window.location = "" + url;
                                $scope.message = data.msg;
                                }
                                else
                                {
                                    $scope.message = data.error;
                                }
                            }).error(function(data, status) { 
                                $scope.message = data.error;
                            });
            }

            };
          });


          HealthyHomes.controller('schedule', function ($scope, $http, $log, $timeout) {

          $scope.init = function (url) {

                   if(sessionStorage.getItem('inspector') === 'undefined'  || sessionStorage.getItem('inspector') === null )
                  {
                        $scope.Iname = 'Please login';
                        window.location = "" + url;
                  }    
                  else
                  {
                    $scope.Iname = sessionStorage.getItem('inspector');
                  }
          };

          $scope.prevPage = function(url) {
            window.location = url + "";
        };

          $scope.message = 'Welcome ' + sessionStorage.getItem('inspector') ;

                $http.post(' http://www.housuggest.org/healthyhomes/schedule.php', {'inspector': sessionStorage.getItem('inspector')}
                            ).success(function(data, status, headers, config) {
                                 $scope.scheduler = data.schedule;
                                 
                            }).error(function(data, status) { 
                    
                                $scope.message = 'error getting data1';
                            });
        });

        HealthyHomes.controller('inspection', function ($scope, $http, $log, $timeout) {

         $scope.init = function (url) {

                   if(sessionStorage.getItem('inspector') === 'undefined'  || sessionStorage.getItem('inspector') === null )
                  {
                        $scope.Iname = 'Please login';
                        window.location = "" + url;
                  }    
                  else
                  {
                    $scope.Iname = sessionStorage.getItem('inspector');
                  }
          };

          $scope.prevPage = function(url) {
            window.location = url + "";
        };

        $scope.message = 'Welcome Inspector ' + sessionStorage.getItem('inspector') ;

           $http.post(' http://www.housuggest.org/healthyhomes/confidential.php', {'id': sessionStorage.getItem('inspectionHome')}
                            ).success(function(data, status, headers, config) {
                                if (data.msg !== '')
                                {
                                 $scope.firstname = data.Fname;
                                 $scope.lastname = data.Lname;
                                 $scope.street = data.Street;
                                 $scope.city = data.City;
                                 $scope.zip = data.Zip;
                                }
                                else
                                {
                                    $scope.message = '';
                                }
                            }).error(function(data, status) { 
                                
                                $scope.message = 'error getting data2';
                            });
        });
angular.module('myApp', ['ajoslin.promise-tracker'])
  .controller('help', function ($scope, $http, $log, promiseTracker, $timeout) {
    $scope.subjectListOptions = {
      'bug': 'Report a Bug',
      'account': 'Account Problems',
      'mobile': 'Mobile',
      'user': 'Report a Malicious User',
      'other': 'Other'
    };

    // Form submit handler.
    $scope.submit = function(form) {
      // Trigger validation flag.
      $scope.submitted = true;

      // If form is invalid, return and let AngularJS show validation errors.
      if (form.$invalid) {
        return;
      }

      // Default values for the request.
      $scope.progress = promiseTracker('progress');
      var config = {
        params : {
          'callback' : 'JSON_CALLBACK',
          'name' : $scope.name,
          'email' : $scope.email,
          'subjectList' : $scope.subjectList,
          'url' : $scope.url,
          'comments' : $scope.comments
        },
        tracker : 'progress'
      };

      // Perform JSONP request.
        //should have another . for ng-model
        //should be passing arrays of questions, anyway.
      $http.jsonp('response.json', config)
        .success(function(data, status, headers, config) {
          if (data.status == 'OK') {
            $scope.name = null;
            $scope.email = null;
            $scope.subjectList = null;
            $scope.url = null;
            $scope.comments = null;
            $scope.messages = 'Your form has been sent!';
            $scope.submitted = false;
          } else {
            $scope.messages = 'Oops, we received your request, but there was an error processing it.';
            $log.error(data);
          }
        })
        .error(function(data, status, headers, config) {
          $scope.progress = data;
          $scope.messages = 'There was a network error. Try again later.';
          $log.error(data);
        });

      // Hide the status message which was set above after 3 seconds.
      $timeout(function() {
        $scope.messages = null;
      }, 3000);
    };
  });
