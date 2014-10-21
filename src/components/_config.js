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
            $rootScope.data = {
                "group1": {
                    "name": "",
                    "lang": "Mandarin",
                    "location": "",
                    "schedule": "",
                    "members": [
                        {
                            "engName": "",
                            "chnName": "",
                            "dob": "",
                            "gender": "",
                            "email": "",
                            "phone": ""
                        }
                    ]
                }
            };
        }
    ])
;