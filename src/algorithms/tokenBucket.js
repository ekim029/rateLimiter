
let bucket = {}; // temp memory

const tokenBucket = (trackingKey, option) => {
    const { capacity, refillRate } = option;

    const now = Date.now();

    if (!bucket[trackingKey]) {
        bucket[trackingKey] = {
            tokens: capacity,
            lastRefill: now
        };
    } else {
        const currBucket = bucket[trackingKey];

        const timeElapsed = (now - currBucket.lastRefill) / 1000;
        const tokenToAdd = timeElapsed * refillRate

        currBucket.tokens = Math.min(currBucket.tokens + tokenToAdd, capacity);
        currBucket.lastRefill = now;
    }

    if (bucket[trackingKey].tokens > 0) {
        bucket[trackingKey].tokens -= 1;
        return true;
    }

    return false;
}

module.exports = tokenBucket;