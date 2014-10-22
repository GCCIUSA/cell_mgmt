cgb
    .factory("util", [
        function () {
            return {
                "formatPhone": function (phone) {
                    if (phone.length === 10) {
                        return "(" + phone.substr(0, 3) + ") " + phone.substr(3, 3) + "-" + phone.substr(6);
                    }
                    return phone;
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
                }
            };
        }
    ])
;