/**
 * Created by Marek on 2015-03-13.
 */

(function () {
    var app = angular.module('crmApp', ['ngRoute', 'crmService', 'ngTagsInput', 'ngResource']);

    app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider
            .when('/', {
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
            });

    }]);


    app.controller('LeadDetailsCtrl', ['$scope', 'leads', '$routeParams', '$http', function ($scope, leads, $routeParams, $http) {

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

        $scope.noteData.parentId = $routeParams.leadId;

        // process the form
        $scope.processNote = function () {
            console.log($scope.noteData);
            $http({
                method: 'POST',
                url: '/note/insert',
                data: $.param($scope.noteData),  // pass in data as strings
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data) {
                    console.log(data);
                    if (data.code === 200) {
                        swal({
                            title: "Good Job!",
                            text: "You've successfully added note!",
                            type: "success",
                            confirmButtonText: "Close"
                        });

                        $scope.message = data.message;

                        $scope.loadNotes();
                    }
                    else {
                        swal("Error!", 'Something went wrong', "error");
                    }
                });
        };

        $scope.notes = [];

        $scope.loadNotes = function () {
            $http.get('/note/fetchall/' + $scope.noteData.parentId).success(function (data) {
                $scope.notes = data;
                console.log($scope.notes);
            });
        };

        $scope.loadNotes();

        $scope.deleteNote = function () {

            if (!confirm('Are you sure?')) return;
            leads.deleteNote($scope.note._id, function () {

            })

        }

        $scope.tags = [
            {text: 'Tag1'},
            {text: 'Tag2'},
            {text: 'Tag3'}
        ];


    }]);

    var uniqueItems = function (data, key) {
        var result = [];

        for (var i = 0; i < data.length; i++) {
            var value = data[i][key];

            if (result.indexOf(value) == -1) {
                result.push(value);
            }

        }
        return result;
    };

    // SEARCH AND FILTER
    var uniqueItems = function (data, key) {
        var result = [];

        for (var i = 0; i < data.length; i++) {
            var value = data[i][key];

            if (result.indexOf(value) == -1) {
                result.push(value);
            }

        }
        return result;
    };

    app.controller('leadsIndex', ['$scope', '$http', function ($scope, $http) {

        $scope.title = 'Leads list';

        $scope.users = [];

        $http.get('lead/index').success(function (data) {
            $scope.users = data;
        });

        $scope.filters = {
            x: false,
            state: '',
            search: ''
        };

        $scope.actions = {
            updateState: function () {
                if ($scope.filters.x) {
                    $scope.filters.state = 'New';
                    var a = $scope.filters.state.length;
                } else if ($scope.filters.y) {
                    $scope.filters.state = 'Employee';
                } else {
                    $scope.filters.state = '';
                }
            }
        };


        $scope.orderByColumn = '$index'
        $scope.orderByDir = false;

        $scope.changeOrder = function (columnName) {
            if ($scope.orderByColumn == columnName) {
                $scope.orderByDir = !$scope.orderByDir;
            } else {
                $scope.orderByColumn = columnName;
                $scope.orderByDir = false;
            }
        }


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
                        $location.path('/leads/' + data.lead_id);
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
                });
        };
    }
    ]);


})();