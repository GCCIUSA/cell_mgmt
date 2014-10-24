cgb
    .factory("util", ["$rootScope",
        function ($rootScope) {
            return {
                "formatPhone": function (phone) {
                    if (phone !== undefined && phone.length === 10) {
                        return "(" + phone.substr(0, 3) + ") " + phone.substr(3, 3) + "-" + phone.substr(6);
                    }
                    return phone;
                },
                "formatDob": function (dob) {
                    if (dob !== undefined) {
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
                "showName": function (member) {
                    if (member.enName !== undefined && member.cnName !== undefined) {
                        return member.cnName + " (" + member.enName + ")";
                    }
                    if (member.enName === undefined) {
                        return member.cnName;
                    }
                    if (member.cnName === undefined) {
                        return member.enName;
                    }
                },
                "formatJSON": function (obj) {
                    for (var key in obj) {
                        obj[key] = obj[key] === undefined ? null : obj[key];
                    }
                    return obj;
                },
                "getMember": function (memberId) {
                    for (var i = 0; i < $rootScope.data.members.length; i++) {
                        if ($rootScope.data.members[i].$id === memberId) {
                            return $rootScope.data.members[i];
                        }
                    }
                    return null;
                }
            };
        }
    ])
;