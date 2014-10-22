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

    .controller("MemberViewCtrl", ["$scope",
        function ($scope) {

        }
    ])
;