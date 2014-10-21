cgb
    .factory("api", ["$stateParams", "$firebase",
        function ($stateParams, $firebase) {
            var ref = new Firebase("https://blinding-fire-4264.firebaseio.com");

            return {
                "group": {
                    "get": function () {
                        var sync = $firebase(ref);
                        var changedData = { bar: { hello: "world"} };
                        sync.$update(changedData);

                        return $firebase(ref.child("test")).$asObject();
                    },
                    "create": function (data) {

                    },
                    "update": function (data) {

                    },
                    "delete": function () {

                    }
                },
                "member": {
                    "create": function (data) {

                    }
                }
            }
        }
    ])
;