cgb
    .controller("MainCtrl", ["$scope", "$rootScope", "$state", "$ionicSideMenuDelegate", "$ionicPlatform",
        function ($scope, $rootScope, $state, $ionicSideMenuDelegate, $ionicPlatform) {
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

            $scope.selectMenu = function (state, params) {
                $state.go(state, params);
                $ionicSideMenuDelegate.toggleLeft(false);
            };

            $scope.openMenu = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.logout = function () {
                $rootScope.loggedIn = false;
                $state.go("group.view", { 'groupId': $rootScope.groupId });
                $ionicSideMenuDelegate.toggleLeft(false);
            };
        }
    ])

    .controller("HomeCtrl", ["$scope",
        function ($scope) {

        }
    ])
;