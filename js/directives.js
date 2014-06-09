'use strict';

/* Directives */


angular.module('intertecTimesheet.directives', [])
    .directive('timesheet', [ function () {
        return {
            restrict: 'E',
            templateUrl: 'partial/projectTimesheet.html'
        };
    }])
    .directive('tasks', function () {
        return {
            restrict: 'E',
            templateUrl: 'partial/tasks.html'
        };
    })
    .directive('projecttimesheet', function () {
        return {
            restrict: 'E',
            templateUrl: 'partial/projectTimesheet.html'
        };
    })
    .directive('intProjectTimeEntry', function() {
        return {
            restrict: 'E',
            templateUrl: 'partial/intProjectTimeEntry.html'
        };
    })
    .directive('userProfile', function(){
        return {
            restrict: 'E',
            templateUrl: 'partial/profile.html'
        };
    });
;
