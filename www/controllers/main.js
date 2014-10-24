cgb
    .controller("MainCtrl", ["$scope", "$rootScope", "$state", "$ionicSideMenuDelegate", "$ionicPlatform", "$ionicLoading", "api",
        function ($scope, $rootScope, $state, $ionicSideMenuDelegate, $ionicPlatform, $ionicLoading, api) {
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
            }, 100);

            // reload the master data
            $scope.$on("DATA_RELOAD", function (event, type) {
                $ionicLoading.show({ "template": "Loading..." });

                var loaded = 0, cnt = type === undefined ? 2 : 1;
                if (type === undefined || type === "group") {
                    api.group.get().$loaded().then(function (data) {
                        $rootScope.data.group = data;
                        loadComplete();
                    });
                }
                if (type === undefined || type === "members") {
                    api.member.list().$loaded().then(function (data) {
                        $rootScope.data.members = data;
                        loadComplete();
                    });
                }

                var loadComplete = function () {
                    if (++loaded === cnt) {
                        $ionicLoading.hide();
                    }
                };
            });
            $scope.$emit("DATA_RELOAD");

            // selecting an item from left slide menu
            $scope.selectMenu = function (state) {
                $state.go(state);
                $ionicSideMenuDelegate.toggleLeft(false);
            };

            // manually open the left slide menu
            $scope.openMenu = function () {
                $ionicSideMenuDelegate.toggleLeft(true);
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