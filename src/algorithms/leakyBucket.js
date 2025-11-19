
let bucket = {}; // temp memory

const leakyBucket = (req, option) => {
    const { capacity, leakRate } = option;

    const key = req.ip;
    const now = Date.now();

    if (!bucket[key]) {
        bucket[key] = {
            queue: 0,
            lastCheck: now
        };
    } else {
        const currBucket = bucket[key];

        const timeElapsed = (now - currBucket.lastCheck) / 1000;
        const tokenToRemove = timeElapsed * leakRate

        currBucket.queue = Math.max(currBucket.queue - tokenToRemove, 0);
        currBucket.lastCheck = now;
    }

    if (bucket[key].queue < capacity) {
        bucket[key].queue += 1;
        return true;
    }

    return false;
}

module.exports = leakyBucket;