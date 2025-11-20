const redis = require('../redisClient');

const tokenBucket = async (trackingKey, option) => {
    const { capacity, refillRate, ttl } = option;

    const key = `tokenBucket:${trackingKey}`;
    const now = Date.now();

    let bucket = await redis.hgetall(key);
    let tokens;
    let lastRefill;

    if (Object.keys(bucket).length === 0) {
        tokens = capacity;
        lastRefill = now;
    } else {
        tokens = parseFloat(bucket.tokens);
        lastRefill = parseInt(bucket.lastRefill, 10);
    }

    const timeElapsed = (now - lastRefill) / 1000;
    tokens = Math.min(capacity, tokens + timeElapsed * refillRate);
    lastRefill = now;

    if (tokens < 1) {
        await redis.hset(key, { tokens, lastRefill });
        await redis.pexpire(key, ttl);
        return false;
    }

    tokens -= 1;

    await redis.hset(key, { tokens, lastRefill });
    await redis.pexpire(key, ttl);

    return true;
}

module.exports = tokenBucket;