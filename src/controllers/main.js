cgb
    .controller("MainCtrl", ["$scope", "api",
        function ($scope, api) {
            api.group.get().$bindTo($scope, "test");
            setTimeout(function () { console.log(JSON.stringify($scope.test)); }, 2000);
        }
    ])

    .controller("HomeCtrl", ["$scope",
        function ($scope) {

        }
    ])
;