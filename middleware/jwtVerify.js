//jwt verify middleware
const jwt = require("jsonwebtoken");

function jwt_verify(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            STATUSCODE: 401,
            message: "Access denied, no token provided",
            data: {},
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            STATUSCODE: 401,            
            message: "Invalid or expired token",
            data: {},
        });
    }

};

module.exports = jwt_verify