cgb
    .factory("api", ["$resource", "$stateParams",
        function ($resource, $stateParams) {
            return {
                "group": $resource("",
                    { "groupId": $stateParams.groupId },
                    {
                        "get": { "method": "GET" },
                        "update": { "method": "PUT" },
                        "delete": { "method": "DELETE" }
                    }
                ),
                "member": $resource("",
                    { "memberId": $stateParams.memberId },
                    {
                        "list": { "method": "GET", "isArray": true },
                        "get": { "method": "GET" },
                        "update": { "method": "PUT" },
                        "delete": { "method": "DELETE" }
                    }
                )
            }
        }
    ])
;