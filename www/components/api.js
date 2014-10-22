cgb
    .factory("api", ["$stateParams", "$firebase",
        function ($stateParams, $firebase) {
            var ref = new Firebase("https://blinding-fire-4264.firebaseio.com");

            return {
                "group": {
                    "get": function () {
                        return $firebase(ref.child($stateParams.groupId)).$asObject();
                    },
                    "create": function (data) {
                        data["members"] = {};
                        return $firebase(ref).$push(data);
                    },
                    "update": function (data) {
                        return $firebase(ref).$update($stateParams.groupId, data);
                    },
                    "delete": function () {
                        return $firebase(ref).$remove($stateParams.groupId);
                    }
                },
                "member": {
                    "list": function () {
                        return $firebase(ref.child($stateParams.groupId + "/members")).$asArray().$loaded();
                    },
                    "get": function () {
                        return $firebase(ref.child($stateParams.groupId + "/members/" + $stateParams.memberId)).$asObject();
                    },
                    "create": function (data) {
                        return $firebase(ref.child($stateParams.groupId + "/members")).$push(data);
                    },
                    "update": function (data) {
                        return $firebase(ref.child($stateParams.groupId + "/members")).$update($stateParams.memberId, data);
                    },
                    "delete": function () {
                        return $firebase(ref.child($stateParams.groupId + "/members")).$remove($stateParams.memberId);
                    }
                }
            }
        }
    ])
;