import prisma from "../config/prisma.js";

export const checkDueTasks = async () => {
    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const dueTasks = await prisma.task.findMany({
        where: {
            status: { not: "completed" },
            dueDate: { gte: now, lte: next24h },
        },
        include: { user: true },
    });

    if (!dueTasks.length) {
        console.log("[Reminder] Tidak ada task yang mendekati deadline.");
        return;
    }

    dueTasks.forEach((task) => {
        console.log(
            `Reminder: Task "${task.title}" untuk user "${task.user.email}" mendekati deadline (${task.dueDate}).`
        );
    });

    console.log(`[Reminder] Total ${dueTasks.length} task ditemukan.`);
};
