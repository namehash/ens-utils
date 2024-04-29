import {
  differenceInDays,
  differenceInHours,
  differenceInWeeks,
  format,
  formatDistanceToNow,
} from "date-fns";

import { bigIntToNumber } from "./number";

export const SECONDS_PER_MINUTE = 60n;
export const SECONDS_PER_HOUR = 60n * SECONDS_PER_MINUTE; // 3,600 seconds
export const SECONDS_PER_DAY = 24n * SECONDS_PER_HOUR; // 86,400 seconds
export const SECONDS_PER_WEEK = 7n * SECONDS_PER_DAY; // 604,800 seconds
export const DAYS_PER_YEAR = 365.2425; // The average Gregorian calendar year is 365.2425 days in length
export const SECONDS_PER_YEAR = BigInt(Number(SECONDS_PER_DAY) * DAYS_PER_YEAR); // 31,556,952 seconds

interface Timestamp {

  /**
   * A Unix timestamp measured in seconds.
   * May be negative to represent a date before the Unix epoch.
   */
  time: bigint;
}

interface TimestampMs {

  /**
  * A Unix timestamp measured in milliseconds.
  * May be negative to represent a date before the Unix epoch.
  */
  timeMs: bigint;
}

export const buildTimestamp = (
  secondsSinceUnixEpoch: bigint,
): Timestamp => {
  return {
    time: secondsSinceUnixEpoch,
  };
};

export const buildTimestampMs = (
  millisecondsSinceUnixEpoch: bigint,
): TimestampMs => {
  return {
    timeMs: millisecondsSinceUnixEpoch,
  };
};

/**
 * Converts milliseconds to seconds.
 * @param ms: The milliseconds to convert.
 * @returns The converted time in seconds.
 */
export const msToSeconds = (ms: TimestampMs): Timestamp => {
  return buildTimestamp(ms.timeMs / 1000n);
};

/**
 * Converts seconds to milliseconds.
 * @param seconds The seconds to convert.
 * @returns The converted time in milliseconds.
 */
export const secondsToMs = (seconds: Timestamp): TimestampMs => {
  return buildTimestampMs(seconds.time * 1000n);
}

/**
 * Retrieves the current time in millisceonds.
 * @returns bigint - The current timestamp in millisceonds.
 */
export const nowMs = (): TimestampMs => {
  // Returns the current time in milliseconds as a BigInt
  return buildTimestampMs(BigInt(Date.now()));
};

/**
 * Retrieves the current time in seconds.
 * @returns The current timestamp in seconds.
 */
export const now = (): Timestamp => {
  // Returns the current time in seconds as a BigInt
  return msToSeconds(nowMs());
};

export const addSeconds = (timestamp: Timestamp, seconds: bigint): Timestamp => {
  return buildTimestamp(timestamp.time + seconds);
}

const shortDateFormat = "d MMM yyyy";

/**
 * Converts from a Timestamp to a Date
 * @param timestamp the Timestamp to convert
 * @returns Date - the converted Date object
 */
export const fromTimestampToDate = (
  timestamp: Timestamp
): Date => {
  return fromTimestampMsToDate(secondsToMs(timestamp));
};

/**
 * Converts from a TimestampMs to a Date
 * @param timestamp the TimestampMs to convert
 * @returns The converted Date object
 */
export const fromTimestampMsToDate = (
  timestamp: TimestampMs
): Date => {
  return new Date(Number(timestamp.timeMs));
};

/**
 * Formats a Timestamp to a string that represents the relative distance to now, optionally with a suffix.
 * @param timestamp: The Timestamp to format.
 * @param addSuffix: boolean = true - Whether to add a suffix to the formatted string.
 * @returns string - The formatted distance string.
 */
export const relativeTimestamp = (
  timestamp: Timestamp,
  addSuffix = true
): string => {
  const result = formatDistanceToNow(fromTimestampToDate(timestamp), {
    addSuffix: addSuffix,
  });

  return result.replace("about ", "").replace("over ", "");
};

/**
 * Formats a Timestamp into a short date format.
 * @param timestamp: The Timestamp to format.
 * @returns string - The date formatted as a short string.
 */
export const getShortTimestampFormat = (timestamp: Timestamp): string => {
  return format(bigIntToNumber(timestamp.time), shortDateFormat);
};

/**
 * Provides a description of a Timestamp, formatted either as a relative distance to now or as a short date.
 * @param timestamp: The Timestamp to describe.
 * @param showAsDistance: boolean - Flag to indicate if the Timestamp should be shown as a distance from now.
 * @param withSufix: boolean = true - Flag to include a suffix in the distance description.
 * @returns string - A string description of the Timestamp.
 */
export const getTimestampDescription = (
  timestamp: Timestamp,
  showAsDistance: boolean,
  withSufix = true
): string => {
  return showAsDistance
    ? relativeTimestamp(timestamp, withSufix)
    : getShortTimestampFormat(timestamp);
};

/**
 * Converts a Timestamp into a formatted string representing local date and time.
 * @param timestamp: The Timestamp to format.
 * @returns string - The localized and formatted date and time string.
 */
export const getFormattedTimestamp = (timestamp: Timestamp): string => {
  const formattedDate = fromTimestampToDate(timestamp);

  return formattedDate.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Returns a pretty string representing the difference between a timestamp and now
 * @param timestamp
 * @returns string
 */
export function prettyTimestampDiffFromNow(timestamp: Timestamp): string {
  const date = fromTimestampToDate(timestamp);
  const nowTime = new Date();

  const diffWeeks = differenceInWeeks(date, nowTime);
  const diffDays = differenceInDays(date, nowTime);
  const diffHours = differenceInHours(date, nowTime);

  if (diffWeeks > 0) {
    return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""}`;
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  } else {
    return "less than an hour";
  }
}

export interface TimePeriod {
  from: Timestamp;
  until: Timestamp; // guaranteed to always be >= from
}

export const buildTimePeriod = (
  from: Timestamp,
  until: Timestamp
): TimePeriod => {
  if (from.time > until.time)
    throw new Error(`Error creating TimePeriod. from ${from.time}} comes after until ${until.time}`);
  return {
    from,
    until
  };
};
