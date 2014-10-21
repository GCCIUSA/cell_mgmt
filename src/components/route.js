cgb
    .config(["$stateProvider", "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/group/new");

            $stateProvider
                // group
                .state("group", {
                    "abstract": true,
                    "url": "/group",
                    "template": "<ui-view/>"
                })
                .state("group.new", {
                    "url": "/new",
                    "templateUrl": "views/group/edit.html",
                    "controller": "GroupEditCtrl"
                })
                .state("group.edit", {
                    "url": "/edit/:groupId",
                    "templateUrl": "views/group/edit.html",
                    "controller": "GroupEditCtrl"
                })

                // member
                .state("member", {
                    "abstract": true,
                    "url": "/member",
                    "template": "<ui-view/>"
                })
                .state("member.new", {
                    "url": "/new",
                    "templateUrl": "views/member/edit.html",
                    "controller": "MemberEditCtrl"
                })
                .state("member.edit", {
                    "url": "/edit",
                    "templateUrl": "views/member/edit.html",
                    "controller": "MemberEditCtrl"
                })
            ;
        }
    ])
;