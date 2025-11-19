
let counter = {}; // temp memory

const slidingWindowLog = (req, option) => {
    const { maxRequests, window } = option;

    const key = req.ip;
    const now = Date.now();

    if (!counter[key]) {
        counter[key] = [];
    } else {
        counter[key] = counter[key].filter(time => now - time <= window);
    }

    if (counter[key].length < maxRequests) {
        counter[key].push(now);
        return true;
    }

    return false;
}

module.exports = slidingWindowLog;