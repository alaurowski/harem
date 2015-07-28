angular.module('crmApp', ['ngRoute', 'crmFactory', 'ngTagsInput', 'ngResource', 'angularFileUpload', 'ngSanitize']);

angular.module('crmApp').config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/', {
            controller: 'LeadsIndexCtrl',
            templateUrl: 'views/leads/leads-index.view.html'
        })
        .when('/leads/add', {
            controller: 'LeadsAddCtrl',
            templateUrl: 'views/leads/leads-add.view.html'
        })
        .when('/leads/:leadId', {
            controller: 'LeadsDetailsCtrl',
            templateUrl: 'views/leads/leads-details.view.html'
        })
        .when('/leads/edit/:leadId', {
            controller: 'LeadsEditCtrl',
            templateUrl: 'views/leads/leads-edit.view.html'
        })
        .when('/tasks', {
            controller: 'TasksIndexCtrl',
            templateUrl: 'views/tasks/tasks-index.view.html'
        })
        .otherwise({
            redirectTo: '/'
        });

}])
.run(['$rootScope', '$window', '$http', function($rootScope, $window, $http) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        var auth = $http.get('/auth/check');

        auth
            .success(function(data, status) {
                $rootScope.login = true;
            })
            .error(function(data, status) {
                $window.location.href = "/login";
                $rootScope.login = false;
            });
    });
}]);