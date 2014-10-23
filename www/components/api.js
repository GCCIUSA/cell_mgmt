cgb
    .factory("api", ["$rootScope", "$stateParams", "$firebase",
        function ($rootScope, $stateParams, $firebase) {
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
                    "get": function () {
                        return $firebase(ref.child($rootScope.groupId + "/members/" + $stateParams.memberId)).$asObject();
                    },
                    "create": function (data) {
                        return $firebase(ref.child($rootScope.groupId + "/members")).$push(data);
                    },
                    "update": function (data) {
                        return $firebase(ref.child($rootScope.groupId + "/members")).$update($stateParams.memberId, data);
                    },
                    "delete": function () {
                        return $firebase(ref.child($rootScope.groupId + "/members")).$remove($stateParams.memberId);
                    }
                }
            }
        }
    ])
;