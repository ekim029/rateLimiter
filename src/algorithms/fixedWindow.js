const redis = require('../redisClient');

const fixedWindow = async (trackingKey, option) => {
    const { maxRequests, window } = option;
    let key = `fixedWindow:${trackingKey}`;

    const script = `
        local max = tonumber(ARGV[1])
        local window = tonumber(ARGV[2])

        local count = redis.call("INCR", KEYS[1])
        if count == 1 then
            redis.call("PEXPIRE", KEYS[1], window)
        end
        
        return count <= max
    `;

    const allowed = await redis.eval(script, 1, key, maxRequests, window);
    return allowed;
}

module.exports = fixedWindow;