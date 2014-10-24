cgb
    .controller("GroupEditCtrl", ["$scope", "$rootScope", "$state", "api", "util",
        function ($scope, $rootScope, $state, api, util) {
            if ($state.current.name === "group.edit") {
                $scope.isNew = false;

                $scope.group = $rootScope.data.group;

                $scope.update = function () {
                    var data = {
                        "name": $scope.group.name,
                        "lang": $scope.group.lang,
                        "location": $scope.group.location,
                        "schedule": $scope.group.schedule,
                        "password": $scope.group.password
                    };

                    api.group.update(util.formatJSON(data)).then(function () {
                        $scope.$emit("DATA_RELOAD", "group");
                        $state.go("group.view");
                    });
                };
            }
            else {
                $scope.isNew = true;

                $scope.create = function () {
                    navigator.notification.confirm("Are you sure to create this group?", function (btnIndex) {
                        if (btnIndex === 2) {
                            api.group.create(util.formatJSON($scope.group)).then(function (ref) {
                                $rootScope.groupId = ref.name();
                                $scope.$emit("DATA_RELOAD", "group");
                                $state.go("group.view");
                            });
                        }
                    }, "Confirm", "Cancel,OK");
                };
            }
        }
    ])

    .controller("GroupViewCtrl", ["$scope", "api",
        function ($scope, api) {

        }
    ])
;