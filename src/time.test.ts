import { describe, it, expect } from "vitest";

import { fromTimestampToDate, msToSeconds, now } from "./time";

describe("msToSeconds() function", () => {
  it("Correctly returns zero for less than 1000ms params", () => {
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

    tests.forEach((test) => {
      expect(msToSeconds(test)).toBe(0n);
    });
  });

  it("Correctly returns one for params between 1000ms and 1999ms", () => {
    const tests = [1000n, 1001n, 1100n, 1900n, 1999n];

    tests.forEach((test) => {
      expect(msToSeconds(test)).toBe(1n);
    });
  });
});

describe("fromTimestampToDate() function", () => {
  it("Correctly converts UNIX timestamp to Date object", () => {
    const tests = [{ timestamp: 0n, expectedDate: new Date(0) }];

    tests.forEach(({ timestamp, expectedDate }) => {
      expect(fromTimestampToDate(timestamp, true)).toEqual(expectedDate);
    });
  });

  it("Handles current time correctly", () => {
    const nowTime = Date.now();
    const nowInSeconds = now();

    /*
      Using getMinutes() to avoid false negatives due to milliseconds
      difference between the two date constants creation above.
    */
    expect(fromTimestampToDate(nowInSeconds, true).getMinutes()).toEqual(
      new Date(nowTime).getMinutes()
    );
  });

  it("Handles extreme future date correctly", () => {
    const timestamp = 32503680000n; // Year 3000
    const expectedDate = new Date("3000-01-01T00:00:00Z").getTime();

    /*
      Using getMinutes() to avoid false negatives due to milliseconds
      difference between the two date constants creation above.
    */
    expect(fromTimestampToDate(timestamp, true).getTime()).toEqual(
      expectedDate
    );
  });
});
