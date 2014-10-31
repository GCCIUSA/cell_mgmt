cgb
    .controller("GroupEditCtrl", ["$scope", "$rootScope", "$state", "api", "util", "$cordovaFile",
        function ($scope, $rootScope, $state, api, util, $cordovaFile) {
            if ($state.current.name === "group.edit") {
                $scope.isNew = false;

                $scope.group = $rootScope.data.group;

                $scope.update = function () {
                    if ($scope.group === undefined || util.isBlank($scope.group.name)) {
                        window.navigator.notification.alert("請輸入小組名稱");
                    }
                    else {
                        util.loading("on");
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
                    }
                };
            }
            else {
                $scope.isNew = true;

                $scope.create = function () {
                    if ($scope.group === undefined || util.isBlank($scope.group.name)) {
                        window.navigator.notification.alert("請輸入小組名稱");
                    }
                    else {
                        navigator.notification.confirm("確定創建小組嗎？", function (btnIndex) {
                            if (btnIndex === 2) {
                                util.loading("on");
                                api.group.create(util.formatJSON($scope.group)).then(function (ref) {
                                    $cordovaFile.writeFile($rootScope.dataFile, ref.name(), { append: false }).then(
                                        function () {
                                            $rootScope.groupId = ref.name();
                                            $scope.$emit("DATA_RELOAD");
                                            $state.go("group.view");
                                        },
                                        function () {
                                            util.loading("off");
                                            window.navigator.notification.alert("無法寫入小組數據");
                                        }
                                    );
                                });
                            }
                        }, "Confirm", ["Cancel", "OK"]);
                    }
                };
            }
        }
    ])

    .controller("GroupJoinCtrl", ["$scope", "$rootScope", "api", "$state", "$cordovaFile", "util",
        function ($scope, $rootScope, api, $state, $cordovaFile, util) {
            $scope.join = function () {
                if (!util.isBlank($scope.joinGroupId)) {
                    // check if group exists
                    util.loading("on");
                    api.group.get($scope.joinGroupId).$loaded().then(function (data) {
                        if (data.name === undefined) {
                            // group does not exist
                            util.loading("off");
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
                                    util.loading("off");
                                    window.navigator.notification.alert("無法寫入小組數據");
                                }
                            );
                        }
                    });
                }
                else {
                    $scope.showErrMsg = true;
                }
            };
        }
    ])

    .controller("GroupViewCtrl", ["$scope", "$cordovaClipboard", "$cordovaToast",
        function ($scope, $cordovaClipboard, $cordovaToast) {
            $scope.copy = function (groupId) {
                $cordovaClipboard.copy(groupId).then(function () {
                    $cordovaToast.showShortCenter("小組ID已複製");
                });
            };
        }
    ])
;