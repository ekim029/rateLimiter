const fixedWindow = require('../algorithms/fixedWindow');
const slidingWindowLog = require('../algorithms/slidingWindowLog');
const tokenBucket = require('../algorithms/tokenBucket');
const leakyBucket = require('../algorithms/leakyBucket');
const validateOption = require('./validator');

const checkRateLimit = async (trackingKey, option) => {
    validateOption(option);

    const { algorithm } = option;

    switch (algorithm) {
        case "fixedWindow":
            return fixedWindow(trackingKey, option);
        case "slidingWindowLog":
            return slidingWindowLog(trackingKey, option);
        case "tokenBucket":
            return tokenBucket(trackingKey, option);
        case "leakyBucket":
            return leakyBucket(trackingKey, option);
    }
}

module.exports = checkRateLimit;