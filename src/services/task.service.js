import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export const createTask = async (userId, data) => {
    const { title, description, priority, dueDate } = data;
    return await prisma.task.create({
        data: {
            title,
            description,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            userId,
        },
    });
};

export const getTasks = async (userId, filters = {}) => {
    const where = { userId };

    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.dueDate) where.dueDate = { lte: new Date(filters.dueDate) };

    return await prisma.task.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });
};

export const getTaskById = async (userId, taskId) => {
    return await prisma.task.findFirst({
        where: { id: taskId, userId },
    });
};

export const updateTask = async (userId, taskId, data) => {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw { status: 404, message: "Task not found" };
    if (task.userId !== userId) throw { status: 403, message: "Forbidden" };

    return prisma.task.update({
        where: { id: taskId },
        data,
    });
};

export const deleteTask = async (userId, taskId) => {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw { status: 404, message: "Task not found" };
    if (task.userId !== userId) throw { status: 403, message: "Forbidden" };

    await prisma.task.delete({ where: { id: taskId } });
    return { message: "Task deleted successfully" };
};
