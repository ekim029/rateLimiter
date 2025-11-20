
const express = require('express');
const rateLimiter = require('./middleware/rateLimiter');
require('dotenv').config();

const app = express();

const rateLimiterConfigs = [
    {
        algorithm: 'fixedWindow',
        identifier: process.env.FIXED_WINDOW_IDENTIFIER,
        maxRequests: parseInt(process.env.FIXED_WINDOW_MAX_REQUESTS, 10),
        window: parseInt(process.env.FIXED_WINDOW_WINDOW, 10)
    },
    {
        algorithm: 'slidingWindowLog',
        identifier: process.env.SLIDING_WINDOW_LOG_IDENTIFIER,
        maxRequests: parseInt(process.env.SLIDING_WINDOW_LOG_MAX_REQUESTS, 10),
        window: parseInt(process.env.SLIDING_WINDOW_LOG_WINDOW, 10)
    },
    {
        algorithm: 'leakyBucket',
        identifier: process.env.LEAKY_BUCKET_IDENTIFIER,
        capacity: parseInt(process.env.LEAKY_BUCKET_CAPACITY, 10),
        leakRate: parseFloat(process.env.LEAKY_BUCKET_LEAK_RATE),
        ttl: parseFloat(process.env.LEAKY_BUCKET_TTL)
    },
    {
        algorithm: 'tokenBucket',
        identifier: process.env.TOKEN_BUCKET_IDENTIFIER,
        capacity: parseInt(process.env.TOKEN_BUCKET_CAPACITY, 10),
        refillRate: parseFloat(process.env.TOKEN_BUCKET_REFILL_RATE),
        ttl: parseFloat(process.env.TOKEN_BUCKET_TTL)
    }
];

app.use(rateLimiter(rateLimiterConfigs));

app.get('/api', (req, res) => {
    res.send("Response");
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
