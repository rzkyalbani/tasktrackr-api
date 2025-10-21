import * as AuthService from "../services/auth.service.js";

export const register = async (req, res) => {
    try {
        const result = await AuthService.register(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const result = await AuthService.login(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const me = async (req, res) => {
    try {
        const result = await AuthService.getProfile(req.user.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
