import * as AuthService from "../services/auth.service.js";
import { sendResponse } from "../utils/http.js";

export const register = async (req, res, next) => {
    try {
        const { accessToken, refreshToken, user } = await AuthService.register(
            req.body
        );
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        sendResponse(res, 201, {
            accessToken,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { accessToken, refreshToken, user } = await AuthService.login(
            req.body
        );

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        sendResponse(res, 200, {
            accessToken,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (err) {
        next(err);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies?.refresh_token;
        if (!token) return res.status(401).json({ error: "No refresh token" });

        const { newAccess, newRefresh } = await AuthService.refresh(token);

        res.cookie("refresh_token", newRefresh, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        sendResponse(res, 200, { accessToken: newAccess });
    } catch (err) {
        next(err);
    }
};

export const logout = async (req, res, next) => {
    try {
        await AuthService.logout(req.user.id);
        res.clearCookie("refresh_token");
        sendResponse(res, 200, { message: "Logged out successfully" });
    } catch (err) {
        next(err);
    }
};

export const me = async (req, res, next) => {
    try {
        const user = await AuthService.getProfile(req.user.id);
        res.status(200).json(user);
        sendResponse(res, 200, user);
    } catch (err) {
        next(err);
    }
};
