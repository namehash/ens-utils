import {
  differenceInDays,
  differenceInHours,
  differenceInWeeks,
  format,
  formatDistanceToNow,
} from "date-fns";

import { bigIntToNumber } from "./number";

export const SECONDS_PER_YEAR = 31556952;

export const ONE_MINUTE_IN_SECONDS = 60n;
export const ONE_HOUR_IN_SECONDS = 60n * ONE_MINUTE_IN_SECONDS;
export const ONE_DAY_IN_SECONDS = 24n * ONE_HOUR_IN_SECONDS;
export const ONE_WEEK_IN_SECONDS = 7n * ONE_DAY_IN_SECONDS;

/**
 * Converts milliseconds to seconds.
 * @param ms: bigint - The milliseconds to convert.
 * @returns bigint - The converted time in seconds.
 */
export const msToSeconds = (ms: bigint): bigint => {
  return ms / 1000n;
};

/**
 * Retrieves the current time in seconds.
 * @returns bigint - The current timestamp in seconds.
 */
export const now = (): bigint => {
  // Returns the current time in seconds as a BigInt
  return msToSeconds(BigInt(Date.now()));
};

const shortDateFormat = "d MMM yyyy";

/**
 * Formats a timestamp to a Date object.
 * @param timestamp: bigint - The UNIX timestamp to format, which are the milliseconds since january, 01, 1970.
 * @returns Date - A Date object for the formatted timestamp
 */
export const fromTimestampToDate = (
  timestamp: bigint,
  asSeconds = false
): Date => {
  const ms = asSeconds
    ? bigIntToNumber(timestamp) * 1000
    : bigIntToNumber(timestamp);

  return new Date(ms);
};

/**
 * Formats a timestamp to a string that represents the distance to now, optionally with a suffix.
 * @param timestamp: bigint - The timestamp to format.
 * @param addSuffix: boolean = true - Whether to add a suffix to the formatted string.
 * @returns string - The formatted distance string.
 */
export const timestampAsDistance = (
  timestamp: bigint,
  addSuffix = true
): string => {
  const result = formatDistanceToNow(fromTimestampToDate(timestamp, true), {
    addSuffix: addSuffix,
  });

  return result.replace("about ", "").replace("over ", "");
};

/**
 * Formats a timestamp into a short date format.
 * @param timestamp: bigint - The timestamp to format.
 * @returns string - The date formatted as a short string.
 */
export const getShortTimestampFormat = (timestamp: bigint): string => {
  return format(bigIntToNumber(timestamp), shortDateFormat);
};

/**
 * Provides a description of a timestamp, formatted either as a relative distance to now or as a short date.
 * @param timestamp: bigint - The timestamp to describe.
 * @param showAsDistance: boolean - Flag to indicate if the timestamp should be shown as a distance from now.
 * @param withSufix: boolean = true - Flag to include a suffix in the distance description.
 * @returns string - A string description of the timestamp.
 */
export const getTimestampDescription = (
  timestamp: bigint,
  showAsDistance: boolean,
  withSufix = true
): string => {
  return showAsDistance
    ? timestampAsDistance(timestamp, withSufix)
    : getShortTimestampFormat(timestamp);
};

/**
 * Converts a timestamp into a formatted string representing local date and time.
 * @param timestamp: bigint - The timestamp to format.
 * @returns string - The localized and formatted date and time string.
 */
export const getFormattedTimestamp = (timestamp: bigint): string => {
  const formattedDate = new Date(bigIntToNumber(timestamp));

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
export function prettyTimestampDiffFromNow(timestamp: bigint): string {
  const date = fromTimestampToDate(timestamp, true);
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
