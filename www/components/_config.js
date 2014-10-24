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

    .run(["$rootScope", "$ionicScrollDelegate", "$ionicLoading",
        function ($rootScope, $ionicScrollDelegate, $ionicLoading) {
            // default group id, will be dynamic in future release
            $rootScope.groupId = "-JZpfbZLUH-Fwxc7IqWN";

            // master data that holds the entire firebase obj
            $rootScope.data = { "group": null, "members": null, "bank": null, "balance": null };

            // determines if the user is logged in
            $rootScope.loggedIn = false;

            // scroll page to top on every state change
            $rootScope.$on("$stateChangeStart", function () {
                $ionicScrollDelegate.scrollTop(true);
            });

            // remove loading icon if presented
            $rootScope.$on("$stateChangeStart", function () {
                $ionicLoading.hide();
            });
        }
    ])
;