const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const cookieParser = require("cookie-parser");

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];
        if (!token) {
            return next(new ErrorHandler("You are not authenticated!", 401))
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return next(new ErrorHandler("Toke is not authenticated!", 401))
        }
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
            return next(new ErrorHandler("You are not authenticated!", 401))
        }
        next();
    } catch (error) {
        return next(new ErrorHandler("You are not authenticated!", 401))
    }
}