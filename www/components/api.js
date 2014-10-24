cgb
    .factory("api", ["$rootScope", "$firebase",
        function ($rootScope, $firebase) {
            var ref = new Firebase("https://blinding-fire-4264.firebaseio.com");

            return {
                "group": {
                    "get": function () {
                        return $firebase(ref.child($rootScope.groupId)).$asObject();
                    },
                    "create": function (data) {
                        data["members"] = {};
                        return $firebase(ref).$push(data);
                    },
                    "update": function (data) {
                        return $firebase(ref).$update($rootScope.groupId, data);
                    },
                    "delete": function () {
                        return $firebase(ref).$remove($rootScope.groupId);
                    }
                },
                "member": {
                    "list": function () {
                        return $firebase(ref.child($rootScope.groupId + "/members")).$asArray();
                    },
                    "create": function (data) {
                        return $firebase(ref.child($rootScope.groupId + "/members")).$push(data);
                    },
                    "update": function (memberId, data) {
                        return $firebase(ref.child($rootScope.groupId + "/members")).$update(memberId, data);
                    },
                    "delete": function (memberId) {
                        return $firebase(ref.child($rootScope.groupId + "/members")).$remove(memberId);
                    }
                }
            }
        }
    ])
;