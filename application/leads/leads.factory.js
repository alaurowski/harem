angular.module('crmFactory').factory('leads', ['$http', function($http){

    var _getLead = function (leadId, success, error) {

        success = success||function(){};
        error = error||function(){};

        $http.get('lead/fetch/'+leadId)
            .success(function (data) {
                success(data);
            })
            .error(error);

    };

    return {
        getLead: _getLead
    };
}]);