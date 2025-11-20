
jest.mock("../src/redisClient", () => {
    const Redis = require('ioredis-mock');
    return new Redis();
});

const fixedWindow = require("../src/algorithms/fixedWindow");
const redisClient = require("../src/redisClient");

describe("Fixed Window Algorithm", () => {
    let trackingKey = "testUser";
    let option = { maxRequests: 3, window: 1000 };

    beforeEach(async () => {
        await redisClient.flushall();
    })

    test("Make 4 requests with maxRequests = 3", async () => {
        await fixedWindow(trackingKey, option);
        await fixedWindow(trackingKey, option);
        await fixedWindow(trackingKey, option);
        expect(await fixedWindow(trackingKey, option)).toBe(false);
    });

    test("Reset expired window", async () => {
        await fixedWindow(trackingKey, option);
        await fixedWindow(trackingKey, option);
        await fixedWindow(trackingKey, option);

        await new Promise(p => setTimeout(p, 1000))
        expect(await fixedWindow(trackingKey, option)).toBe(true);
    });

    test("Test multiple users", async () => {
        let trackingKey2 = "testUser2";
        let trackingKey3 = "testUser3";

        await fixedWindow(trackingKey2, option);
        await fixedWindow(trackingKey2, option);
        await fixedWindow(trackingKey2, option);
        await fixedWindow(trackingKey3, option);
        expect(await fixedWindow(trackingKey3, option)).toBe(true);
    });

    test("Window shouldn't yet expire", async () => {
        await fixedWindow(trackingKey, option);
        await fixedWindow(trackingKey, option);
        await fixedWindow(trackingKey, option);

        await new Promise(p => setTimeout(p, option.window / 2))
        expect(await fixedWindow(trackingKey, option)).toBe(false);
    });

    test("Concurrent requests", async () => {
        const user = "concurrentUser";
        const requests = Array(option.maxRequests + 500)
            .fill(0)
            .map(() => fixedWindow(user, option));

        const results = await Promise.all(requests);
        const allowed = results.filter(r => r).length;
        expect(allowed).toBe(option.maxRequests);
    });
})