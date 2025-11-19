
let bucket = {}; // temp memory

const tokenBucket = (req, option) => {
    const { maxRequests, refillRate } = option;

    const key = req.ip;
    const now = Date.now();

    if (!bucket[key]) {
        bucket[key] = {
            capacity: maxRequests,
            lastRefill: now
        };
    } else {
        const currBucket = bucket[key];

        const timeElapsed = (now - currBucket.lastRefill) / 1000;
        const tokenToAdd = timeElapsed * refillRate

        currBucket.capacity = Math.min(currBucket.capacity + tokenToAdd, maxRequests);
        currBucket.lastRefill = now;
    }

    if (bucket[key].capacity > 0) {
        bucket[key].capacity -= 1;
        return true;
    }

    return false;
}

module.exports = tokenBucket;