/**
 * Created by user on 1/2/14.
 */


angular.module('intertecTimesheet.directives', [])
    .directive('intProjectTimeEntry', function(version) {
        return {
            restrict: 'E',
            templateUrl: 'partial/intProjectTimeEntry.html'
        };
    });
