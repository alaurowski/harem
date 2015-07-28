angular.module('crmApp').controller('LeadsAddCtrl', ['$scope', '$location', '$http', 'FileUploader', 'PositionsFactory',
    function ($scope, $location, $http, FileUploader, PositionsFactory) {

    $scope.title = 'Leads add form';

    // create a blank object to hold our form information
    // $scope will allow this to pass between controller and view
    $scope.formData = {};

    var positions = PositionsFactory.get();
    positions.success(function (data, status, headers, config) {
        $scope.positions = data;
    });

    $scope.$watch('formData.subtitle', function(a, b) {
        if(typeof a != "undefined" && typeof $scope.positions != "undefined") {
            $scope.positionsFiltered = $scope.positions.filter(positionFilter(a));
        } else {
            $scope.positionsFiltered = [];
        }
    });

    $scope.positionFill = function(name) {
        $scope.formData.subtitle = name;
    };

    $scope.formData.state = [];
    $scope.formData.state.code = 'new';
    $scope.formData.state.name = 'New';
    $scope.formData.owner = 'lead';


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
                    $scope.errorName = data.errors.name;
                    //$scope.errorSuperhero = data.errors.superheroAlias;
                }
            });
    };
}
]);