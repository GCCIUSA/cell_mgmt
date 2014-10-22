cgb
    .controller("MainCtrl", ["$scope", "$rootScope", "$state", "$ionicSideMenuDelegate",
        function ($scope, $rootScope, $state, $ionicSideMenuDelegate) {
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