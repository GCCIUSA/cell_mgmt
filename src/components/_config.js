/*!
 * custom scripts
 */
var cgm = angular.module("cgm", ["ionic"]);

cgm
    .config(["$httpProvider",
        function ($httpProvider) {
            $httpProvider.defaults.xsrfCookieName = "csrftoken";
            $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
        }
    ])
;