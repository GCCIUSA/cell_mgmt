cgb
    .factory("api", ["$rootScope", "$firebase", "$ionicLoading",
        function ($rootScope, $firebase, $ionicLoading) {
            var ref = new Firebase("https://blinding-fire-4264.firebaseio.com");

            var loading = function () {
                $ionicLoading.show({ "template": "<i class='icon ion-refreshing'></i>" });
            };

            return {
                "group": {
                    "get": function () {
                        return $firebase(ref.child($rootScope.groupId)).$asObject();
                    },
                    "create": function (data) {
                        loading();
                        data["members"] = {};
                        data["bank"] = {};
                        return $firebase(ref).$push(data);
                    },
                    "update": function (data) {
                        loading();
                        return $firebase(ref).$update($rootScope.groupId, data);
                    },
                    "delete": function () {
                        loading();
                        return $firebase(ref).$remove($rootScope.groupId);
                    }
                },
                "member": {
                    "list": function () {
                        return $firebase(ref.child($rootScope.groupId + "/members")).$asArray();
                    },
                    "create": function (data) {
                        loading();
                        return $firebase(ref.child($rootScope.groupId + "/members")).$push(data);
                    },
                    "update": function (memberId, data) {
                        loading();
                        return $firebase(ref.child($rootScope.groupId + "/members")).$update(memberId, data);
                    },
                    "delete": function (memberId) {
                        loading();
                        return $firebase(ref.child($rootScope.groupId + "/members")).$remove(memberId);
                    }
                },
                "bank": {
                    "list": function () {
                        return $firebase(ref.child($rootScope.groupId + "/bank")).$asArray();
                    },
                    "create": function (data) {
                        loading();
                        return $firebase(ref.child($rootScope.groupId + "/bank")).$push(data);
                    },
                    "update": function (transactionId, data) {
                        loading();
                        return $firebase(ref.child($rootScope.groupId + "/bank")).$update(transactionId, data);
                    },
                    "delete": function (transactionId) {
                        loading();
                        return $firebase(ref.child($rootScope.groupId + "/bank")).$remove(transactionId);
                    }
                }
            }
        }
    ])
;