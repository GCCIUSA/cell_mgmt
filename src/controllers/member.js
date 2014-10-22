cgb
    .controller("MemberListCtrl", ["$scope", "$state", "api", "util",
        function ($scope, $state, api, util) {
            api.member.list().then(function (data) {
                $scope.members = data;
            });

            $scope.formatPhone = function (phone) {
                return util.formatPhone(phone);
            };

            $scope.addNew = function () {
                $state.go("member.new", { "groupId": $state.params.groupId });
            };
        }
    ])

    .controller("MemberEditCtrl", ["$scope", "$state", "api",
        function ($scope, $state, api) {
            if ($state.current.name === "member.edit") {
                $scope.isNew = false;

                $scope.member = api.member.get();

                $scope.update = function () {
                    var data = {
                        "cnName": $scope.member.cnName,
                        "enName": $scope.member.enName,
                        "dob": $scope.member.dob,
                        "email": $scope.member.email,
                        "phone": $scope.member.phone
                    };
                    api.member.update(data).then(function () {
                        $state.go("member.list", { "groupId": $state.params.groupId });
                    });
                };
            }
            else {
                $scope.isNew = true;

                $scope.create = function () {
                    api.member.create($scope.member).then(function () {
                        $state.go("member.list", { "groupId": $state.params.groupId });
                    });
                };
            }
        }
    ])

    .controller("MemberViewCtrl", ["$scope", "$state", "api",
        function ($scope, $state, api) {
            $scope.member = api.member.get();

            $scope.remove = function () {
                if (confirm("Are you sure to delete this member?")) {
                    api.member.delete().then(function () {
                        $state.go("member.list", { "groupId": $state.params.groupId });
                    });
                }
            };
        }
    ])
;