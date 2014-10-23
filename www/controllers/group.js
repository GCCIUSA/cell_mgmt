cgb
    .controller("GroupEditCtrl", ["$scope", "$rootScope", "$state", "api",
        function ($scope, $rootScope, $state, api) {
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

                    api.group.update(data).then(function () {
                        $scope.$emit("DATA_RELOAD", "group");
                        $state.go("group.view");
                    });
                };
            }
            else {
                $scope.isNew = true;

                $scope.create = function () {
                    if (confirm("Are you sure to create this group?")) {
                        api.group.create($scope.group).then(function (ref) {
                            $rootScope.groupId = ref.name();
                            $scope.$emit("DATA_RELOAD", "group");
                            $state.go("group.view");
                        });
                    }
                };
            }
        }
    ])

    .controller("GroupViewCtrl", ["$scope", "api",
        function ($scope, api) {

        }
    ])
;