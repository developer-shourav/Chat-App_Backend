const jwt = require("jsonwebtoken");
const { secret } = require("../common/config");

module.exports = function (allowedRoles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next();
        }

        try {
            /* console.log("this is role middleware"); */
           /*  console.log(req.user); */
            const { role } = req.user;
            /* console.log(role); */
            let hasRole = false;
            if (allowedRoles.includes(role)) {
                hasRole = true;
            }
            if (!hasRole) {
                return res
                    .status(403)
                    .json({ message: "User is not have permission" });
            }
            next();
        } catch (e) {
            console.log(e);
            return res.status(403).json({ message: "User is not authorized" });
        }
    };
};
