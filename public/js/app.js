/**
 * Created by Marek on 2015-03-13.
 */

(function () {
    var app = angular.module('crmApp', ['ngRoute', 'crmService', 'ngTagsInput', 'ngResource', 'angularFileUpload']);

    var uniqueItems = function (data, key, subkey) {
        var result = [];

        for (var i = 0; i < data.length; i++) {
            var value = data[i][key];

            if (subkey)
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

            if (value) {
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
            .when('/leads/edit/:leadId', {
                controller: 'leadsEdit',
                templateUrl: 'views/leads/editLead.html'
            })
            .when('/tasks', {
                controller: 'TaskIndexCtrl',
                templateUrl: 'views/leads/showTasks.html'
            })
            .otherwise({
                redirectTo: 'views/leads/showLeads.html'
            });

    }]);


    app.controller('LeadDetailsCtrl', ['$scope', 'leads','$location', '$routeParams', '$http', 'FileUploader', function ($scope, leads,$location, $routeParams, $http, FileUploader) {

        $scope.lead = {};


        $scope.changeTaskStatus = function (task) {
            console.log(task);

            $http({
                method: 'POST',
                url: '/task/toggle/' + task._id,
                data: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data) {
                    console.log(data);
                    if (data.code === 200) {
                        $.growl.notice({title: "Good Job!", message: "You've successfully done task!"});

                        $scope.message = data.message;

                    }
                    else {
                        swal("Error!", 'Something went wrong', "error");
                    }
                });

        }

        $scope.test = [];

        leads.getLead(
            $routeParams.leadId,
            function (data) {
                $scope.lead = data;

                if (!$scope.lead.state.hasOwnProperty('code'))
                    $scope.lead.state = {code: 'new', name: 'New'};


                if (data.cv) {
                    $scope.cv = true;
                } else {
                    $scope.cv = false;
                }

                $scope.tags = data.tags;

                $scope.test = $scope.lead.contact.firstName;
            },
            function (data, status) {
                console.log(data);
                console.log(status);
            }
        );
        console.log($scope.lead);

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
                closeOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    $http.get('/note/delete/' + $index).success(function (data) {
                        console.log(data);
                        if (data.code === 200) {
                            $.growl.notice({title: "Good Job!", message: "Note has been deleted"});
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

        $scope.taskData = {owner: 'Natalia'};

        $scope.taskData.parentId = $routeParams.leadId;
        $scope.taskData.parentType = 'Lead';
        $scope.taskData.extra = '';

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
                        $.growl.notice({title: "Good Job!", message: "You've successfully added task!"});
                        $scope.message = data.message;

                        $scope.loadTasks();
                        $scope.addNewTask = false;

                    }
                    else {
                        swal("Error!", 'Something went wrong', "error");
                    }
                });
        };

        $scope.allStates = [];
        $scope.leadStatesNames = [];
        $scope.deleteTask = function ($index) {
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this task!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel plx!",
                closeOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    $http.get('/task/delete/' + $index).success(function (data) {
                        console.log(data);
                        if (data.code === 200) {
                            $.growl.notice({title: "Good Job!", message: "You've successfully added task!"});
                            $scope.message = data.message;
                            $scope.loadTasks();
                        }
                        else {
                            swal("Error!", 'Something went wrong', "error");
                        }
                    });
                } else {
                }
            });
        };


        $scope.tasks = [];

        $scope.loadTasks = function () {
            $http.get('/task/fetchall/' + $scope.taskData.parentId).success(function (data) {
                $scope.tasks = data;

                console.log($scope.tasks)
            });
        };

        $scope.loadTasks();

        $scope.addNewTask = false;
        //tasks end


        //States
        $scope.loadStates = function () {
            $http.get('/lead/states').success(function (data) {
                $scope.allStates = data;

                for (key in data) {
                    var ls = data[key];
                    $scope.leadStateNames[ls.code] = ls.name;
                }
            });
        };

        $scope.loadStates();


        $scope.lsName = function (code) {
            console.log(code);
        }

        $scope.updateState = function () {

            for (var key in $scope.allStates) {
                if ($scope.allStates[key].code == $scope.lead.state.code) {
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

                        $.growl.notice({title: "Good Job!", message: "You've successfully updated state!"});

                    }
                    else {
                        swal("Error!", 'Something went wrong', "error");
                    }
                });
        };

        $scope.deleteTask = function () {
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this lead!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel plx!",
                closeOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    $http.post('/lead/delete/' + $scope.lead._id).success(function (data) {
                        console.log(data);
                        if (data.code === 200) {
                            $.growl.notice({title: "Good Job!", message: "You've successfully removed lead"});
                            $scope.message = data.message;
                            $location.path('/');
                        }
                        else {
                            swal("Error!", 'Something went wrong', "error");
                        }
                    });
                } else {
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

        $http.get('lead/index').success(function (data) {
            $scope.users = data;

            if (data.cv) {
                $scope.cv = true;
            } else {
                $scope.cv = false;
            }
        });

        //States
        $scope.loadStates = function () {
            $http.get('/lead/states').success(function (data) {
                $scope.allStates = data;

                for (key in data) {
                    var ls = data[key];
                    $scope.leadStateNames[ls.code] = ls.name;
                }
            });
        };

        $scope.loadStates();


        $scope.lsName = function (code) {
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
                    if (subprop) el = el[prop];
                    return el[subprop] == value;
                };
            };

            $scope.countArray = function (prop, subprop, value) {
                return function (el) {
                    if (el[prop] && el[prop].length > 0) {

                        var found = false;
                        for (var t in el[prop]) {
                            var tag = el[prop][t];
                            if (tag[subprop] == value)
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

                        for (t in p.tags) {
                            var tag = p.tags[t];
                            if (tag && tag.text == i) {

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


    app.controller('TaskIndexCtrl', ['$scope', '$http', function ($scope, $http) {

        $scope.title = 'ToDo';
        $scope.tasks = [];

        $scope.loadTasks = function () {

            $http.get('task/index').success(function (data) {
                $scope.tasks = data;
            });
        };
        $scope.loadTasks();

        $scope.orderByColumn = '$index'
        $scope.orderByDir = false;

        $scope.changeStatus = function (task) {
            console.log(task);

            $http({
                method: 'POST',
                url: '/task/toggle/' + task._id,
                data: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data) {
                    console.log(data);
                    if (data.code === 200) {
                        $.growl.notice({title: "Good Job!", message: "You've successfully done task!"});

                        $scope.message = data.message;

                        $scope.loadTasks();
                    }
                    else {
                        swal("Error!", 'Something went wrong', "error");
                    }
                });

        }

        $scope.changeOrder = function (columnName) {
            if ($scope.orderByColumn == columnName) {
                $scope.orderByDir = !$scope.orderByDir;
            } else {
                $scope.orderByColumn = columnName;
                $scope.orderByDir = false;
            }
        }


    }]);


    app.controller('leadsAdd', ['$scope', '$location', '$http', 'FileUploader', function ($scope, $location, $http, FileUploader) {

        $scope.title = 'Leads add form'

        // create a blank object to hold our form information
        // $scope will allow this to pass between controller and view
        $scope.formData = {};

        $scope.formData.state = 'New';
        $scope.formData.owner = 'lead';

        $scope.cvFileUploaded = function (item, response, status, headers) {

            if (!$scope.formData.files) {
                $scope.formData.files = response;
            }
        }

        $scope.uploader = new FileUploader({

            url: "/file/insert",
            alias: "userfile",
            autoUpload: true,
            onSuccessItem: $scope.cvFileUploaded
        }); // file uploader

        $scope.processUpload = function () {
            console.log('Uploading file ..');
        }

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

    app.controller('leadsEdit', ['$scope', '$location', '$http','$routeParams', 'FileUploader','leads', function ($scope, $location, $http,$routeParams, FileUploader,leads) {

        $scope.title = 'Leads edit form'
        $scope.lead = {};
        $scope.leads = {};

        $scope.test = [];
        $scope.tags = [];


        leads.getLead(
            $routeParams.leadId,
            function (data) {
                $scope.lead = data;

                if (!$scope.lead.state.hasOwnProperty('code'))
                    $scope.lead.state = {code: 'new', name: 'New'};

                if (data.cv) {
                    $scope.cv = true;
                } else {
                    $scope.cv = false;
                }

                $scope.tags = data.tags;
                $scope.test = $scope.lead.contact.lastName;

                if (typeof $scope.lead.social === "undefined"){
                    $scope.lead.social = {
                        linkedin: '',
                        goldenline: '',
                        facebook: ''
                    }
                }

                $scope.formData = {
                    firstName: $scope.lead.contact.firstName,
                    lastName: $scope.lead.contact.lastName,
                    email: $scope.lead.contact.email,
                    phone: $scope.lead.contact.phone,
                    country: $scope.lead.contact.country,
                    subtitle: $scope.lead.subtitle,
                    linkedin: $scope.lead.social.linkedin,
                    goldenline: $scope.lead.social.goldenline,
                    facebook: $scope.lead.social.facebook,
                    source: $scope.lead.source.sourceName,
                    recommendedBy: $scope.lead.source.recommendedBy,
                    description: $scope.lead.description,
                    _id: $scope.lead._id,
                    tags: $scope.tags,
                    state: 'New',
                    owner: 'lead'
                }


            },
            function (data, status) {
                console.log(data);
                console.log(status);
            }
        );

        // create a blank object to hold our form information
        // $scope will allow this to pass between controller and view

        $scope.cvFileUploaded = function (item, response, status, headers) {

            if (!$scope.formData.files) {
                $scope.formData.files = response;
            }
        }

        $scope.uploader = new FileUploader({

            url: "/file/insert",
            alias: "userfile",
            autoUpload: true,
            onSuccessItem: $scope.cvFileUploaded
        }); // file uploader

        $scope.processUpload = function () {
            console.log('Uploading file ..');
        }

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
                        $scope.message = data.message;
                        //$scope.errorSuperhero = data.errors.superheroAlias;
                    }
                });
        };

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


        $scope.files = [];

        $scope.loadFile = function () {
            $http.get('/file/download/' + $scope.lead._id).success(function (data) {
                $scope.files = data;
            });
        };

        $scope.loadFile();



    }
    ]);


})();