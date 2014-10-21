cgb
    .config(["$stateProvider", "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/home");

            var setView = function (path) {
                return "views/" + path + ".html";
            };

            $stateProvider
                //home
                .state("home", {
                    "url": "/home",
                    "templateUrl": setView("home"),
                    "controller": "HomeCtrl"
                })

                // group
                .state("group", {
                    "abstract": true,
                    "url": "/group",
                    "template": "<ui-view/>"
                })
                .state("group.new", {
                    "url": "/new",
                    "templateUrl": setView("group/edit"),
                    "controller": "GroupEditCtrl"
                })
                .state("group.edit", {
                    "url": "/edit/:groupId",
                    "templateUrl": setView("group/edit"),
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
                    "templateUrl": setView("member/edit"),
                    "controller": "MemberEditCtrl"
                })
                .state("member.edit", {
                    "url": "/edit",
                    "templateUrl": setView("member/edit"),
                    "controller": "MemberEditCtrl"
                })
            ;
        }
    ])
;