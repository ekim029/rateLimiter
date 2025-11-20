const redis = require('../redisClient');

const slidingWindowLog = async (trackingKey, option) => {
    const { maxRequests, window } = option;

    const key = `slidingWindowLog:${trackingKey}`;
    const now = Date.now();

    const script = `
        local now = tonumber(ARGV[1])
        local max = tonumber(ARGV[2])
        local window = tonumber(ARGV[3])

        redis.call("ZREMRANGEBYSCORE", KEYS[1], 0, now - window)

        local count = redis.call("ZCARD", KEYS[1])

        if count > max then
            return 0
        end

        redis.call("ZADD", KEYS[1], now, now)
        redis.call("PEXPIRE", KEYS[1], window)
        
        return 1
    `;

    const allowed = await redis.eval(script, 1, key, now, maxRequests, window);
    return allowed === 1;
}

module.exports = slidingWindowLog;