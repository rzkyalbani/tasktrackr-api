import prisma from "../config/prisma.js";
import AppError from "../errors/AppError.js";

export const getStats = async (userId, range = "week") => {
    const allowedRanges = ["week", "month"];
    if (!allowedRanges.includes(range)) {
        throw new AppError("Invalid range value. Use 'week' or 'month'.", 400);
    }

    const now = new Date();
    const start = new Date();

    const days = range === "month" ? 30 : 7;
    start.setDate(now.getDate() - days);

    const tasks = await prisma.task.findMany({
        where: {
            userId,
            createdAt: { gte: start, lte: now },
        },
    });

    if (!tasks.length) {
        return {
            totalTasks: 0,
            completed: 0,
            pending: 0,
            overdue: 0,
            completionRate: 0,
            streak: 0,
            range,
        };
    }

    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = tasks.filter((t) => t.status === "pending").length;
    const overdue = tasks.filter(
        (t) =>
            t.status !== "completed" && t.dueDate && new Date(t.dueDate) < now
    ).length;

    const total = tasks.length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const streak = calculateStreak(tasks);

    return {
        totalTasks: total,
        completed,
        pending,
        overdue,
        completionRate: Number(completionRate.toFixed(2)),
        streak,
        range,
    };
};

function calculateStreak(tasks) {
    const completedDates = tasks
        .filter((t) => t.status === "completed")
        .map((t) => new Date(t.updatedAt).toDateString());

    const uniqueDates = [...new Set(completedDates)].sort(
        (a, b) => new Date(b) - new Date(a)
    );

    let streak = 0;
    let currentDate = new Date();

    for (let dateStr of uniqueDates) {
        const d = new Date(dateStr);
        const diff = Math.floor((currentDate - d) / (1000 * 60 * 60 * 24));
        if (diff === 0 || diff === 1) {
            streak++;
            currentDate = d;
        } else break;
    }

    return streak;
}
