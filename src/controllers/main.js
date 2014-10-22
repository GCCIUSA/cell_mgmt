cgb
    .controller("MainCtrl", ["$scope", "$state", "$ionicSideMenuDelegate",
        function ($scope, $state, $ionicSideMenuDelegate) {
            $scope.selectMenu = function (state, params) {
                $state.go(state, params);
                $ionicSideMenuDelegate.toggleLeft(false);
            };

            $scope.openMenu = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };
        }
    ])

    .controller("HomeCtrl", ["$scope",
        function ($scope) {

        }
    ])
;