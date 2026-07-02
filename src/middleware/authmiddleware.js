const userModel = require("../model/user");
const jwt = require("jsonwebtoken");

exports.authmiddle = async (req, res, next) => {
    try {
        const token =
            req.cookies.token ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access, token is missing"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        

        const user = await userModel.findById(decoded.userId);
        

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = user;

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid",
            error: err.message
        });
    }
};

