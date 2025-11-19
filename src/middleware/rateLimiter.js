const checkRateLimit = require('../services/rateLimitService');

const rateLimiter = (option) => {
    return async (req, res, next) => {
        try {
            const allowed = await checkRateLimit(req, option);

            if (!allowed) {
                return res.status(400).json({ message: "Too many requests" });
            }

            next();
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = rateLimiter;