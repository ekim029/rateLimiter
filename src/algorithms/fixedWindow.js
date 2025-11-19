const redis = require('../redisClient');

const fixedWindow = async (trackingKey, option) => {
    const { maxRequests, window } = option;

    let key = `fixedWindow:${trackingKey}`;

    let count = await redis.incr(key);

    if (count === 1) {
        await redis.pexpire(key, window)
    }

    if (count > maxRequests) {
        return false;
    }

    return true;
}

module.exports = fixedWindow;