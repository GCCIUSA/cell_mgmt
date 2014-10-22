cgb
    .factory("util", [
        function () {
            return {
                "formatPhone": function (phone) {
                    if (phone.length === 10) {
                        return "(" + phone.substr(0, 3) + ") " + phone.substr(3, 3) + "-" + phone.substr(6);
                    }
                    return phone;
                }
            };
        }
    ])
;