import * as TaskStatsService from "../services/taskStats.service.js";

export const getStats = async (req, res, next) => {
    try {
        const range = req.query.range || "week";
        const data = await TaskStatsService.getStats(req.user.id, range);

        res.status(200).json({
            success: true,
            message: `Task stats retrieved successfully (${range})`,
            data,
        });
    } catch (err) {
        next(err);
    }
};
