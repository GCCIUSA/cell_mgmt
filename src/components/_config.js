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

    .run(["$rootScope", "$firebase",
        function ($rootScope, $firebase) {
            $rootScope.data = {
                "groups": [
                    {
                        "name": "",
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
                ]
            };

            // firebase global sync variable
            $rootScope.fbRef = new Firebase("https://blinding-fire-4264.firebaseio.com");
            $rootScope.fbSync = $firebase($rootScope.fbRef);

            console.log($rootScope.fbSync.$asArray());
        }
    ])
;