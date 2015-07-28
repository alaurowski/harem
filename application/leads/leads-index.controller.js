angular.module('crmApp').controller('LeadsIndexCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {

    $scope.title = 'Leads list';

    $scope.users = [];
    $scope.filteredUsers = [];
    $scope.useLeadStates = {};
    $scope.useTags = {};

    $scope.allStates = [];
    $scope.leadStateNames = [];
    $scope.pages = [];

    $scope.perPage = 10;
    $scope.currentPage = 1;
    $scope.searchQuery = '';

    $scope.statusSearch = [];
    $scope.selectedTags = [];
    $scope.toggleTagSelection = function toggleTagSelection(tag) {
        var idx = $scope.selectedTags.indexOf(tag);
        if (idx > -1) {
            $scope.selectedTags.splice(idx, 1);
        }
        else {
            $scope.selectedTags.push(tag);
        }

        $scope.loadLeads();
    };

    $scope.currentPage = 1;
    $scope.emptySearchResults = false;
    $scope.loadLeads = function () {

        $http.post('lead/index/' + $scope.currentPage + '/' + $scope.perPage, {
            q_status: $scope.statusSearch.join(','),
            q_search: $scope.searchQuery,
            q_tags: $scope.selectedTags.join(',')
        }).success(function (data) {

            console.log(data.pages);
            $scope.users = data.result;
            $scope.pages = data.pages;

            if (data.cv) {
                $scope.cv = true;
            } else {
                $scope.cv = false;
            }
            if ($scope.users.length < 1) {
                $scope.emptySearchResults = true;
            } else {
                $scope.emptySearchResults = false;
            }

            var ranges = [];

            for (var i = 0; i < $scope.pages; i++) {
                ranges.push(i + 1);
            }
            $scope.ranges = ranges;
            console.log(ranges);
            $scope.activePage = $scope.currentPage;

        });
    };

    $scope.loadLeads();

    // reste filters

    $scope.resetFilters = function () {
        var checkboxes = new Array();
        checkboxes = document.getElementsByTagName('input');

        for (var i=0; i<checkboxes.length; i++)  {
            if (checkboxes[i].type == 'checkbox')   {
                checkboxes[i].checked = false;
            }
        }

        $scope.searchQuery = '';

        $scope.statusSearch = [];
        $scope.selectedTags = [];
        $scope.loadLeads();
    };

    //pagination

    $scope.pagination = function (page, items) {
        $scope.currentPage = page;
        $scope.perPage = items;

        $scope.loadLeads();
        /*$http.post('/lead/index/' + page + '/' + items, {q_search: $scope.searchQuery}).success(function (data) {
            $scope.users = data.result;
            $scope.pages = data.pages;

            $scope.activePage = page;

        });*/
    };


    //States
    $scope.loadStates = function () {
        $http.get('/lead/states').success(function (data) {
            $scope.allStates = data;

            for (var key in data) {
                var ls = data[key];
                $scope.leadStateNames[ls.code] = ls.name;
            }
        });
    };

    $scope.loadStates();


    $scope.lsName = function (code) {
        return $scope.leadStateNames[code];
    }

    // Watch the pants that are selected
    $scope.$watch(function () {
        return {
            users: $scope.users,
            filteredUsers: $scope.filteredUsers,
            useLeadStates: $scope.useLeadStates,
            useTags: $scope.useTags,
            leadStateNames: $scope.leadStateNames
        }
    }, function (value) {
        var selected;

        $scope.count = function (prop, subprop, value) {
            return function (el) {
                if (subprop) el = el[prop];
                return el[subprop] == value;
            };
        };

        $scope.countArray = function (prop, subprop, value) {
            return function (el) {
                if (el[prop] && el[prop].length > 0) {

                    var found = false;
                    for (var t in el[prop]) {
                        var tag = el[prop][t];
                        if (tag[subprop] == value)
                            found = true;
                    }
                    return found;

                }
                return false;
            };
        };

        $scope.leadStatesGroup = uniqueItems($scope.filteredUsers, 'state', 'code');
        var filterAfterLeadStates = [];
        selected = false;
        for (var j in $scope.filteredUsers) {
            var p = $scope.filteredUsers[j];
            for (var i in $scope.useLeadStates) {
                if ($scope.useLeadStates[i]) {
                    selected = true;
                    if (i == p.state.code) {
                        filterAfterLeadStates.push(p);
                        break;
                    }
                }
            }
        }
        if (!selected) {
            filterAfterLeadStates = $scope.users;
        }

        $scope.tagsGroup = uniqueArrayItems($scope.filteredUsers, 'tags', 'text');
        var filteredAfterTags = [];
        selected = false;
        for (var j in $scope.filteredUsers) {
            var p = $scope.filteredUsers[j];
            for (var i in $scope.useTags) {
                if ($scope.useTags[i]) {

                    for (t in p.tags) {
                        var tag = p.tags[t];
                        if (tag && tag.text == i) {

                            selected = true;

                            filteredAfterTags.push(p);
                            break;
                        }
                    }
                }
            }
        }
        if (!selected) {
            filteredAfterTags = filterAfterLeadStates;
        }

        $scope.filteredUsers = filteredAfterTags;
    }, true);


    $scope.$watch('filtered', function (newValue) {
        if (angular.isArray(newValue)) {
            console.log(newValue.length);
        }
    }, true);


    $scope.listState = [];
    $scope.stateListChanged = function (code) {
        if ($scope.listState[code]) {
            $scope.statusSearch.push(code);
        } else {
            var array = [2, 5, 9];
            var index = $scope.statusSearch.indexOf(code);
            if (index > -1) {
                $scope.statusSearch.splice(index, 1);
            }
            console.log($scope.statusSearch);
        }
    };


    $scope.filters = {
        x: false,
        state: [],
        search: ''
    };

    $http.get('lead/states').success(function (data) {
        $scope.leadStates = data;
    });


    $scope.actions = {
        updateState: function () {
            //if ($scope.filters.x) {
            //    $scope.filters.state = 'New';
            //    var a = $scope.filters.state.length;
            //} else if ($scope.filters.y) {
            //    $scope.filters.state = 'Employee';
            //} else {
            //    $scope.filters.state = '';
            //}
        }
    };


    $scope.orderByColumn = '$index'
    $scope.orderByDir = false;

    $scope.changeOrder = function (columnName) {
        if ($scope.orderByColumn == columnName) {
            $scope.orderByDir = !$scope.orderByDir;
        } else {
            $scope.orderByColumn = columnName;
            $scope.orderByDir = false;
        }
    };

    $scope.isOrderedBy = function (columnName) {
        return ($scope.orderByColumn == columnName);
    };

    $scope.isOrderedReverse = function () {
        return !$scope.orderByDir;
    };


    // states

    $scope.statesLength = false;
    $scope.leadsStates = [];

    $scope.loadTags = function () {
        $http.get('/lead/states').success(function (data) {
            $scope.leadsStates = data;

            if ($scope.leadsStates.length < 1) {
                $scope.statesLength = false;
            } else {
                $scope.statesLength = true;
            }
        });
    };

    $scope.loadTags();

    //tags

    $scope.leadsTags = [];
    $scope.tagsLength = false;

    $scope.loadTags = function () {
        $http.get('/lead/tags/fetch_all').success(function (data) {
            $scope.leadsTags = data;

            if ($scope.leadsTags.length < 1) {
                $scope.tagsLength = false;
            } else {
                $scope.tagsLength = true;
            }

        });
    };

    $scope.loadTags();

}]);