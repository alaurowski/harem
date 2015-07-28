angular.module('crmApp').controller('LeadsDetailsCtrl',
    ['$scope', 'leads', '$location', '$routeParams', '$http', 'FileUploader', 'UsersFactory',
        function ($scope, leads, $location, $routeParams, $http, FileUploader, UsersFactory) {


            var usersFactory = UsersFactory.get();
            usersFactory.success(function (data) {
                $scope.usersList = data;
            });

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
                    var regex;
                    var matches;

                    $scope.lead = data;

                    if (!$scope.lead.state.hasOwnProperty('code'))
                        $scope.lead.state = {code: 'new', name: 'New'};


                    if (data.cv) {
                        $scope.cv = true;
                    } else {
                        $scope.cv = false;
                    }

                    $scope.lead.avatar = '<span class="ion-person"></span>';

                    /*
                    if ($scope.lead.contact.social.facebook != '') {
                        regex = /facebook\..*\/([^?]+)/i;
                        matches;
                        matches = regex.exec($scope.lead.contact.social.facebook);

                        if (matches) {
                            console.log(matches);
                            $scope.lead.avatar = '<img width="70" src="http://graph.facebook.com/' + matches[1] + '/picture?type=square" />';
                        }
                    }*/

                    $scope.tags = data.tags;

                    $scope.test = $scope.lead.contact.fullName;
                },
                function (data, status) {
                    console.log(data);
                    console.log(status);
                }
            );


            /**
             *
             */

            $scope.uploadError = false;
            $scope.noteFileUploaded = function (item, response, status, headers) {
                if (!$scope.noteData.files) {
                    $scope.noteData.files = new Array();
                }

                if(response.status == 'Error!' && response.code == 500) {
                    $scope.uploadError = true;
                }
                $scope.noteData.files.push(response);
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
                            $scope.noteData.content = '';
                            $scope.uploadError = false;
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

                    console.log(data);
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

                    for (var key in data) {
                        var ls = data[key];
                        if (typeof $scope.leadStateNames != "undefined") {
                            if ($scope.leadStateNames.hasOwnProperty(ls.code)) {
                                $scope.leadStateNames[ls.code] = ls.name;
                            }
                        }
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