cgb
    .controller("GroupEditCtrl", ["$scope", "$rootScope", "$state", "api", "util", "$cordovaFile",
        function ($scope, $rootScope, $state, api, util, $cordovaFile) {
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
                            var genGroup = function () {
                                // generate 5 digit number
                                var groupId = Math.floor(Math.random() * 90000) + 10000;

                                // check if group exists
                                api.group.get(groupId).$loaded().then(function (data) {
                                    if (data.name === undefined) {
                                        // group does not exist, create group
                                        api.group.create(util.formatJSON($scope.group)).then(function (ref) {
                                            $cordovaFile.writeFile($rootScope.dataFile, ref.name(), { append: false }).then(
                                                function () {
                                                    $rootScope.groupId = ref.name();
                                                    $scope.$emit("DATA_RELOAD");
                                                    $state.go("group.view");
                                                },
                                                function () {
                                                    window.navigator.notification.alert("無法寫入小組數據");
                                                }
                                            );
                                        });
                                    }
                                    else {
                                        // group exists, re-generate
                                        genGroup();
                                    }
                                });
                            };

                            genGroup();
                        }
                    }, "Confirm", ["Cancel", "OK"]);
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
                        $cordovaFile.writeFile($rootScope.dataFile, $scope.joinGroupId, { append: false }).then(
                            function () {
                                $rootScope.groupId = $scope.joinGroupId;
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