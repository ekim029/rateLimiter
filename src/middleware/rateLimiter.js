const checkRateLimit = require('../services/rateLimitService');

const rateLimiter = (configs) => {
    return async (req, res, next) => {
        try {

            let config = configs.find(c => {
                return req.apiKey && c.identifier === "apiKey"
                    || req.user?.id && c.identifier === "userId"
            });
            if (!config) {
                config = configs.find(c => c.identifier === "ip");
            }

            let trackingKey;
            if (config.identifier === "apiKey") {
                trackingKey = req.apiKey;
            } else if (config.identifier === "userId") {
                trackingKey = req.user?.id;
            } else {
                trackingKey = req.ip;
            }

            const allowed = await checkRateLimit(trackingKey, config);

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