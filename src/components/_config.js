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

    .run(["$rootScope",
        function ($rootScope) {
            $rootScope.groupId = "-JZpfbZLUH-Fwxc7IqWN";

            $rootScope.loginPassword = "jesus777";
            $rootScope.loggedIn = false;
        }
    ])
;