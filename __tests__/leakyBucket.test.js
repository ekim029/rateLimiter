
jest.mock("../src/redisClient", () => {
    const Redis = require("ioredis-mock");
    return new Redis();
});

const leakyBucket = require("../src/algorithms/leakyBucket");
const redisClient = require("../src/redisClient");

describe("Leaky Bucket Algorithm", () => {
    let trackingKey = "testUser";
    let option = { capacity: 3, leakRate: 1000, ttl: 10000 };

    beforeEach(async () => {
        await redisClient.flushall();
    });

    test("Make valid requests", async () => {
        for (let i = 0; i < option.capacity; i++) {
            expect(await leakyBucket(trackingKey, option)).toBe(true);
        }
    });

    test("Make invalid request", async () => {
        let option2 = { capacity: 3, leakRate: 0, ttl: 10000 };

        for (let i = 0; i < option2.capacity; i++) {
            expect(await leakyBucket(trackingKey, option2)).toBe(true);
        }
        expect(await leakyBucket(trackingKey, option2)).toBe(false);
    });

    test("Leak makes room for new request", async () => {
        for (let i = 0; i < option.capacity; i++) {
            await leakyBucket(trackingKey, option);
        }

        await new Promise(p => setTimeout(p, 1000));
        expect(await leakyBucket(trackingKey, option)).toBe(true);
    });

    test("Test multiple users", async () => {
        const trackingKey2 = "testUser2";

        for (let i = 0; i < option.capacity; i++) {
            await leakyBucket(trackingKey, option);
        }
        expect(await leakyBucket(trackingKey2, option)).toBe(true);
    })

    test("Bucket resets after TTL", async () => {
        for (let i = 0; i < option.capacity; i++) {
            await leakyBucket(trackingKey, option);
        }
        await new Promise(p => setTimeout(p, 11000));
        expect(await leakyBucket(trackingKey, option)).toBe(true);
    }, 15000);
});