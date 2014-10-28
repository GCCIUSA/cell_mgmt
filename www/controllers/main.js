cgb
    .controller("MainCtrl", ["$scope", "$rootScope", "$state", "$ionicSideMenuDelegate", "$ionicPlatform", "$ionicLoading", "api", "util",
        function ($scope, $rootScope, $state, $ionicSideMenuDelegate, $ionicPlatform, $ionicLoading, api, util) {
            // override and register hardware back button behavior
            $ionicPlatform.registerBackButtonAction(function () {
                var state = $state.current.name;
                if (state === "home") {
                    navigator.notification.confirm("Exit the app?", function (btnIndex) {
                        if (btnIndex === 2) {
                            navigator.app.exitApp();
                        }
                    }, "Confirm", "Cancel,OK");
                }
                // group views
                else if (state === "group.view") {
                   $state.go("home");
                }
                else if (state === "group.edit") {
                    navigator.app.backHistory();
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
                        document.addEventListener('deviceready', function () {
                            // cancelAll() callback has bug, will update when it's fixed.
                            // $cordovaLocalNotification.cancelAll().then(function () {});
                            window.plugin.notification.local.getScheduledIds(function (scheduledIds) {
                                var member, dob, i;

                                // cancel all existing notifications
                                for (i = 0; scheduledIds.length > i; i++) {
                                    window.plugin.notification.local.cancel(scheduledIds[i]);
                                }

                                // add new notifications
                                window.plugin.notification.local.add({
                                    id: 123,
                                    date: util.toDate("5/18"),
                                    repeat: "yearly",
                                    title: "生日提醒",
                                    message: "今天是test的生日！"
                                });
                                /* for (i = 0; i < $rootScope.data.members.length; i++) {
                                    member = $rootScope.data.members[i];
                                    dob = util.toDate(member.dob);
                                    if (dob !== null) {
                                        navigator.notification.alert(member.enName + "||" + dob);
                                        window.plugin.notification.local.add({
                                            id: member.$id,
                                            date: dob,
                                            repeat: "yearly",
                                            title: "生日提醒",
                                            message: "今天是" + util.getMemberName(member) + "的生日！"
                                        });
                                    }
                                } */
                            });
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
            $scope.reload();

            // selecting an item from left slide menu
            $scope.selectMenu = function (state) {
                $state.go(state);
                $ionicSideMenuDelegate.toggleLeft(false);
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
        }
    ])

    .controller("HomeCtrl", ["$scope",
        function ($scope) {

        }
    ])
;