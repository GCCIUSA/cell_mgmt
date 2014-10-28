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

    .controller("GroupJoinCtrl", ["$scope", "$rootScope", "api", "$state", "$cordovaFile",
        function ($scope, $rootScope, api, $state, $cordovaFile) {
            $scope.join = function () {
                // check if group exists
                api.group.get($scope.joinGroupId).$loaded().then(function (data) {
                    if (data.name === undefined) {
                        // group does not exist
                        $scope.showErrMsg = true;
                    }
                    else {
                        // group exists
                        $scope.showErrMsg = false;
                        $rootScope.groupId = $scope.joinGroupId;

                        $cordovaFile.writeFile($rootScope.dataFile, $scope.joinGroupId, { append: false }).then(
                            function () {
                                $scope.$emit("DATA_RELOAD");
                                $state.go("group.view");
                            },
                            function () {
                                window.navigator.notification.alert("無法寫入小組數據");
                            }
                        );
                    }
                });
            };
        }
    ])

    .controller("GroupViewCtrl", ["$scope", "api",
        function ($scope, api) {

        }
    ])
;