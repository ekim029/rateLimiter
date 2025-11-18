
const rateLimiter = (option) => {
    return async (req, res, next) => {
        try {
            const allowed = checkRateLimit(req, option); // placeholder method

            if (!allowed) {
                return res.status(400).json({ message: "Too many requests" });
            }

            next();
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = { rateLimiter };