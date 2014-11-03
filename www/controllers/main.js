cgb
    .controller("MainCtrl", ["$scope", "$rootScope", "$state", "$ionicSideMenuDelegate", "$ionicPlatform", "$cordovaFile", "api", "util",
        function ($scope, $rootScope, $state, $ionicSideMenuDelegate, $ionicPlatform, $cordovaFile, api, util) {
            util.loading("on");
            $ionicPlatform.ready(function () {
                // override and register hardware back button behavior
                $ionicPlatform.registerBackButtonAction(function () {
                    var state = $state.current.name;
                    if (state === "home") {
                        navigator.notification.confirm("Exit the app?", function (btnIndex) {
                            if (btnIndex === 2) {
                                navigator.app.exitApp();
                            }
                        }, "Confirm", ["Cancel", "OK"]);
                    }
                    else if (state === "message") {
                        $state.go("home");
                    }
                    // group views
                    else if (state === "group.join") {
                        if ($rootScope.groupId === null) {
                            navigator.notification.confirm("Exit the app?", function (btnIndex) {
                                if (btnIndex === 2) {
                                    navigator.app.exitApp();
                                }
                            }, "Confirm", ["Cancel", "OK"]);
                        }
                        else {
                            $state.go("home");
                        }
                    }
                    else if (state === "group.view") {
                        $state.go("home");
                    }
                    else if (state === "group.edit") {
                        navigator.app.backHistory();
                    }
                    else if (state === "group.new") {
                        $state.go("home");
                    }
                    // member views
                    else if (state === "member.list" || state === "member.bd" || state === "member.login") {
                        $state.go("home");
                    }
                    else if (state === "member.view" || state === "member.edit" || state === "member.new") {
                        navigator.app.backHistory();
                    }
                    // bank views
                    else if (state === "bank.list") {
                        $state.go("home");
                    }
                    else if (state === "bank.view" || state === "bank.edit") {
                        navigator.app.backHistory();
                    }
                    else {
                        navigator.app.backHistory();
                    }
                }, 100);

                // check if data file exists
                $cordovaFile.checkFile($rootScope.dataFile).then(
                    function () {
                        // file exists, read file
                        $cordovaFile.readAsText($rootScope.dataFile).then(
                            function (content) {
                                if (content === "") {
                                    util.loading("off");
                                    $state.go("group.join");
                                }
                                else {
                                    // check if group exists
                                    api.group.get(content).$loaded().then(function (data) {
                                        if (data.name === undefined) {
                                            // group does not exist
                                            util.loading("off");
                                            $state.go("group.join");
                                        }
                                        else {
                                            // group exists
                                            $rootScope.groupId = content;
                                            $scope.reload();
                                            $state.go("group.view");
                                        }
                                    }, function () { util.dataError(); });
                                }
                            },
                            function () {
                                util.loading("off");
                                window.navigator.notification.alert("無法讀取小組數據");
                            }
                        );
                    },
                    function () {
                        // file does not exist, create file
                        $cordovaFile.createFile($rootScope.dataFile).then(
                            function () {
                                util.loading("off");
                                $state.go("group.join");
                            },
                            function () {
                                util.loading("off");
                                window.navigator.notification.alert("無法創建小組數據");
                            }
                        );
                    }
                );

                // reload the master data
                $scope.$on("DATA_RELOAD", function (event, type) {
                    util.loading("on");

                    var loaded = 0, cnt = type === undefined ? 3 : 1;
                    if (type === undefined || type === "group") {
                        api.group.get().$loaded().then(function (data) {
                            $rootScope.data.group = data;
                            loadComplete();
                        }, function () { util.dataError(); });
                    }
                    if (type === undefined || type === "members") {
                        api.member.list().$loaded().then(function (data) {
                            $rootScope.data.members = data;

                            // reset birthday notification
                            // cancelAll() callback has bug, will update when it's fixed.
                            window.plugin.notification.local.getScheduledIds(function (scheduledIds) {
                                var member, dob, i;

                                // cancel all existing notifications
                                for (i = 0; scheduledIds.length > i; i++) {
                                    window.plugin.notification.local.cancel(scheduledIds[i]);
                                }

                                // add new notifications
                                for (i = 0; i < $rootScope.data.members.length; i++) {
                                    member = $rootScope.data.members[i];
                                    dob = util.toNotifyDate(member.dob);
                                    if (dob !== null) {
                                        window.plugin.notification.local.add({
                                            id: i,
                                            date: dob,
                                            repeat: "yearly",
                                            title: "生日提醒",
                                            message: "今天是" + util.getMemberName(member) + "的生日！"
                                        });
                                    }
                                }
                            }, function () { util.dataError(); });

                            loadComplete();
                        });
                    }
                    if (type === undefined || type === "bank") {
                        api.bank.list().$loaded().then(function (data) {
                            $rootScope.data.bank = data;
                            $rootScope.data.bank.sort(function (a, b) {
                                return a.date < b.date;
                            });

                            $rootScope.data.balance = 0;
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].type === "收入") {
                                    $rootScope.data.balance += data[i].amount;
                                }
                                else {
                                    $rootScope.data.balance -= data[i].amount;
                                }
                            }
                            $rootScope.data.balance = $rootScope.data.balance.toFixed(2);
                            loadComplete();
                        }, function () { util.dataError(); });
                    }

                    var loadComplete = function () {
                        if (++loaded === cnt) {
                            util.loading("off");
                        }
                    };
                });

                $scope.reload = function () {
                    $scope.$emit("DATA_RELOAD");
                };

                // selecting an item from left slide menu
                $scope.selectMenu = function (state) {
                    $state.go(state);
                    $ionicSideMenuDelegate.toggleLeft(false);
                };

                // highlight selected slide menu item
                $scope.selectedMenu = function (state) {
                    return state === $state.current.name ? " active": "";
                };

                // toggle left slide menu
                $scope.toggleMenu = function () {
                    $ionicSideMenuDelegate.toggleLeft();
                };

                // logout current user
                $scope.logout = function () {
                    $rootScope.loggedIn = false;
                    $state.go("group.view");
                    $ionicSideMenuDelegate.toggleLeft(false);
                };
            });
        }
    ])

    .controller("HomeCtrl", [
        function () {

        }
    ])

    .controller("MsgCtrl", ["$scope", "$interval", "util", "$state",
        function ($scope, $interval, util, $state) {
            // control message playback
            var media = null, timer = null;
            $scope.duration = 1;
            $scope.position = 0;
            $scope.status = 0;
            $scope.messageSrc = null;

            var setTimer = function () {
                timer = $interval(function () {
                    media.getCurrentPosition(
                        function (position) {
                            if (position > -1) {
                                $scope.position = parseInt(position);
                                $scope.duration = parseInt(media.getDuration());
                            }
                        },
                        function (error) {

                        }
                    );
                }, 1000);
            };

            $scope.playAudio = function (src) {
                if (media !== null) {
                    media.stop();
                    media.release();
                }

                media = new Media(src, null, null, function (status) {
                    $scope.status = status;
                });

                setTimer();

                $scope.messageSrc = src;
                media.play();
            };

            $scope.pauseAudio = function (event) {
                event.stopPropagation();
                media.pause();
                $interval.cancel(media);
            };

            $scope.resumeAudio = function (event) {
                event.stopPropagation();
                media.play();
                setTimer();
            };

            $scope.formatTime = function (totalSeconds) {
                return util.formatTime(totalSeconds);
            };

            // end media resource when exiting state
            $state.get("message").onExit = function () {
                if (media !== null) {
                    media.stop();
                    media.release();
                }
            };

            // load all messages
            util.loading("on");
            $scope.messages = [];
            var url = "http://www.gcciusa.com";
            $.ajax({
                dataType: "json",
                url: 'http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?',
                success: function (data) {
                    var html = "" + data.contents;
                    var list = html.match(/<div id="body_maincontent_object_c_body_element">([\s]*?)<ul>([\s\S]*?)<\/ul>([\s]*?)<\/div>/);

                    if (list === null) {

                    }
                    else {
                        var link, title, messages = [];
                        $(list[0]).find("ul").find("div").each(function () {
                            link = $.trim($(this).find("a").attr("href").split(",")[1]).replace(/'/g, "");
                            link = "http://www.gcciusa.com" + link;
                            $(this).find("span").remove();
                            title = $(this).text();
                            messages.push({ "link": link, "title": title});
                        });
                        $scope.$apply(function () {
                            $scope.messages = messages;
                        });
                        util.loading("off");
                    }
                },
                error: function () {
                    util.loading("off");
                }
            });
        }
    ])

    .controller("QtCtrl", ["$scope", "util",
        function ($scope, util) {
            util.loading("on");
            var url = "http://chinese.cgntv.net/sub.asp?pid=28";
            $.ajax({
                dataType: "json",
                url: 'http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?',
                success: function (data) {
                    var html = "" + data.contents;
                    console.log(html);
                    var content = html.match(/<textarea id=vcontents([\s\S]*?)<\/textarea>/);

                    if (content === null) {
                        console.log("didn't find anything");
                    }
                    else {
                        $scope.content = $(content[0]).find("p").html();
                    }
                    util.loading("off");
                },
                error: function () {
                    util.loading("off");
                }
            });
            /*
            <textarea id=vcontents style="display:none;width:570px;padding-top;50px;">
                table><tr><td>
                vod 정보
                 </td>
                 <td></td>
                 </tr>
                 </tr></table-->
                <xbase href=http://www.cgntv.net><p>&nbsp;</p>
                    <p>9 此后，我观看，见有许多的人，没有人能数过来，是从各国、各族、各民、各方来的，站在宝座和羔羊面前，身穿白衣，手拿棕树枝， <br />10 大声喊着说：愿救恩归与坐在宝座上我们的神，也归与羔羊！ <br />11 众天使都站在宝座和众长老并四活物的周围，在宝座前，面伏于地，敬拜神， <br />12 说：阿们！颂赞、荣耀、智慧、感谢、尊贵、权柄、大力都归与我们的神，直到永永远远。阿们！ <br />13 长老中有一位问我说：这些穿白衣的是谁﹖是从哪里来的﹖ <br />14 我对他说：我主，你知道。他向我说：这些人是从大患难中出来的，曾用羔羊的血把衣裳洗白净了。 <br />15 所以，他们在神宝座前，昼夜在他殿中事奉他。坐宝座的要用帐幕覆庇他们。 <br />16 他们不再饥，不再渴；日头和炎热也必不伤害他们。 <br />17 因为宝座中的羔羊必牧养他们，领他们到生命水的泉源；神也必擦去他们一切的眼泪。</p><xbase href=http://www.cgntv.net/one_on_one/>
                </textarea> */
        }
    ])
;