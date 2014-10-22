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
                .state("group.view", {
                    "url": "/view/:groupId",
                    "templateUrl": setView("group/view"),
                    "controller": "GroupViewCtrl"
                })

                // member
                .state("member", {
                    "abstract": true,
                    "url": "/member",
                    "template": "<ui-view/>"
                })
                .state("member.list", {
                    "url": "/list/:groupId",
                    "templateUrl": setView("member/list"),
                    "controller": "MemberListCtrl"
                })
                .state("member.new", {
                    "url": "/new/:groupId",
                    "templateUrl": setView("member/edit"),
                    "controller": "MemberEditCtrl"
                })
                .state("member.edit", {
                    "url": "/edit/:groupId/:memberId",
                    "templateUrl": setView("member/edit"),
                    "controller": "MemberEditCtrl"
                })
                .state("member.view", {
                    "url": "/view/:groupId/:memberId",
                    "templateUrl": setView("member/view"),
                    "controller": "MemberViewCtrl"
                })
                .state("member.bd", {
                    "url": "/bd/:groupId",
                    "templateUrl": setView("member/bd"),
                    "controller": "MemberBdCtrl"
                })
                .state("member.login", {
                    "url": "/login/:groupId",
                    "templateUrl": setView("member/login"),
                    "controller": "MemberLoginCtrl"
                })
            ;
        }
    ])
;