import * as TaskService from "../services/task.service.js";
import { sendResponse, sendNoContent } from "../utils/http.js";

export const createTask = async (req, res, next) => {
    try {
        const task = await TaskService.createTask(req.user.id, req.body);
        sendResponse(res, 201, task);
    } catch (err) {
        next(err);
    }
};

export const getTasks = async (req, res, next) => {
    try {
        const tasks = await TaskService.getTasks(req.user.id, req.query);
        sendResponse(res, 200, tasks);
    } catch (err) {
        next(err);
    }
};

export const getTaskById = async (req, res, next) => {
    try {
        const task = await TaskService.getTaskById(req.user.id, req.params.id);
        sendResponse(res, 200, task);
    } catch (err) {
        next(err);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const updated = await TaskService.updateTask(
            req.user.id,
            req.params.id,
            req.body
        );
        sendResponse(res, 200, updated);
    } catch (err) {
        next(err);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        await TaskService.deleteTask(req.user.id, req.params.id);
        sendNoContent(res);
    } catch (err) {
        next(err);
    }
};
