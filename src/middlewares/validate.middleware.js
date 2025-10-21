export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (err) {
        console.log(err)
        const errors = err.issues.map((e) => e.message);
        res.status(422).json({ error: "Validation failed", details: errors });
    }
};
