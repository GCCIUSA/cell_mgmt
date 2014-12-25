cgb
    .config(["$stateProvider",
        function ($stateProvider) {
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
                .state("message", {
                    "url": "/message",
                    "templateUrl": setView("message"),
                    "controller": "MsgCtrl"
                })
                .state("qt", {
                    "url": "/qt",
                    "templateUrl": setView("qt"),
                    "controller": "QtCtrl"
                })

                // group
                .state("group", {
                    "abstract": true,
                    "url": "/group",
                    "template": "<ui-view/>"
                })
                .state("group.join", {
                    "url": "/join",
                    "templateUrl": setView("group/join"),
                    "controller": "GroupJoinCtrl"
                })
                .state("group.new", {
                    "url": "/new",
                    "templateUrl": setView("group/edit"),
                    "controller": "GroupEditCtrl"
                })
                .state("group.edit", {
                    "url": "/edit",
                    "templateUrl": setView("group/edit"),
                    "controller": "GroupEditCtrl"
                })
                .state("group.view", {
                    "url": "/view",
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
                    "url": "/list",
                    "templateUrl": setView("member/list"),
                    "controller": "MemberListCtrl"
                })
                .state("member.new", {
                    "url": "/new",
                    "templateUrl": setView("member/edit"),
                    "controller": "MemberEditCtrl"
                })
                .state("member.edit", {
                    "url": "/edit/:memberId",
                    "templateUrl": setView("member/edit"),
                    "controller": "MemberEditCtrl"
                })
                .state("member.view", {
                    "url": "/view/:memberId",
                    "templateUrl": setView("member/view"),
                    "controller": "MemberViewCtrl"
                })
                .state("member.bd", {
                    "url": "/bd",
                    "templateUrl": setView("member/bd"),
                    "controller": "MemberBdCtrl"
                })
                .state("member.login", {
                    "url": "/login",
                    "templateUrl": setView("member/login"),
                    "controller": "MemberLoginCtrl"
                })

                // bank
                .state("bank", {
                    "abstract": true,
                    "url": "/bank",
                    "template": "<ui-view/>"
                })
                .state("bank.list", {
                    "url": "/list",
                    "templateUrl": setView("bank/list"),
                    "controller": "BankListCtrl"
                })
                .state("bank.view", {
                    "url": "/view/:transactionId",
                    "templateUrl": setView("bank/view"),
                    "controller": "BankViewCtrl"
                })
                .state("bank.edit", {
                    "url": "/edit/:transactionId",
                    "templateUrl": setView("bank/edit"),
                    "controller": "BankEditCtrl"
                })
            ;
        }
    ])
;