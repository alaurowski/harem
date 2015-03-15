/**
 * Created by Marek on 2015-03-13.
 */

(function () {
    var app = angular.module('crmApp', ['ngRoute', 'crmService', 'ngTagsInput', 'ngResource', 'angularFileUpload']);

    var uniqueItems = function (data, key, subkey) {
        var result = [];

        for (var i = 0; i < data.length; i++) {
            var value = data[i][key];

            if(subkey)
                value = value[subkey];

            if (result.indexOf(value) == -1 && value) {
                result.push(value);
            }

        }
        return result;
    };

    var uniqueArrayItems = function (data, key, subkey) {
        var result = [];

        for (var i = 0; i < data.length; i++) {
            var value = data[i][key];

            if(value) {
                for (sk in value) {

                    var subarrayVal = value[sk];

                    if (subkey)
                        subarrayVal = subarrayVal[subkey];

                    if (result.indexOf(subarrayVal) == -1 && subarrayVal) {
                        result.push(subarrayVal);
                    }
                }
            }

        }
        return result;
    };



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

                if(!$scope.lead.state.hasOwnProperty('code'))
                    $scope.lead.state = {code: 'new', name: 'New'};

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

        $scope.noteData = { type: 'Note', updatedAt: new Date()};

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
            });
        };

        $scope.loadNotes();

        $scope.deleteNote = function () {

            if (!confirm('Are you sure?')) return;
            leads.deleteNote($scope.note._id, function () {

            })

        };

        $scope.allStates = [];
        $scope.leadStatesNames = [];
        //States
        $scope.loadStates = function () {
            $http.get('/lead/states').success(function (data) {
                $scope.allStates = data;

                for(key in data) {
                    var ls = data[key];
                    $scope.leadStateNames[ls.code] = ls.name;
                }
            });
        };

        $scope.loadStates();


        $scope.lsName = function(code){
            console.log(code);
        }

        $scope.updateState = function () {

            for(var key in $scope.allStates){
                if($scope.allStates[key].code == $scope.lead.state.code)
                {
                    $scope.lead.state = $scope.allStates[key];
                }
            }

            $http({
                method: 'POST',
                url: '/lead/change_state',
                data: {_id: $scope.lead._id, state: $scope.lead.state},
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data) {
                    if (data.code === 200) {
                        $scope.message = data.message;
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
        $scope.filteredUsers = [];
        $scope.useLeadStates = {};
        $scope.useTags = {};

        $scope.allStates = [];
        $scope.leadStateNames = [];
        //States
        $scope.loadStates = function () {
            $http.get('/lead/states').success(function (data) {
                $scope.allStates = data;

                for(key in data) {
                    var ls = data[key];
                    $scope.leadStateNames[ls.code] = ls.name;
                }
            });
        };

        $scope.loadStates();


        $scope.lsName = function(code){
            return $scope.leadStateNames[code];
        }

        // Watch the pants that are selected
        $scope.$watch(function () {
            return {
                users: $scope.users,
                filteredUsers: $scope.filteredUsers,
                useLeadStates: $scope.useLeadStates,
                useTags: $scope.useTags,
                leadStateNames: $scope.leadStateNames
            }
        }, function (value) {
            var selected;

            $scope.count = function (prop, subprop, value) {
                return function (el) {
                    if(subprop) el = el[prop];
                    return el[subprop] == value;
                };
            };

            $scope.countArray = function (prop, subprop, value) {
                return function (el) {
                    if(el[prop] && el[prop].length > 0) {

                        var found = false;
                        for(var t in el[prop])
                        {
                            var tag = el[prop][t];
                            if(tag[subprop] == value)
                                found = true;
                        }
                        return found;

                    }
                    return false;
                };
            };

            $scope.leadStatesGroup = uniqueItems($scope.filteredUsers, 'state', 'code');
            var filterAfterLeadStates = [];
            selected = false;
            for (var j in $scope.filteredUsers) {
                var p = $scope.filteredUsers[j];
                for (var i in $scope.useLeadStates) {
                    if ($scope.useLeadStates[i]) {
                        selected = true;
                        if (i == p.state.code) {
                            filterAfterLeadStates.push(p);
                            break;
                        }
                    }
                }
            }
            if (!selected) {
                filterAfterLeadStates = $scope.users;
            }

            $scope.tagsGroup = uniqueArrayItems($scope.filteredUsers, 'tags', 'text');
            var filteredAfterTags = [];
            selected = false;
            for (var j in $scope.filteredUsers) {
                var p = $scope.filteredUsers[j];
                for (var i in $scope.useTags) {
                    if ($scope.useTags[i]) {

                        for(t in p.tags){
                            var tag = p.tags[t];
                            if(tag && tag.text == i){

                                selected = true;

                                filteredAfterTags.push(p);
                                break;
                            }
                        }
                    }
                }
            }
            if (!selected) {
                filteredAfterTags = filterAfterLeadStates;
            }

            $scope.filteredUsers = filteredAfterTags;
        }, true);


        app.filter('groupBy',
            function () {
                return function (collection, key) {
                    if (collection === null) return;
                    return uniqueItems(collection, key);
                };
            });

        $scope.$watch('filtered', function (newValue) {
            if (angular.isArray(newValue)) {
                console.log(newValue.length);
            }
        }, true);

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
           /*     if ($scope.filters.x) {
                    $scope.filters.state = 'New';
                    var a = $scope.filters.state.length;
                } else if ($scope.filters.y) {
                    $scope.filters.state = 'Employee';
                } else {
                    $scope.filters.state = '';
                }*/
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
                        //swal({
                        //    title: "Good Job!",
                        //    text: "You've successfully added lead!",
                        //    type: "success",
                        //    confirmButtonText: "Close"
                        //});
                        $.growl.notice({ title: "Good Job!", message: "You've successfully added lead!" });

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