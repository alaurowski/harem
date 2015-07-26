angular.module('crmApp').factory('PositionsFactory', ['$http', function($http) {
    return {
        get: function() {
            return $http.get('/position');

        }
    };
}]);