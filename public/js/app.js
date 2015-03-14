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


    app.controller('LeadDetailsCtrl', ['$scope', 'leads', '$routeParams','$http', function ($scope, leads, $routeParams, $http) {
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



        $scope.noteData = {};

        // process the form
        $scope.processNote = function () {
            $http({
                method: 'POST',
                url: '/note/insert',
                data: $.param($scope.noteData),  // pass in data as strings
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data) {
                    console.log(data);
                    if (data.code === 200) {
                        // if successful, bind success message to message
                        $location.path('/leads');
                        swal({
                            title: "Good Job!",
                            text: "You've successfully added lead!",
                            type: "success",
                            confirmButtonText: "Close"
                        });

                        $scope.message = data.message;
                    }
                    else {
                        swal("Error!", 'Something went wrong', "error");
                        //$scope.errorName = data.errors.name;
                        //$scope.errorSuperhero = data.errors.superheroAlias;
                    }
                });
        };



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

    app.controller('leadsAdd', ['$scope', '$location', '$http', function ($scope, $location, $http) {

        $scope.title = 'Leads add form'

        // create a blank object to hold our form information
        // $scope will allow this to pass between controller and view
        $scope.formData = {};

        // process the form
        $scope.processForm = function () {
            $http({
                method: 'POST',
                url: '/lead/edit',
                data: $.param($scope.formData),  // pass in data as strings
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data) {
                    console.log(data);
                    if (data.code === 200) {
                        // if successful, bind success message to message
                        $location.path('/leads');
                        swal({
                            title: "Good Job!",
                            text: "You've successfully added lead!",
                            type: "success",
                            confirmButtonText: "Close"
                        });

                        $scope.message = data.message;
                    }
                    else {
                        swal("Error!", 'Something went wrong', "error");
                        $scope.errorName = data.errors.name;
                        //$scope.errorSuperhero = data.errors.superheroAlias;
                    }
                }
            )
            ;
        };


    }
    ])
    ;


})();