export const sendResponse = (res, code, data) =>
    res.status(code).json({ success: true, data });

export const sendError = (res, code, message) =>
    res.status(code).json({ success: false, message });

export const sendNoContent = (res) => res.status(204).send();
