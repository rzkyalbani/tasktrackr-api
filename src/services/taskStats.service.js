import prisma from "../config/prisma.js";
import AppError from "../errors/AppError.js";

export const getWeeklyStats = async (userId) => {
    const now = new Date();
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - 7);

    // Ambil semua task user dalam 7 hari terakhir
    const tasks = await prisma.task.findMany({
        where: {
            userId,
            createdAt: {
                gte: startOfWeek,
                lte: now,
            },
        },
    });


    if (!tasks.length) {
        throw new AppError("No tasks found in the past week", 404);
    }

    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = tasks.filter((t) => t.status === "pending").length;
    const overdue = tasks.filter(
        (t) =>
            t.status !== "completed" && t.dueDate && new Date(t.dueDate) < now
    ).length;

    const total = tasks.length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    // Hitung streak produktivitas
    const streak = calculateStreak(tasks);

    return {
        totalTasks: total,
        completed,
        pending,
        overdue,
        completionRate: Number(completionRate.toFixed(2)),
        streak,
    };
};

// Helper buat hitung streak
function calculateStreak(tasks) {
    const completedDates = tasks
        .filter((t) => t.status === "completed")
        .map((t) => new Date(t.updatedAt).toDateString());

    // Hilangkan duplikat tanggal
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
        } else {
            break;
        }
    }

    return streak;
}
