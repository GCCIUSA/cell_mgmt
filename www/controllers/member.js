cgb
    .controller("MemberListCtrl", ["$scope", "util",
        function ($scope, util) {
            $scope.formatPhone = function (phone) {
                return util.formatPhone(phone);
            };
        }
    ])

    .controller("MemberEditCtrl", ["$scope", "$rootScope", "$state", "api", "util",
        function ($scope, $rootScope, $state, api, util) {
            if ($state.current.name === "member.edit") {
                $scope.isNew = false;

                $scope.member = util.getMember($state.params.memberId);

                // TODO update undefined field
                $scope.update = function () {
                    var data = {
                        "cnName": $scope.member.cnName,
                        "enName": $scope.member.enName,
                        "dob": util.formatDob($scope.member.dob),
                        "email": $scope.member.email,
                        "phone": $scope.member.phone
                    };
                    api.member.update(data).then(function () {
                        $scope.$emit("DATA_RELOAD", "members");
                        $state.go("member.list");
                    });
                };
            }
            else {
                $scope.isNew = true;

                $scope.create = function () {
                    $scope.member.dob = util.formatDob($scope.member.dob);
                    api.member.create($scope.member).then(function () {
                        $scope.$emit("DATA_RELOAD", "members");
                        $state.go("member.list");
                    });
                };
            }
        }
    ])

    .controller("MemberViewCtrl", ["$scope", "$state", "api", "util",
        function ($scope, $state, api, util) {
            $scope.member = util.getMember($state.params.memberId);

            $scope.remove = function () {
                if (confirm("Are you sure to delete this member?")) {
                    api.member.delete().then(function () {
                        $scope.$emit("DATA_RELOAD", "members");
                        $state.go("member.list");
                    });
                }
            };
        }
    ])

    .controller("MemberBdCtrl", ["$scope", "$rootScope", "util",
        function ($scope, $rootScope, util) {
            var i;

            $scope.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Unknown"];
            $scope.bdList = new Array($scope.months.length);
            for (i = 0; i < $scope.bdList.length; i++) {
                $scope.bdList[i] = [];
            }

            for (i = 0; i < $rootScope.data.members.length; i++) {
                if ($rootScope.data.members[i].dob !== undefined) {
                    $scope.bdList[$rootScope.data.members[i].dob.split("/")[0] - 1].push($rootScope.data.members[i]);
                }
                else {
                    $scope.bdList[$scope.bdList.length - 1].push($rootScope.data.members[i]);
                }
            }
            for (i = 0; i < $scope.bdList.length; i++) {
                $scope.bdList[i].sort(function (a, b) {
                    return a.dob.split("/")[1] - b.dob.split("/")[1];
                });
            }

            $scope.showName = function (member) {
                return util.showName(member);
            };
        }
    ])

    .controller("MemberLoginCtrl", ["$scope", "$rootScope", "$state", "api",
        function ($scope, $rootScope, $state, api) {
            $scope.login = function () {
                api.group.get().$loaded().then(function (data) {
                    if ($scope.password === data.password) {
                        $scope.showErrMsg = false;
                        $rootScope.loggedIn = true;
                        $state.go("group.view");
                    }
                    else {
                        $rootScope.loggedIn = false;
                        $scope.showErrMsg = true;
                    }
                });
            };
        }
    ])
;