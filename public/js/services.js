(function(){

    var app = angular.module('crmService', []);

    app.factory('leads', ['$http', function($http){

        var _getLead = function (leadId, success, error) {

            success = success||function(){};
            error = error||function(){};

            $http.get('lead/fetch/'+leadId)
                .success(function (data) {
                    success(data);
                })
                .error(error);

        };

        var _deleteNote = function(clientId, success){

            success = success||function(){};
            $http.post('/note/delete/:'+ note_id)
                .success(success);

        };

        return {
            getLead: _getLead,
            deleteNote: _deleteNote
        };
    }]);


})();