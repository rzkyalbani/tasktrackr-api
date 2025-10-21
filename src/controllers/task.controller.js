import * as TaskService from "../services/task.service.js";

export const createTask = async (req, res) => {
    try {
        const task = await TaskService.createTask(req.user.id, req.body);
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const filters = req.query;
        const tasks = await TaskService.getTasks(req.user.id, filters);
        res.status(200).json(tasks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await TaskService.getTaskById(req.user.id, req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const updated = await TaskService.updateTask(
            req.user.id,
            req.params.id,
            req.body
        );
        res.status(200).json(updated);
    } catch (err) {
        res.status(err.status || 400).json({ error: err.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const result = await TaskService.deleteTask(req.user.id, req.params.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(err.status || 400).json({ error: err.message });
    }
};
