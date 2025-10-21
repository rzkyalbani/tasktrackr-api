import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const signAccessToken = (payload) =>
    jwt.sign(payload, config.jwtAccessSecret, { expiresIn: config.accessExp });

export const signRefreshToken = (payload) =>
    jwt.sign(payload, config.jwtRefreshSecret, {
        expiresIn: config.refreshExp,
    });

export const verifyAccessToken = (token) =>
    jwt.verify(token, config.jwtAccessSecret);

export const verifyRefreshToken = (token) =>
    jwt.verify(token, config.jwtRefreshSecret);
