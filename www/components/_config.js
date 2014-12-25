/*!
 * custom scripts
 */
var cgb = angular.module("cgb", ["ionic", "ngCordova", "firebase"]);

cgb
    .config(["$httpProvider",
        function ($httpProvider) {
            $httpProvider.defaults.xsrfCookieName = "csrftoken";
            $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
        }
    ])

    .run(["$rootScope", "$ionicScrollDelegate", "$ionicPlatform", "$state",
        function ($rootScope, $ionicScrollDelegate) {
            // data storage path
            $rootScope.dataFile = "cgb_data.dat";

            // default group id, will be dynamic in future release
            $rootScope.groupId = null;

            // master data that holds the entire firebase obj
            $rootScope.data = { "group": null, "members": null, "bank": null, "balance": null };

            // determines if the user is logged in
            $rootScope.loggedIn = false;

            // scroll page to top on every state change
            $rootScope.$on("$stateChangeStart", function () {
                $ionicScrollDelegate.scrollTop(true);
            });

            // google analytics
            /* $ionicPlatform.ready(function () {
                if (analytics !== undefined) {
                    analytics.debugMode();
                    analytics.startTrackerWithId("UA-56682607-2");
                    analytics.trackView($state.current.name);
                }
            }); */
        }
    ])
;