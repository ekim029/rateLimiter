
const validateOption = (option) => {
    const { algorithm } = option;

    switch (algorithm) {
        case "fixedWindow":
        case "slidingWindowLog":
            if (!option.maxRequests || typeof option.maxRequests !== "number") {
                throw new Error(`Invalid max Requests for ${algorithm}`);
            }
            if (!option.window || typeof option.window !== "number") {
                throw new Error(`Invalid window for ${algorithm}`);
            }
            break;

        case "tokenBucket":
            if (!option.maxRequests || typeof option.maxRequests !== "number") {
                throw new Error(`Invalid maxRequests for ${algorithm}`);
            }
            if (!option.refillRate || typeof option.refillRate !== "number") {
                throw new Error(`Invalid refill Rate for ${algorithm}`);
            }
            break;

        case "leakyBucket":
            if (!option.maxRequests || typeof option.maxRequests !== "number") {
                throw new Error(`Invalid maxRequests for ${algorithm}`);
            }
            if (!option.leakRate || typeof option.leakRate !== "number") {
                throw new Error(`Invalid leak Rate for ${algorithm}`);
            }
            break;

        default:
            throw new Error(`Unknown algorithm: ${algorithm}`);

    }
}

module.exports = validateOption;