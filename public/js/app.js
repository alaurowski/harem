/**
 * Created by Marek on 2015-03-13.
 */

(function(){
    var app = angular.module('crmApp',['ngRoute']);

    app.config(['$routeProvider', function($routeProvider) {

        $routeProvider
            .when('/candidates', {
                templateUrl: 'partials/candidates.html'
            })

        ;

    }]);

    app.controller('MainCtrl', ['$scope',  function($scope){

        $scope.message = 'sample message';

    }]);
})();