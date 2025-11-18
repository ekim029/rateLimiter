
const checkRateLimit = async (req, option = "tokenBucket") => {
    switch (option) {
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