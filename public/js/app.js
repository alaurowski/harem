/**
 * Created by Marek on 2015-03-13.
 */

(function () {
    var app = angular.module('crmApp', ['ngRoute']);

    app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider
            .when('/', {
                controller: 'MainCtrl'
            })
            .when('/leads', {
                controller: 'leadsIndex',
                templateUrl: 'views/leads/showLeads.html'
            })
            .when('/leads/add', {
                controller: 'leadsAdd',
                templateUrl: 'views/leads/addLead.html'
            });

    }]);

    app.controller('MainCtrl', ['$scope', '$http', function ($scope) {

        $scope.title = 'Leads dashboard';

    }]);

    app.controller('leadsIndex', ['$scope', '$http', function ($scope, $http) {

        $scope.title = 'Leads list';

        $scope.users = [];

        $http.get('lead/index').success(function (data) {
            $scope.users = data;
        });

    }]);

    app.controller('leadsAdd', ['$scope', function ($scope) {

        $scope.title = 'Leads add form'

        // create a blank object to hold our form information
        // $scope will allow this to pass between controller and view
        $scope.formData = {};

        // process the form
        $scope.processForm = function () {
            $http({
                method: 'POST',
                url: 'lead/edit',
                data: $.param($scope.formData),  // pass in data as strings
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data) {
                    console.log(data);

                    if (!data.success) {
                        // if not successful, bind errors to error variables
                        //$scope.errorName = data.errors.name;
                        //$scope.errorSuperhero = data.errors.superheroAlias;
                    } else {
                        // if successful, bind success message to message
                        $scope.message = data.message;
                    }
                });
        };

    }]);

})();