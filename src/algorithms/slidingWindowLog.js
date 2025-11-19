
let counter = {}; // temp memory

const slidingWindowLog = (trackingKey, option) => {
    const { maxRequests, window } = option;

    const now = Date.now();

    if (!counter[trackingKey]) {
        counter[trackingKey] = [];
    } else {
        counter[trackingKey] = counter[trackingKey].filter(time => now - time <= window);
    }

    if (counter[trackingKey].length < maxRequests) {
        counter[trackingKey].push(now);
        return true;
    }

    return false;
}

module.exports = slidingWindowLog;