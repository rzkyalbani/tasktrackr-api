import { verifyAccessToken } from "../utils/jwt.js";
import AppError from "../errors/AppError.js";

export const authenticate = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return next(new AppError("Unauthorized", 401));
    }

    try {
        const token = header.split(" ")[1];
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return next(new AppError("Token expired", 401));
        }
        next(new AppError("Invalid or expired token", 401));
    }
};
