import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/index.js";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from "../utils/jwt.js";

const prisma = new PrismaClient();

export const register = async ({ name, email, password }) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email already registered");

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { name, email, passwordHash: hash },
    });

    const accessToken = signAccessToken({ id: user.id, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id });

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });

    return { accessToken, refreshToken, user };
};

export const login = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error("Invalid credentials");

    const accessToken = signAccessToken({ id: user.id, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id });

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });

    return { accessToken, refreshToken, user };
};

export const refresh = async (token) => {
    const decoded = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.refreshToken !== token)
        throw new Error("Invalid refresh token");

    const newAccess = signAccessToken({ id: user.id, role: user.role });
    const newRefresh = signRefreshToken({ id: user.id });

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefresh },
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
