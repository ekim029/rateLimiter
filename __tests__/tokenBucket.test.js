
jest.mock("../src/redisClient", () => {
    const Redis = require("ioredis-mock");
    return new Redis();
});

const tokenBucket = require("../src/algorithms/tokenBucket");
const redisClient = require("../src/redisClient");

describe("Token Bucket Algorithm", () => {
    let trackingKey = "testUser";
    let option = { capacity: 3, refillRate: 1, ttl: 10000 };

    beforeEach(async () => {
        await redisClient.flushall();
    })

    test("Make valid requests", async () => {
        for (let i = 0; i < option.capacity; i++) {
            expect(await tokenBucket(trackingKey, option)).toBe(true);
        }
    });

    test("Make invalid request", async () => {
        for (let i = 0; i < option.capacity; i++) {
            expect(await tokenBucket(trackingKey, option)).toBe(true);
        }
        expect(await tokenBucket(trackingKey, option)).toBe(false);
    });

    test("Refill tokens", async () => {
        for (let i = 0; i < option.capacity; i++) {
            await tokenBucket(trackingKey, option);
        }

        await new Promise(r => setTimeout(r, 2000));
        for (let i = 0; i < 2; i++) {
            expect(await tokenBucket(trackingKey, option)).toBe(true);
        }

        expect(await tokenBucket(trackingKey, option)).toBe(false);
    });

    test("Test multiple users", async () => {
        const trackingKey2 = "testUser2";

        for (let i = 0; i < option.capacity; i++) {
            await tokenBucket(trackingKey, option);
        }
        expect(await tokenBucket(trackingKey2, option)).toBe(true);
    })

    test("Reset tokens after ttl", async () => {
        for (let i = 0; i < option.capacity; i++) {
            await tokenBucket(trackingKey, option);
        }

        await new Promise(p => setTimeout(p, 11000));
        expect(await tokenBucket(trackingKey, option)).toBe(true);
    }, 15000);
});