
const validateOption = (option) => {
    const { algorithm } = option;

    switch (algorithm) {
        case "fixedWindow":
        case "slidingWindowLog":
            if (!option.maxRequests || typeof option.maxRequests !== "number") {
                throw new Error(`Invalid maxRequests for ${algorithm}`);
            }
            if (!option.window || typeof option.window !== "number" || option.window < 0) {
                throw new Error(`Invalid window for ${algorithm}`);
            }
            break;

        case "tokenBucket":
            if (!option.capacity || typeof option.capacity !== "number" || option.capacity < 0) {
                throw new Error(`Invalid capacity for ${algorithm}`);
            }
            if (!option.refillRate || typeof option.refillRate !== "number") {
                throw new Error(`Invalid refillRate for ${algorithm}`);
            }
            if (!option.ttl || typeof option.ttl !== "number" || option.ttl < 1) {
                throw new Error(`Invalid ttl for ${algorithm}`);
            }
            break;

        case "leakyBucket":
            if (!option.capacity || typeof option.capacity !== "number" || option.capacity < 0) {
                throw new Error(`Invalid capacity for ${algorithm}`);
            }
            if (!option.leakRate || typeof option.leakRate !== "number") {
                throw new Error(`Invalid leakRate for ${algorithm}`);
            }
            if (!option.ttl || typeof option.ttl !== "number" || option.ttl < 1) {
                throw new Error(`Invalid ttl for ${algorithm}`);
            }
            break;

        default:
            throw new Error(`Unknown algorithm: ${algorithm}`);

    }
}

module.exports = validateOption;