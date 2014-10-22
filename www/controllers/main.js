cgb
    .controller("MainCtrl", ["$scope", "$rootScope", "$state", "$ionicSideMenuDelegate",
        function ($scope, $rootScope, $state, $ionicSideMenuDelegate) {
            document.addEventListener("deviceready", function () {
                document.addEventListener("backbutton", function (e) {
                    var state = $state.current.name;
                    if (state === "home") {
                        if (confirm("Exit the app?")) {
                            navigator.app.exitApp();
                        }
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

                    e.preventDefault();
                    e.stopPropagation();
                });
            });

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