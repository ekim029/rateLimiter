
let counter = {}; // temp memory

const fixedWindow = (req, option) => {
    const { maxRequests, window } = option;

    const key = req.ip;
    const now = Date.now();

    if (!counter[key] || now - counter[key].start < window) {
        counter[key] = { count: 1, start: now };
        return true;
    }

    if (counter[key] < maxRequests) {
        counter[key] += 1;
        return true;
    }

    return false;
}

module.exports = fixedWindow;