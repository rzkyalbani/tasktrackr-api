import * as AuthService from "../services/auth.service.js";

export const register = async (req, res) => {
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

        res.status(201).json({
            accessToken,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const login = async (req, res) => {
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

        res.status(200).json({
            accessToken,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const refreshToken = async (req, res) => {
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

        res.status(200).json({ accessToken: newAccess });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

export const logout = async (req, res) => {
    try {
        await AuthService.logout(req.user.id);
        res.clearCookie("refresh_token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const me = async (req, res) => {
    try {
        const user = await AuthService.getProfile(req.user.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
