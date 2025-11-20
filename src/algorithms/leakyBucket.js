const redis = require('../redisClient');

const leakyBucket = async (trackingKey, option) => {
    const { capacity, leakRate, ttl } = option;

    const key = `leakyBucket:${trackingKey}`;
    const now = Date.now();
    const expires = ttl || Math.ceil((capacity / leakRate) * 1000);

    const script = `
        local now = tonumber(ARGV[1])
        local capacity = tonumber(ARGV[2])
        local leakRate = tonumber(ARGV[3])
        local expires = tonumber(ARGV[4])

        local queue = tonumber(redis.call("HGET", KEYS[1], "queue"))
        local lastCheck = tonumber(redis.call("HGET", KEYS[1], "lastCheck"))

        if (not queue or not lastCheck) then
            queue = 0
            lastCheck = now
        end

        local timeElapsed = (now - lastCheck) / 1000
        queue = math.max(queue - timeElapsed * leakRate, 0)
        lastCheck = now

        if queue > capacity then
            redis.call("HSET", KEYS[1], "queue", queue, "lastCheck", lastCheck)
            redis.call("PEXPIRE", KEYS[1], expires)
            return 0
        end

        queue = queue + 1

        redis.call("HSET", KEYS[1], "queue", queue, "lastCheck", lastCheck)
        redis.call("PEXPIRE", KEYS[1], expires)
        return 1
    `;

    const allowed = await redis.eval(script, 1, key, now, capacity, leakRate, expires);
    return allowed === 1;
}

module.exports = leakyBucket;