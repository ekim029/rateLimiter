
let bucket = {}; // temp memory

const tokenBucket = (req, option) => {
    const { capacity, refillRate } = option;

    const key = req.ip;
    const now = Date.now();

    if (!bucket[key]) {
        bucket[key] = {
            tokens: capacity,
            lastRefill: now
        };
    } else {
        const currBucket = bucket[key];

        const timeElapsed = (now - currBucket.lastRefill) / 1000;
        const tokenToAdd = timeElapsed * refillRate

        currBucket.tokens = Math.min(currBucket.tokens + tokenToAdd, capacity);
        currBucket.lastRefill = now;
    }

    if (bucket[key].tokens > 0) {
        bucket[key].tokens -= 1;
        return true;
    }

    return false;
}

module.exports = tokenBucket;