'use strict';

/* Filters */

angular.module('intertecTimesheet.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])
  .filter('startOfWeek', [function() {
        return function(d) {
            d = new Date(d);
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6 : 1);
            return new Date(d.setDate(diff));
        }
  }])
  .filter('endOfWeek', [function() {
        return function(d) {
            d = new Date(d);
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? 0 : 7);
            return new Date(d.setDate(diff));
        }
  }])
    .filter('isActiveByPath', ['$location', function($location) {
        return function(path) {
            return $location.path() == path ? 'int-active' : '';
        }
    }])
;
