import * as TaskStatsService from "../services/taskStats.service.js";

export const getWeeklyStats = async (req, res, next) => {
    try {
        const stats = await TaskStatsService.getWeeklyStats(req.user.id);
        res.status(200).json({
            success: true,
            message: "Weekly stats retrieved successfully",
            data: stats,
        });
    } catch (err) {
        next(err);
    }
};
