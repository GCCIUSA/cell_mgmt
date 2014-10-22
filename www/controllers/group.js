cgb
    .controller("GroupEditCtrl", ["$scope", "$state", "api",
        function ($scope, $state, api) {
            if ($state.current.name === "group.edit") {
                $scope.isNew = false;

                $scope.group = api.group.get();

                $scope.update = function () {
                    var data = {
                        "name": $scope.group.name,
                        "lang": $scope.group.lang,
                        "location": $scope.group.location,
                        "schedule": $scope.group.schedule,
                        "password": $scope.group.password
                    };

                    api.group.update(data).then(function (ref) {
                        $state.go("group.view", { "groupId": ref.name() });
                    });
                };
            }
            else {
                $scope.isNew = true;

                $scope.create = function () {
                    if (confirm("Are you sure to create this group?")) {
                        api.group.create($scope.group).then(function (ref) {
                            $state.go("group.view", { "groupId": ref.name() });
                        });
                    }
                };
            }
        }
    ])

    .controller("GroupViewCtrl", ["$scope", "api",
        function ($scope, api) {
            $scope.group = api.group.get();
        }
    ])
;