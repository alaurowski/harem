/**
 * Created by Marek on 2015-03-13.
 */

(function () {
    var app = angular.module('crmApp', ['ngRoute', 'crmService', 'ngTagsInput', 'ngResource', 'angularFileUpload']);

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


    app.controller('LeadDetailsCtrl', ['$scope', 'leads', '$routeParams', '$http', 'FileUploader', function ($scope, leads, $routeParams, $http, FileUploader) {

        $scope.lead = {};

        leads.getLead(
            $routeParams.leadId,
            function (data) {
                $scope.lead = data;
                $scope.tags = data.tags;
                console.log($scope.lead);
            },
            function (data, status) {
                console.log(data);
                console.log(status);
            }
        );

        /**
         *
         */
        $scope.noteFileUploaded = function (item, response, status, headers) {

            if (!$scope.noteData.files) {
                $scope.noteData.files = new Array();

                $scope.noteData.files.push(response);
            }
        }

        $scope.uploader = new FileUploader({

            url: "/file/insert",
            alias: "userfile",
            autoUpload: true,
            onSuccessItem: $scope.noteFileUploaded
        }); // file uploader

        $scope.noteData = {type: 'Note', updatedAt: new Date()};

        $scope.noteData.parentId = $routeParams.leadId;

        /**
         * Uploading files
         */
        $scope.processUpload = function () {
            console.log('Uploading file ..');
        }


        $scope.saveTags = function () {
            $http({
                method: 'POST',
                url: '/lead/save_tags',
                data: {_id: $scope.lead._id, tags: $scope.tags},
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data) {
                    console.log(data);
                    if (data.code === 200) {
                        $scope.message = data.message;
                    }
                    else {
                        swal("Error!", 'Something went wrong', "error");
                    }
                });
        };


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
                        $.growl.notice({title: "Good Job!", message: "You've successfully added note!"});

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
            });
        };

        $scope.loadNotes();

        $scope.deleteNote = function ($index) {
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this note!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel plx!",
                closeOnConfirm: false
            }, function (isConfirm) {
                if (isConfirm) {
                    $http.get('/note/delete/' + $index).success(function (data) {
                        console.log(data);
                        if (data.code === 200) {
                            swal("Deleted!", "Note has been deleted.", "success");
                            $scope.message = data.message;
                            $scope.loadNotes();
                        }
                        else {
                            swal("Error!", 'Something went wrong', "error");
                        }
                    });
                } else {
                }
            });
        };


        //tasks

        $scope.taskData = [];

        $scope.taskData.parentId = $routeParams.leadId;

        $scope.processTask = function () {
            console.log($scope.taskData);
            $http({
                method: 'POST',
                url: '/task/insert',
                data: $.param($scope.taskData),  // pass in data as strings
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data) {
                    console.log(data);
                    if (data.code === 200) {
                        swal({
                            title: "Good Job!",
                            text: "You've successfully added task!",
                            type: "success",
                            confirmButtonText: "Close"
                        });

                        $scope.message = data.message;

                    }
                    else {
                        swal("Error!", 'Something went wrong', "error");
                    }
                });
        };


        //tasks end


        //States
        $scope.loadStates = function () {
            $http.get('/lead/states').success(function (data) {
                $scope.allStates = data;
            });
        };

        $scope.loadStates();

        $scope.updateState = function () {
            $http({
                method: 'POST',
                url: '/lead/change_state',
                data: {_id: $scope.lead._id, state: $scope.lead.state},
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data) {
                    if (data.code === 200) {
                        $scope.message = data.message;

                        $.growl.notice({title: "Good Job!", message: "You've successfully updated state!"});

                    }
                    else {
                        swal("Error!", 'Something went wrong', "error");
                    }
                });
        };

    }]);

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

        $http.get('lead/states').success(function (data) {
            $scope.leadStates = data;
        });


        $scope.actions = {
            updateState: function () {
                //if ($scope.filters.x) {
                //    $scope.filters.state = 'New';
                //    var a = $scope.filters.state.length;
                //} else if ($scope.filters.y) {
                //    $scope.filters.state = 'Employee';
                //} else {
                //    $scope.filters.state = '';
                //}
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