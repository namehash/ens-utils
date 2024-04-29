import { describe, it, expect } from "vitest";

import { addSeconds, buildTimePeriod, buildTimestamp, buildTimestampMs, fromTimestampToDate, msToSeconds, now } from "./time";

describe("msToSeconds() function", () => {
  it("Correctly returns 0s for less than 1000ms params", () => {
    const tests = [
      0n,
      1n,
      100n,
      200n,
      300n,
      400n,
      500n,
      700n,
      800n,
      900n,
      999n,
    ];

    tests.forEach((testMs) => {
      const timestamp = buildTimestampMs(testMs);
      expect(msToSeconds(timestamp).time).toBe(0n);
    });
  });

  it("Correctly returns 1s for params between 1000ms and 1999ms", () => {
    const tests = [1000n, 1001n, 1100n, 1900n, 1999n];

    tests.forEach((testMs) => {
      const timestamp = buildTimestampMs(testMs);
      expect(msToSeconds(timestamp).time).toBe(1n);
    });
  });
});

describe("fromTimestampToDate() function", () => {
  it("Correctly converts UNIX timestamp to Date object", () => {
    const tests = [{ seconds: 0n, expectedDate: new Date(0) }];

    tests.forEach(({ seconds, expectedDate }) => {
      const timestamp = buildTimestamp(seconds);
      expect(fromTimestampToDate(timestamp)).toEqual(expectedDate);
    });
  });

  it("Handles current time correctly", () => {
    const nowTime = Date.now();
    const nowInSeconds = now();

    /*
      Using getMinutes() to avoid false negatives due to milliseconds
      difference between the two date constants creation above.
    */
    expect(fromTimestampToDate(nowInSeconds).getMinutes()).toEqual(
      new Date(nowTime).getMinutes()
    );
  });

  it("Handles extreme future date correctly", () => {
    const timestamp = buildTimestamp(32503680000n); // Year 3000
    const expectedDate = new Date("3000-01-01T00:00:00Z").getTime();

    /*
      Using getMinutes() to avoid false negatives due to milliseconds
      difference between the two date constants creation above.
    */
    expect(fromTimestampToDate(timestamp).getTime()).toEqual(
      expectedDate
    );
  });
});

describe("buildTimePeriod function", () => {
  it("Correctly creates new TimePeriod", () => {
    const nowTime = now();
    const period = buildTimePeriod(nowTime, addSeconds(nowTime, 1000n));

    expect(period.begin).toStrictEqual(nowTime);
    expect(period.end).toStrictEqual(addSeconds(nowTime, 1000n));
  });

  it("Correctly creates new TimePeriod when both Timestamps are equal", () => {
    const nowTime = now();
    const period = buildTimePeriod(nowTime, nowTime);

    expect(period.begin).toStrictEqual(nowTime);
    expect(period.end).toStrictEqual(nowTime);
  });

  it("Throws error on smaller end Timestamp provided", () => {
    const nowTime = now();
    expect(() => {
      buildTimePeriod(addSeconds(nowTime, 1000n), nowTime);
    }).toThrow();
  });
});