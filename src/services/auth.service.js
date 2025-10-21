import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/index.js";
import { signToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

export const register = async ({ name, email, password }) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email already registered");

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { name, email, passwordHash: hash },
    });

    const token = signToken({ id: user.id, role: user.role });
    return { token, user: { id: user.id, name: user.name, email: user.email } };
};

export const login = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error("Invalid credentials");

    const token = signToken({ id: user.id, role: user.role });
    return { token, user: { id: user.id, name: user.name, email: user.email } };
};

export const getProfile = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    return { id: user.id, name: user.name, email: user.email, role: user.role };
};
