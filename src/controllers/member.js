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
            var formatDob = function (dob) {
                var splitted = dob.split("/");

                if (dob.substr(0, 1) === "0") {
                    dob = dob.substr(1);
                }
                if (splitted[1].substr(0, 1) === "0") {
                    dob = splitted[0] + "/" + splitted[1].substr(1);
                }

                return dob;
            };

            if ($state.current.name === "member.edit") {
                $scope.isNew = false;

                $scope.member = api.member.get();

                $scope.update = function () {
                    var data = {
                        "cnName": $scope.member.cnName,
                        "enName": $scope.member.enName,
                        "dob": formatDob($scope.member.dob),
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
                    $scope.member.dob = formatDob($scope.member.dob);
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

    .controller("MemberBdCtrl", ["$scope", "api", "util",
        function ($scope, api, util) {
            var i;

            $scope.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Unknown"];
            $scope.bdList = new Array($scope.months.length);
            for (i = 0; i < $scope.bdList.length; i++) {
                $scope.bdList[i] = [];
            }

            api.member.list().then(function (data) {
                for (i = 0; i < data.length; i++) {
                    if (data[i].dob !== undefined) {
                        $scope.bdList[data[i].dob.split("/")[0] - 1].push(data[i]);
                    }
                    else {
                        $scope.bdList[$scope.bdList.length - 1].push(data[i]);
                    }
                }
                for (i = 0; i < $scope.bdList.length; i++) {
                    $scope.bdList[i].sort(function (a, b) {
                        return a.dob.split("/")[1] - b.dob.split("/")[1];
                    });
                }
            });

            $scope.showName = function (member) {
                return util.showName(member);
            };
        }
    ])

    .controller("MemberLoginCtrl", ["$scope", "$rootScope", "$state",
        function ($scope, $rootScope, $state) {
            $scope.login = function () {
                if ($scope.password === $rootScope.loginPassword) {
                    $scope.showErrMsg = false;
                    $rootScope.loggedIn = true;
                    $state.go("group.view", { 'groupId': $rootScope.groupId });
                }
                else {
                    $rootScope.loggedIn = false;
                    $scope.showErrMsg = true;
                }
            };
        }
    ])
;