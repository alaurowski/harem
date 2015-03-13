  /**
 * Created by Marek on 2015-03-13.
 */

(function(){
    var app = angular.module('crmApp',[]);

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