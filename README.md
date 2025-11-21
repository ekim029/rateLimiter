# rateLimiter

Node.js middleware for API rate limiting with configurable algorithms.

## Overview

This middleware provides flexible rate limiting for your Express application. It supports multiple identification methods per request:

- **apiKey**: For requests authenticated with an API key.
- **userId**: For logged-in users. Expects `req.user.id` to exist (from your authentication middleware).
- **IP**: Defaults to the request’s IP if no other identifiers are present.

The middleware chooses the identifier in this priority order:

**apiKey → userId → IP**

Supported rate limiting algorithms include:

- Fixed Window
- Sliding Window Log
- Token Bucket
- Leaky Bucket

## Usage

See `app.js` in this project for a working example of how to attach the middleware and configure the rate limiter.

**Key points:**

1. Define an array of rate limiter configurations specifying the algorithm, identifier (`apiKey`, `userId`, or `ip`), and limits.
2. Attach the middleware via:
   ```js
   app.use(rateLimiter(configs));
