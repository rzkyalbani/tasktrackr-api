import prisma from "../config/prisma.js";
import AppError from "../errors/AppError.js";

export const createTask = async (userId, data) => {
    try {
        return await prisma.task.create({
            data: {
                ...data,
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
                userId,
            },
        });
    } catch (err) {
        throw new AppError("Failed to create task", 400);
    }
};

export const getTasks = async (userId, filters = {}) => {
    const where = { userId };

    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.dueDate) where.dueDate = { lte: new Date(filters.dueDate) };

    return prisma.task.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });
};

export const getTaskById = async (userId, taskId) => {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new AppError("Task not found", 404);
    if (task.userId !== userId) throw new AppError("Forbidden", 403);

    return task;
};

export const updateTask = async (userId, taskId, data) => {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new AppError("Task not found", 404);
    if (task.userId !== userId) throw new AppError("Forbidden", 403);

    try {
        return await prisma.task.update({
            where: { id: taskId },
            data,
        });
    } catch (err) {
        throw new AppError("Failed to update task", 400);
    }
};

export const deleteTask = async (userId, taskId) => {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new AppError("Task not found", 404);
    if (task.userId !== userId) throw new AppError("Forbidden", 403);

    try {
        await prisma.task.delete({ where: { id: taskId } });
    } catch (err) {
        throw new AppError("Failed to delete task", 400);
    }
};
