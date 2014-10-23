cgb
    .controller("MainCtrl", ["$scope", "$rootScope", "$state", "$ionicSideMenuDelegate", "$ionicPlatform", "api",
        function ($scope, $rootScope, $state, $ionicSideMenuDelegate, $ionicPlatform, api) {
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
                else if (state === "group.view") {
                   $state.go("home");
                }
                else if (state === "group.edit") {
                   $state.go("group.view", { 'groupId': $rootScope.groupId });
                }
                else if (state === "member.list") {
                   $state.go("home");
                }
                else if (state === "member.view") {
                   $state.go("member.list", { 'groupId': $rootScope.groupId });
                }
                else if (state === "member.edit") {
                   navigator.app.backHistory();
                }
                else if (state === "member.bd" || state === "member.login") {
                   $state.go("home");
                }
            }, 100);

            // reload the master data
            $scope.$on("DATA_RELOAD", function (event, type) {
                if (type === undefined || type === "group") {
                    api.group.get().$loaded().then(function (data) {
                        $rootScope.data.group = data;
                    });
                }
                if (type === undefined || type === "members") {
                    api.member.list().$loaded().then(function (data) {
                        $rootScope.data.members = data;
                    });
                }
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