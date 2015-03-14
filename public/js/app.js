/**
 * Created by Marek on 2015-03-13.
 */

(function () {
    var app = angular.module('crmApp', ['ngRoute', 'crmService']);

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
            })
            .when('/leads/:leadId', {
                controller: 'LeadDetailsCtrl',
                templateUrl: 'views/leads/singleLead.html'
            })
            .otherwise({
                redirectTo: 'views/leads/showLeads.html'
            })

        ;

    }]);


    app.controller('LeadDetailsCtrl', ['$scope', 'leads', '$routeParams', function ($scope, leads, $routeParams) {
        $scope.lead = {};
        leads.getLead(
            $routeParams.leadId,
            function (data) {
                $scope.lead = data;
                console.log($scope.lead);
            },
            function (data, status) {
                console.log(data);
                console.log(status);
            }
        );

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

    app.controller('leadsAdd', ['$scope', '$http', function ($scope, $http) {

        $scope.title = 'Leads add form'

        // create a blank object to hold our form information
        // $scope will allow this to pass between controller and view
        $scope.formData = {};

        // process the form
        $scope.processForm = function () {
            $http({
                method: 'POST',
                url: '/lead/edit',
                data: $scope.formData,  // pass in data as strings
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data) {
                    console.log(data);
                    if (!data.success) {
                        // if not successful, bind errors to error variables
                        swal("Error!", 'Something went wrong', "error");
                        $scope.errorName = data.errors.name;
                        //$scope.errorSuperhero = data.errors.superheroAlias;
                    } else {
                        // if successful, bind success message to message
                        swal("Good job!", "You've successfully added lead!", "success");
                        $scope.message = data.message;
                    }
                });
        };


    }]);


})();