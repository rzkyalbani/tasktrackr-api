export const sendResponse = (res, code, data) => res.status(code).json(data);
export const sendNoContent = (res) => res.status(204).send();
