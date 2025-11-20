const redis = require('../redisClient');

const tokenBucket = async (trackingKey, option) => {
    const { capacity, refillRate, ttl } = option;

    const key = `tokenBucket:${trackingKey}`;
    const now = Date.now();

    const script = `
        local now = tonumber(ARGV[1])
        local capacity = tonumber(ARGV[2])
        local refillRate = tonumber(ARGV[3])
        local ttl = tonumber(ARGV[4])

        local tokens = tonumber(redis.call("HGET", KEYS[1], "tokens"))
        local lastRefill = tonumber(redis.call("HGET", KEYS[1], "lastRefill"))

        if not tokens or not lastRefill then
            tokens = capacity
            lastRefill = now
        end

        local timeElapsed = (now - lastRefill) / 1000
        tokens = math.min(capacity, tokens + timeElapsed * refillRate)
        lastRefill = now

        if tokens < 1 then
            redis.call("HSET", KEYS[1], "tokens", tokens, "lastRefill", lastRefill)
            redis.call("PEXPIRE", KEYS[1], ttl)
            return 0
        end

        tokens = tokens - 1

        redis.call("HSET", KEYS[1], "tokens", tokens, "lastRefill", lastRefill)
        redis.call("PEXPIRE", KEYS[1], ttl) 
        return 1
    `;

    const allowed = await redis.eval(script, 1, key, now, capacity, refillRate, ttl);
    return allowed === 1;
}

module.exports = tokenBucket;