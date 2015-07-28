angular.module('crmApp').controller('LeadsEditCtrl',
    ['$scope', '$location', '$http','$routeParams', 'FileUploader','leads', 'PositionsFactory', 'UsersFactory',
    function ($scope, $location, $http,$routeParams, FileUploader,leads, PositionsFactory, UsersFactory) {

    $scope.title = 'Leads edit form'
    $scope.lead = {};
    $scope.leads = {};

    var usersFactory = UsersFactory.get();
    usersFactory.success(function(data) {
        $scope.usersList = data;
    });

    var positions = PositionsFactory.get();
    positions.success(function (data, status, headers, config) {
        $scope.positions = data;
    });

    $scope.$watch('formData.subtitle', function(a, b) {
        if(typeof a != "undefined") {
            $scope.positionsFiltered = $scope.positions.filter(positionFilter(a));
        } else {
            $scope.positionsFiltered = [];
        }
    });

    $scope.positionFill = function(name) {
        $scope.formData.subtitle = name;
    };

    $scope.test = [];
    $scope.tags = [];


    leads.getLead(
        $routeParams.leadId,
        function (data) {
            $scope.lead = data;

            console.log(data);
            if (!$scope.lead.state.hasOwnProperty('code'))
                $scope.lead.state = {code: 'new', name: 'New'};

            if (data.cv) {
                $scope.cv = true;
            } else {
                $scope.cv = false;
            }

            $scope.tags = data.tags;
            $scope.test = $scope.lead.contact.lastName;

            $scope.formData = {
                fullName: $scope.lead.contact.fullName,
                email: $scope.lead.contact.email,
                phone: $scope.lead.contact.phone,
                companyName: $scope.lead.contact.companyName,
                companyPosition: $scope.lead.contact.companyPosition,
                city: $scope.lead.contact.city,
                country: $scope.lead.contact.country,
                subtitle: $scope.lead.subtitle,
                linkedin: $scope.lead.contact.social.linkedin,
                goldenline: $scope.lead.contact.social.goldenline,
                facebook: $scope.lead.contact.social.facebook,
                source: $scope.lead.source.sourceName,
                recommendedBy: $scope.lead.source.recommendedBy,
                description: $scope.lead.description,
                _id: $scope.lead._id,
                tags: $scope.tags,
                state: 'New',
                owner: $scope.lead.owner
            }


        },
        function (data, status) {
            console.log(data);
            console.log(status);
        }
    );

    // create a blank object to hold our form information
    // $scope will allow this to pass between controller and view

        $scope.uploadError = false;
        $scope.cvFileUploaded = function (item, response, status, headers) {

            if(response.status == 'Error!' && response.code == 500) {
                $scope.uploadError = true;
            }

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
                    $scope.uploadError = false;
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