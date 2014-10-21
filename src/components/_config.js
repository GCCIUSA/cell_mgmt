/*!
 * custom scripts
 */
var cgb = angular.module("cgb", ["ionic"]);

cgb
    .config(["$httpProvider",
        function ($httpProvider) {
            $httpProvider.defaults.xsrfCookieName = "csrftoken";
            $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
        }
    ])
;