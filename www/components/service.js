cgb
    .factory("util", ["$rootScope", "$ionicLoading",
        function ($rootScope, $ionicLoading) {
            var isBlank = function (data) {
                return data === undefined || data === null || data === "";
            };

            return {
                "loading": function (type) {
                    if (type === "on") {
                        $ionicLoading.show({ "template": "<i class='icon ion-refreshing'></i>" });
                    }
                    else if (type === "off") {
                        $ionicLoading.hide();
                    }
                },
                "isBlank": function (data) {
                    return isBlank(data);
                },
                "formatPhone": function (phone) {
                    if (phone !== undefined && phone.length === 10) {
                        return "(" + phone.substr(0, 3) + ") " + phone.substr(3, 3) + "-" + phone.substr(6);
                    }
                    return phone;
                },
                "formatDob": function (dob) {
                    if (!isBlank(dob)) {
                        var splitted = dob.split("/");

                        if (dob.substr(0, 1) === "0") {
                            dob = dob.substr(1);
                        }
                        if (splitted[1].substr(0, 1) === "0") {
                            dob = splitted[0] + "/" + splitted[1].substr(1);
                        }
                    }
                    return dob;
                },
                "formatJSON": function (obj) {
                    for (var key in obj) {
                        obj[key] = obj[key] === undefined ? null : obj[key];
                    }
                    return obj;
                },
                "toNotifyDate": function (str) {
                    try {
                        var split = str.split("/"), date, now = new Date();
                        date = new Date(now.getFullYear(), split[0] - 1, split[1], 8);

                        if (date.getMonth() < now.getMonth() || date.getMonth() === now.getMonth() && date.getDate() < now.getDate()) {
                            date.setFullYear(date.getFullYear() + 1);
                        }

                        if (date instanceof Date && !isNaN(date.valueOf())) {
                            return date;
                        }
                        return null;
                    }
                    catch (err) {
                        return null;
                    }
                },
                "getMemberName": function (member) {
                    if (!isBlank(member.enName) && !isBlank(member.cnName)) {
                        return member.cnName + " (" + member.enName + ")";
                    }
                    if (isBlank(member.enName)) {
                        return member.cnName;
                    }
                    if (isBlank(member.cnName)) {
                        return member.enName;
                    }
                },
                "getMember": function (memberId) {
                    for (var i = 0; i < $rootScope.data.members.length; i++) {
                        if ($rootScope.data.members[i].$id === memberId) {
                            return $rootScope.data.members[i];
                        }
                    }
                    return null;
                },
                "getTransaction": function (transactionId) {
                    for (var i = 0; i < $rootScope.data.bank.length; i++) {
                        if ($rootScope.data.bank[i].$id === transactionId) {
                            return $rootScope.data.bank[i];
                        }
                    }
                    return null;
                }
            };
        }
    ])
;