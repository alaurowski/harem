angular.module('crmApp').factory('UsersFactory', ['$http', function($http) {
    return {
        get: function() {
            return $http.get('/users');

        }
    };
}]);