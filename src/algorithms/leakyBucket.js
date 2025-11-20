const redis = require('../redisClient');

const leakyBucket = async (trackingKey, option) => {
    const { capacity, leakRate, ttl } = option;

    const key = `leakyBucket:${trackingKey}`;
    const now = Date.now();
    const expires = ttl || Math.ceil((capacity / leakRate) * 1000);

    let bucket = await redis.hgetall(key);
    let queue;
    let lastCheck;

    if (Object.keys(bucket).length === 0) {
        queue = 0;
        lastCheck = now;
    } else {
        queue = parseFloat(bucket.queue);
        lastCheck = parseInt(bucket.lastCheck, 10);
    }

    const timeElapsed = (now - lastCheck) / 1000;
    queue = Math.max(queue - timeElapsed * leakRate, 0);
    lastCheck = now;

    if (queue > capacity) {
        await redis.hset(key, { queue, lastCheck });
        await redis.pexpire(key, expires);

        return false;
    }

    queue += 1;

    await redis.hset(key, { queue, lastCheck });
    await redis.pexpire(key, expires);

    return true;
}

module.exports = leakyBucket;