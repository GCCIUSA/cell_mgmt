/*!
 * custom scripts
 */
var cgb = angular.module("cgb", ["ionic", "firebase"]);

cgb
    .config(["$httpProvider",
        function ($httpProvider) {
            $httpProvider.defaults.xsrfCookieName = "csrftoken";
            $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
        }
    ])

    .run(["$rootScope", "$ionicScrollDelegate",
        function ($rootScope, $ionicScrollDelegate) {
            $rootScope.groupId = "-JZpfbZLUH-Fwxc7IqWN";

            $rootScope.loggedIn = false;

            $rootScope.$on("$stateChangeStart", function () {
                $ionicScrollDelegate.scrollTop(true);
            });
        }
    ])
;