
const checkRateLimit = async (req, option) => {
    const { algorithm } = option;

    switch (algorithm) {
        case "fixedWindow":
            return
        case "slidingWindowLog":
            return
        case "tokenBucket":
            return
        case "leakyBucket":
            return
        default:
            return
    }
}

module.exports = { checkRateLimit }