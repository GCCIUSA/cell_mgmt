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
                    else if (state === "message" || state === "qt") {
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
                            if (ionic.Platform.platform() !== "ios") {
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
                            }

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

    .controller("MsgCtrl", ["$scope", "$interval", "util", "$state", "$ionicPlatform",
        function ($scope, $interval, util, $state, $ionicPlatform) {
            $scope.platform = ionic.Platform.platform();

            // control message playback
            var media = null, timer = null;
            $scope.duration = 1;
            $scope.position = 0;
            $scope.status = 0;
            $scope.messageSrc = null;

            $ionicPlatform.on("pause", function () {
                if (media !== null) {
                    media.pause();
                    $interval.cancel(media);
                }
            });

            var setTimer = function () {
                if ($scope.platform !== "ios") {
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
                }
                else {
                    timer = $interval(function () {
                        $scope.position = media.currentTime;
                        $scope.duration = media.duration;
                    }, 1000);
                }
            };

            $scope.playAudio = function (src) {
                if ($scope.messageSrc === src) {
                    return;
                }

                if ($scope.platform !== "ios") {
                    if (media !== null) {
                        media.stop();
                        media.release();
                    }

                    media = new Media(src, null, null, function (status) {
                        $scope.status = status;
                    });
                }
                else {
                    if (media !== null) {
                        media.pause();
                    }
                    media = new Audio(src);
                    $scope.status = 2;
                }

                $interval.cancel(media);
                setTimer();

                media.play();
                $scope.messageSrc = src;
            };

            $scope.pauseAudio = function (event) {
                event.stopPropagation();
                media.pause();
                $scope.status = 3;
                $interval.cancel(media);
            };

            $scope.resumeAudio = function (event) {
                event.stopPropagation();
                media.play();
                $scope.status = 2;
                setTimer();
            };

            $scope.restartAudio = function (event) {
                event.stopPropagation();
                var tmpSrc = $scope.messageSrc;
                $scope.messageSrc = null;
                $scope.playAudio(tmpSrc);
            };

            $scope.formatTime = function (totalSeconds) {
                return util.formatTime(totalSeconds);
            };

            // end media resource when exiting state
            $state.get("message").onExit = function () {
                if (media !== null) {
                    if ($scope.platform !== "ios") {
                        media.stop();
                        media.release();
                    }
                    else {
                        media.pause();
                    }
                    media = null;
                }
            };

            // load all messages
            var url = "http://www.gcciusa.com";
            var loadData = function () {
                util.loading("on");
                $scope.messages = [];
                $.get(url, function (data) {
                    var list = data.responseText.match(/<div id="body_maincontent_object_c_body_element">([\s]*?)<ul>([\s\S]*?)<\/ul>([\s]*?)<\/div>/);

                    if (list === null) {
                        dataError();
                    }
                    else {
                        var link, title, messages = [];
                        $(list[0]).find("ul").find("div").each(function () {
                            link = $.trim($(this).find("a").attr("href").split(",")[1]).replace(/'/g, "").replace(/\%20/g, "");
                            link = "http://www.gcciusa.com" + $.trim(link);
                            $(this).find("span").remove();
                            title = $(this).text();
                            messages.push({ "link": link, "title": title});
                        });
                        $scope.$apply(function () {
                            $scope.messages = messages;
                        });
                    }
                })
                .fail(function() {
                    dataError();
                })
                .always(function() {
                    util.loading("off");
                });
            };
            loadData();

            var dataError = function () {
                window.navigator.notification.confirm("無法獲取內容，請再試一次", function (btnIndex) {
                    if (btnIndex === 1) {
                        $state.go("home");
                    }
                    else if (btnIndex === 2) {
                        loadData();
                    }
                }, "Confirm", ["取消", "重試"]);
            };
        }
    ])

    .controller("QtCtrl", ["$scope", "util", "$state",
        function ($scope, util, $state) {
            $scope.selectedId = null;

            var getContent = function (id) {
                util.loading("on");
                var url = "http://chinese.cgntv.net/sub.asp?pid=28" + (id === null ? "" : "&vno=" + id);
                $scope.content = "";

                $.get(url, function (data) {
                    var matched = data.responseText.match(/<p>([\d]*?) ([\s\S]*?)<br\/>([\d]*?) ([\s\S]*?)<\/p>/);
                    var matched_id = data.responseText.match(/<td align="center" height="25" id="tag1">([\s\S]*?)<\/td>/g);
                    var matched_date = data.responseText.match(/<td align="center" id="tag4">([\s\S]*?)<\/td>/g);

                    if (matched === null || matched_id === null || matched_date === null) {
                        dataError();
                    }
                    else {
                        var html = $("<div>" + matched[0] + "</div>");
                        var others = [];

                        for (var i = 0; i < matched_date.length; i++) {
                            others.push({
                                "date": $.trim($("<div>" + matched_date[i] + "</div>").text()).substr(5),
                                "id": $.trim($("<div>" + matched_id[i] + "</div>").text())
                            });
                        }

                        $scope.$apply(function () {
                            $scope.content = html.html();
                            $scope.others = others;
                            if (id === null) {
                                $scope.selectedId = $scope.others[0].id;
                            }
                        });
                    }
                })
                .fail(function() {
                    dataError();
                })
                .always(function() {
                    util.loading("off");
                });
            };
            getContent($scope.selectedId);

            var dataError = function () {
                window.navigator.notification.confirm("無法獲取內容，請再試一次", function (btnIndex) {
                    if (btnIndex === 1) {
                        $state.go("home");
                    }
                    else if (btnIndex === 2) {
                        getContent($scope.selectedId);
                    }
                }, "Confirm", ["取消", "重試"]);
            };

            $scope.selectDate = function (item) {
                $scope.selectedId = item.id;
                getContent(item.id);
            };
        }
    ])
;