'use strict';

angular.module('crmApp', ['ngRoute', 'crmFactory', 'ngTagsInput', 'ngResource', 'angularFileUpload']);

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
            redirectTo: 'views/leads/leads-index.view.html'
        });

}]);