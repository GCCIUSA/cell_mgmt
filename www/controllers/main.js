cgb
    .controller("MainCtrl", ["$scope", "$rootScope", "$state", "$ionicSideMenuDelegate", "$ionicPlatform", "$ionicLoading", "$cordovaFile", "api", "util",
        function ($scope, $rootScope, $state, $ionicSideMenuDelegate, $ionicPlatform, $ionicLoading, $cordovaFile, api, util) {
            $ionicPlatform.ready(function () {
                // override and register hardware back button behavior
                $ionicPlatform.registerBackButtonAction(function () {
                    var state = $state.current.name;
                    if (state === "home") {
                        navigator.notification.confirm("Exit the app?", function (btnIndex) {
                            if (btnIndex === 2) {
                                navigator.app.exitApp();
                            }
                        }, "Confirm", ["Cancel", "OK"]);
                    }
                    // group views
                    else if (state === "group.join") {
                        if ($rootScope.groupId === null) {
                            navigator.notification.confirm("Exit the app?", function (btnIndex) {
                                if (btnIndex === 2) {
                                    navigator.app.exitApp();
                                }
                            }, "Confirm", ["Cancel", "OK"]);
                        }
                        else {
                            $state.go("home");
                        }
                    }
                    else if (state === "group.view") {
                        $state.go("home");
                    }
                    else if (state === "group.edit") {
                        navigator.app.backHistory();
                    }
                    else if (state === "group.new") {
                        $state.go("home");
                    }
                    // member views
                    else if (state === "member.list" || state === "member.bd" || state === "member.login") {
                        $state.go("home");
                    }
                    else if (state === "member.view" || state === "member.edit") {
                        navigator.app.backHistory();
                    }
                    // bank views
                    else if (state === "bank.list") {
                        $state.go("home");
                    }
                    else if (state === "bank.view" || state === "bank.edit") {
                        navigator.app.backHistory();
                    }
                }, 100);

                // check if data file exists
                $cordovaFile.checkFile($rootScope.dataFile).then(
                    function () {
                        // file exists, read file
                        $cordovaFile.readAsText($rootScope.dataFile).then(
                            function (content) {
                                if (content === "") {
                                    $state.go("group.join");
                                }
                                else {
                                    // check if group exists
                                    api.group.get(content).$loaded().then(function (data) {
                                        if (data.name === undefined) {
                                            // group does not exist
                                            $state.go("group.join");
                                        }
                                        else {
                                            // group exists
                                            $rootScope.groupId = content;
                                            $scope.reload();
                                            $state.go("group.view");
                                        }
                                    });
                                }
                            },
                            function () {
                                window.navigator.notification.alert("無法讀取小組數據");
                            }
                        );
                    },
                    function () {
                        // file does not exist, create file
                        $cordovaFile.createFile($rootScope.dataFile).then(
                            function () {
                                $state.go("group.join");
                            },
                            function () {
                                window.navigator.notification.alert("無法創建小組數據");
                            }
                        );
                    }
                );

                // reload the master data
                $scope.$on("DATA_RELOAD", function (event, type) {
                    $ionicLoading.show({ "template": "<i class='icon ion-refreshing'></i>" });

                    var loaded = 0, cnt = type === undefined ? 3 : 1;
                    if (type === undefined || type === "group") {
                        api.group.get().$loaded().then(function (data) {
                            $rootScope.data.group = data;
                            loadComplete();
                        });
                    }
                    if (type === undefined || type === "members") {
                        api.member.list().$loaded().then(function (data) {
                            $rootScope.data.members = data;

                            // reset birthday notification
                            // cancelAll() callback has bug, will update when it's fixed.
                            window.plugin.notification.local.getScheduledIds(function (scheduledIds) {
                                var member, dob, i;

                                // cancel all existing notifications
                                for (i = 0; scheduledIds.length > i; i++) {
                                    window.plugin.notification.local.cancel(scheduledIds[i]);
                                }

                                // add new notifications
                                for (i = 0; i < $rootScope.data.members.length; i++) {
                                    member = $rootScope.data.members[i];
                                    dob = util.toNotifyDate(member.dob);
                                    if (dob !== null) {
                                        window.plugin.notification.local.add({
                                            id: i,
                                            date: dob,
                                            repeat: "yearly",
                                            title: "生日提醒",
                                            message: "今天是" + util.getMemberName(member) + "的生日！"
                                        });
                                    }
                                }
                            });

                            loadComplete();
                        });
                    }
                    if (type === undefined || type === "bank") {
                        api.bank.list().$loaded().then(function (data) {
                            $rootScope.data.bank = data;
                            $rootScope.data.bank.sort(function (a, b) {
                                return a.date < b.date;
                            });

                            $rootScope.data.balance = 0;
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].type === "收入") {
                                    $rootScope.data.balance += data[i].amount;
                                }
                                else {
                                    $rootScope.data.balance -= data[i].amount;
                                }
                            }
                            $rootScope.data.balance = $rootScope.data.balance.toFixed(2);
                            loadComplete();
                        });
                    }

                    var loadComplete = function () {
                        if (++loaded === cnt) {
                            $ionicLoading.hide();
                        }
                    };
                });

                $scope.reload = function () {
                    $scope.$emit("DATA_RELOAD");
                };

                // selecting an item from left slide menu
                $scope.selectMenu = function (state) {
                    $state.go(state);
                    $ionicSideMenuDelegate.toggleLeft(false);
                };

                $scope.selectedMenu = function (state) {
                    return state === $state.current.name ? " active": "";
                };

                // toggle left slide menu
                $scope.toggleMenu = function () {
                    $ionicSideMenuDelegate.toggleLeft();
                };

                // logout current user
                $scope.logout = function () {
                    $rootScope.loggedIn = false;
                    $state.go("group.view");
                    $ionicSideMenuDelegate.toggleLeft(false);
                };
            });
        }
    ])

    .controller("HomeCtrl", ["$scope", "$rootScope", "$state",
        function ($scope, $rootScope, $state) {
            if ($rootScope.groupId === null) {
                $state.go("group.join");
            }
        }
    ])
;