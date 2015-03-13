  /**
 * Created by Marek on 2015-03-13.
 */

(function(){
    var app = angular.module('crmApp',['ngRoute']);

    app.config(['$routeProvider', function($routeProvider) {

        $routeProvider
            .when('/leads', {
                templateUrl: 'views/leads/showLeads.html'
            })
            .when('/leads/add', {
                templateUrl: 'views/leads/addLead.html'
            })

        ;

    }]);

    app.controller('MainCtrl', ['$scope',  function($scope){

        $scope.message = 'sample message';

        $scope.users = [
            {
                'name': 'Janek',
                'surname': 'Kowalski',
                'position': 'Frontend',
                'salary': 'too small'
            },
            {
                'name': 'Janek',
                'surname': 'Nowak',
                'position': 'Backend',
                'salary': 'large'
            },
            {
                'name': 'Franek',
                'surname': 'Kowalski',
                'position': 'Frontend',
                'salary': 'too small'
            },
            {
                'name': 'Jozek',
                'surname': 'Kowalski',
                'position': 'Frontend',
                'salary': 'too small'
            },
            {
                'name': 'Anita',
                'surname': 'Kowalska',
                'position': 'Frontend',
                'salary': 'too small'
            },
            {
                'name': 'Janek',
                'surname': 'Kowalski',
                'position': 'Frontend',
                'salary': 'too small'
            },
            {
                'name': 'Janek',
                'surname': 'Kowalski',
                'position': 'Frontend',
                'salary': 'too small'
            },
        ]

    }]);

})();