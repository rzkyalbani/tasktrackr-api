import prisma from "../config/prisma.js";

export const createTask = async (userId, data) => {
    return prisma.task.create({
        data: {
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
            userId,
        },
    });
};

export const getTasks = async (userId, filters = {}) => {
    const where = { userId };

    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.dueDate) where.dueDate = { lte: new Date(filters.dueDate) };

    return prisma.task.findMany({ where, orderBy: { createdAt: "desc" } });
};

export const getTaskById = async (userId, taskId) => {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw { status: 404, message: "Task not found" };
    if (task.userId !== userId) throw { status: 403, message: "Forbidden" };
    return task;
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
    return;
};
