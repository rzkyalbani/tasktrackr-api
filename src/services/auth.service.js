import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from "../utils/jwt.js";
import AppError from "../errors/AppError.js";

export const register = async ({ name, email, password }) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError("Email already registered", 400);

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { name, email, passwordHash: hash },
    });

    const accessToken = signAccessToken({ id: user.id, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id });

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefresh },
    });

    return { accessToken, refreshToken, user };
};

export const login = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("Invalid credentials", 401);

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError("Invalid credentials", 401);

    const accessToken = signAccessToken({ id: user.id, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id });
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefresh },
    });

    return { accessToken, refreshToken, user };
};

export const refresh = async (token) => {
    const decoded = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) throw new AppError("Invalid refresh token", 401);

    const valid = await bcrypt.compare(token, user.refreshToken);
    if (!valid) throw new AppError("Invalid refresh token", 401);

    const newAccess = signAccessToken({ id: user.id, role: user.role });
    const newRefresh = signRefreshToken({ id: user.id });
    const newHashed = await bcrypt.hash(newRefresh, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newHashed },
    });

    return { newAccess, newRefresh };
};

export const logout = async (userId) => {
    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });
};

export const getProfile = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
};
