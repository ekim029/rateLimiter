
jest.mock("../src/redisClient", () => {
    const Redis = require("ioredis-mock");
    return new Redis();
});

const slidingWindowLog = require("../src/algorithms/slidingWindowLog");
const redisClient = require("../src/redisClient");

describe("Sliding Window Algorithm", () => {
    const trackingKey = 'testUser';
    const option = { maxRequests: 4, window: 2000 };

    beforeEach(async () => {
        await redisClient.flushall();
    });

    test("Make 5 requests with maxRequests = 4", async () => {
        await slidingWindowLog(trackingKey, option);
        await slidingWindowLog(trackingKey, option);
        await slidingWindowLog(trackingKey, option);
        await slidingWindowLog(trackingKey, option);
        expect(await slidingWindowLog(trackingKey, option)).toBe(false);
    });

    test("Reset expired window", async () => {
        await slidingWindowLog(trackingKey, option);
        await slidingWindowLog(trackingKey, option);
        await slidingWindowLog(trackingKey, option);

        await new Promise(p => setTimeout(p, 2000))
        expect(await slidingWindowLog(trackingKey, option)).toBe(true);
    });

    test("Test multiple users", async () => {
        let trackingKey2 = "testUser2";

        await slidingWindowLog(trackingKey, option);
        await slidingWindowLog(trackingKey, option);
        await slidingWindowLog(trackingKey, option);
        await slidingWindowLog(trackingKey, option);
        expect(await slidingWindowLog(trackingKey2, option)).toBe(true);
    });


    test("Concurrent requests respect the limit", async () => {
        const user = "concurrentUser";
        const requests = Array(option.maxRequests + 500)
            .fill(0)
            .map(() => slidingWindowLog(user, option));

        const results = await Promise.all(requests);
        const allowed = results.filter(r => r).length;
        expect(allowed).toBe(option.maxRequests);
    });

}); 