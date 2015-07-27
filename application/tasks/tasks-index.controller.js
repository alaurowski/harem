angular.module('crmApp').controller('TasksIndexCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.title = 'ToDo';
    $scope.tasks = [];

    $scope.loadTasks = function () {

        $http.get('task/index').success(function (data) {
            $scope.tasks = data;
        });
    };
    $scope.loadTasks();

    $scope.orderByColumn = '$index';
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
                    $.growl.notice({title: 'Good Job!', message: 'You\'ve successfully done task!'});

                    $scope.message = data.message;

                    $scope.loadTasks();
                }
                else {
                    swal('Error!', 'Something went wrong', 'error');
                }
            });

    };

    $scope.changeOrder = function (columnName) {
        if ($scope.orderByColumn == columnName) {
            $scope.orderByDir = !$scope.orderByDir;
        } else {
            $scope.orderByColumn = columnName;
            $scope.orderByDir = false;
        }
    };


}]);