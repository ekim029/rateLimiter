
let counter = {}; // temp memory

const fixedWindow = (trackingKey, option) => {
    const { maxRequests, window } = option;

    const now = Date.now();

    if (!counter[trackingKey] || now - counter[trackingKey].start < window) {
        counter[trackingKey] = { count: 1, start: now };
        return true;
    }

    if (counter[trackingKey] < maxRequests) {
        counter[trackingKey] += 1;
        return true;
    }

    return false;
}

module.exports = fixedWindow;