
let bucket = {}; // temp memory

const leakyBucket = (trackingKey, option) => {
    const { capacity, leakRate } = option;

    const now = Date.now();

    if (!bucket[trackingKey]) {
        bucket[trackingKey] = {
            queue: 0,
            lastCheck: now
        };
    } else {
        const currBucket = bucket[trackingKey];

        const timeElapsed = (now - currBucket.lastCheck) / 1000;
        const tokenToRemove = timeElapsed * leakRate

        currBucket.queue = Math.max(currBucket.queue - tokenToRemove, 0);
        currBucket.lastCheck = now;
    }

    if (bucket[trackingKey].queue < capacity) {
        bucket[trackingKey].queue += 1;
        return true;
    }

    return false;
}

module.exports = leakyBucket;