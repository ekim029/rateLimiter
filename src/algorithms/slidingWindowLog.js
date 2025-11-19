const redis = require('../redisClient');

const slidingWindowLog = async (trackingKey, option) => {
    const { maxRequests, window } = option;

    const key = `slidingWindowLog:${trackingKey}`;
    const now = Date.now();
    const startTime = now - window;

    await redis.zremrangebyscore(key, 0, startTime);

    let count = await redis.zcard(key);

    if (count > maxRequests) {
        return false;
    }

    await redis.zadd(key, now, `now.${Math.random()}`);
    await redis.pexpire(key, window);

    return true;
}

module.exports = slidingWindowLog;