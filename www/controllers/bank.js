cgb
    .controller("BankListCtrl", ["$scope", "$rootScope",
        function ($scope, $rootScope) {

        }
    ])

    .controller("BankViewCtrl", ["$scope", "$state", "util", "api",
        function ($scope, $state, util, api) {
            $scope.transaction = util.getTransaction($state.params.transactionId);

            $scope.remove = function () {
                navigator.notification.confirm("刪除這筆記錄?", function (btnIndex) {
                    if (btnIndex === 2) {
                        api.bank.delete($state.params.transactionId).then(function () {
                            $scope.$emit("DATA_RELOAD", "bank");
                            $state.go("bank.list");
                        });
                    }
                }, "Confirm", "Cancel,OK");
            };
        }
    ])

    .controller("BankEditCtrl", ["$scope", "$state", "api", "util",
        function ($scope, $state, api, util) {
            if ($state.params.transactionId == 0) {
                $scope.isNew = true;

                $scope.transaction = {
                    "date": new Date().toLocaleDateString(),
                    "type": "支出"
                };

                $scope.create = function () {
                    api.bank.create(util.formatJSON($scope.transaction)).then(function () {
                        $scope.$emit("DATA_RELOAD", "bank");
                        $state.go("bank.list");
                    });
                };
            }
            else {
                $scope.isNew = false;

                $scope.transaction = util.getTransaction($state.params.transactionId);

                $scope.update = function () {
                    var data = {
                        "type": $scope.transaction.type,
                        "purpose": $scope.transaction.purpose,
                        "date": $scope.transaction.date,
                        "amount": $scope.transaction.amount,
                        "note": $scope.transaction.note
                    };
                    api.bank.update($state.params.transactionId, util.formatJSON(data)).then(function () {
                        $scope.$emit("DATA_RELOAD", "bank");
                        $state.go("bank.list");
                    });
                };
            }
        }
    ])
;