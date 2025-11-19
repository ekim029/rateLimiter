const fixedWindow = require('../algorithms/fixedWindow');
const slidingWindowLog = require('../algorithms/slidingWindowLog');
const tokenBucket = require('../algorithms/tokenBucket');
const leakyBucket = require('../algorithms/leakyBucket');

const checkRateLimit = async (req, option) => {

    const { algorithm } = option;

    switch (algorithm) {
        case "fixedWindow":
            return fixedWindow(req, option);
        case "slidingWindowLog":
            return slidingWindowLog(req, option);
        case "tokenBucket":
            return tokenBucket(req, option);
        case "leakyBucket":
            return leakyBucket(req, option);
    }
}

module.exports = checkRateLimit;