import { Currency, PriceCurrencyFormat } from "./currency";
import { approxScaleBigInt } from "./number";
import {
  GRACE_PERIOD,
  ONE_DAY_IN_SECONDS,
  TEMPORARY_PREMIUM_DAYS,
} from "./time";

export type Price = {
  value: bigint;
  currency: Currency;
};

// An ExchangeRates object maps different currencies to their rate in USD,
// which is a number value. One example of an ExchangeRates object would be:
// { ETH: 1737.16, DAI: 0.99999703, USDC: 1, WETH: 1737.16, USD: 1 }
export type ExchangeRates = Record<Currency, number>;

export const priceAsNumber = (price: Price): number => {
  return (
    Number(price.value) /
    10 ** Number(PriceCurrencyFormat[price.currency].Decimals)
  );
};

export const numberAsPrice = (number: number, currency: Currency): Price => {
  const currencyDecimals = Number(PriceCurrencyFormat[currency].Decimals);

  // Fix the number's displayed decimals (e.g. from 0.00001 to 0.00001)
  const numberWithCorrectCurrencyDecimals = Number(
    number.toFixed(currencyDecimals)
  );

  // Remove the decimals from the number (e.g. from 0.00001 to 1)
  const numberWithoutDecimals = Number(
    numberWithCorrectCurrencyDecimals * 10 ** currencyDecimals
  ).toFixed(0);

  /*
    Below Number() conversion deals with possibility of scientific notation being
    returned from toFixed() method call in "numberWithoutDecimals" definition
  */
  const numberReadyToBeConvertedToBigInt = Number(numberWithoutDecimals);

  // Safely convert the number to BigInt
  return {
    value: BigInt(numberReadyToBeConvertedToBigInt),
    currency,
  };
};

export const addPrices = (prices: Array<Price>): Price => {
  const currency = prices[0].currency;

  if (prices.some((price) => price.currency !== currency)) {
    const currencies = prices.map((price) => price.currency).join(", ");

    throw new Error(`Cannot add prices of different currencies: ${currencies}`);
  } else {
    return {
      currency: currency,
      value: prices.reduce((accumulator: bigint, price: Price) => {
        return accumulator + price.value;
      }, 0n),
    };
  }
};

export const subtractPrices = (price1: Price, price2: Price): Price => {
  if (price1.currency !== price2.currency) {
    throw new Error(
      `Cannot subtract price of currency ${price1.currency} to price of currency ${price2.currency}`
    );
  } else {
    return {
      currency: price1.currency,
      value: price1.value - price2.value,
    };
  }
};

export const multiplyPriceByNumber = (price1: Price, price2: number): Price => {
  const inputNumberAsPrice = numberAsPrice(price2, price1.currency);

  return {
    value:
      (price1.value * inputNumberAsPrice.value) /
      10n ** PriceCurrencyFormat[price1.currency].Decimals,
    currency: price1.currency,
  };
};

export const formattedPrice = ({
  price,
  withPrefix = false,
  withSufix = false,
}: {
  price: Price;
  withPrefix?: boolean;
  withSufix?: boolean;
}): string => {
  let formattedAmount = "";
  const valueConsideringDecimals = (
    Number(price.value) /
    10 ** Number(PriceCurrencyFormat[price.currency].Decimals)
  ).toFixed(Number(PriceCurrencyFormat[price.currency].DisplayDecimals));
  const numericValue = Number(valueConsideringDecimals);

  const minimumCurrencyPrice =
    PriceCurrencyFormat[price.currency].MinDisplayValue;
  const valueIsLessThanCurrencyMinimum = price.value <= minimumCurrencyPrice;

  const wouldDisplayAsZero = numericValue == 0.0;
  if (
    (wouldDisplayAsZero && price.value != 0n) ||
    valueIsLessThanCurrencyMinimum
  ) {
    // If formatted number is 0.0 but real 'value' is not 0, then we show the Underflow price
    formattedAmount = String(
      PriceCurrencyFormat[price.currency].MinDisplayValue
    );
  } else if (wouldDisplayAsZero && price.value == 0n) {
    // But if the real 'value' is really 0, then we show 0.00 (in the correct number of Display Decimals)
    const prefix = "0.";
    formattedAmount = prefix.padEnd(
      Number(PriceCurrencyFormat[price.currency].DisplayDecimals) +
        prefix.length,
      "0"
    );
  }

  const displayNumber = !!formattedAmount
    ? Number(formattedAmount)
    : numericValue;

  formattedAmount = displayNumber.toLocaleString("en-US", {
    minimumFractionDigits: Number(
      PriceCurrencyFormat[price.currency].DisplayDecimals
    ),
    maximumFractionDigits: Number(
      PriceCurrencyFormat[price.currency].DisplayDecimals
    ),
  });

  if (numericValue > PriceCurrencyFormat[price.currency].MaxDisplayValue) {
    formattedAmount = PriceCurrencyFormat[price.currency].OverflowDisplayPrice;
  }

  const prefixUnit = withPrefix
    ? PriceCurrencyFormat[price.currency].Symbol
    : "";
  const postfixUnit = withSufix
    ? PriceCurrencyFormat[price.currency].Acronym
    : "";

  let priceDisplay =
    prefixUnit && prefixUnit !== postfixUnit
      ? prefixUnit + formattedAmount
      : formattedAmount;
  if (postfixUnit) priceDisplay += ` ${postfixUnit}`;
  return priceDisplay;
};

export const approxScalePrice = (
  price: Price,
  scaleFactor: number,
  digitsOfPrecision = 20n
): Price => {
  return {
    value: approxScaleBigInt(price.value, scaleFactor, digitsOfPrecision),
    currency: price.currency,
  };
};

export const convertCurrencyWithRates = (
  fromPrice: Price,
  toCurrency: Currency,
  exchangeRates: ExchangeRates
): Price => {
  const rate = exchangeRates[fromPrice.currency] / exchangeRates[toCurrency];
  const valueAsNumber = priceAsNumber(fromPrice);
  const exchangedValue = valueAsNumber * rate;
  const exchangedValuePrice = numberAsPrice(exchangedValue, toCurrency);

  return exchangedValuePrice;
};

export function temporaryPremiumPriceAtTimestamp(
  atTimestamp: bigint,
  expirationTimestamp: bigint
): Price {
  const releasedTimestamp = expirationTimestamp + GRACE_PERIOD;
  const secondsSinceRelease = atTimestamp - releasedTimestamp;
  if (secondsSinceRelease < 0) {
    // if as of the moment of `atTimestamp` a name hasn't expired yet then there is no temporaryPremium
    return {
      value: 0n,
      currency: Currency.Usd,
    };
  }

  const fractionalDaysSinceRelease =
    Number(secondsSinceRelease) / Number(ONE_DAY_IN_SECONDS);

  const decayFactor = PREMIUM_DECAY ** fractionalDaysSinceRelease;

  const decayedPrice = approxScalePrice(PREMIUM_START_PRICE, decayFactor);
  const offsetDecayedPrice = subtractPrices(decayedPrice, PREMIUM_OFFSET);

  // the temporary premium can never be less than $0.00
  if (offsetDecayedPrice.value < 0n) {
    return {
      value: 0n,
      currency: Currency.Usd,
    };
  }

  return offsetDecayedPrice;
}

/**
 * At the moment a .eth name expires, this recently released temporary premium is added to its price.
 * NOTE: The actual recently released temporary premium added subtracts `PREMIUM_OFFSET`.
 */
export const PREMIUM_START_PRICE: Price = {
  value: 10000000000n, // $100,000,000.00 (100 million USD)
  currency: Currency.Usd,
};

/**
 * The recently released temporary premium drops exponentially by 50% each day.
 */
export const PREMIUM_DECAY = 0.5;

/**
 * Goal:
 *  The temporary premium should drop to $0.00 after exactly `PREMIUM_DAYS` days have passed.
 *
 * Challenge:
 *  If we decay `PREMIUM_START` by a rate of `PREMIUM_DECAY` each day over the course of
 *  `PREMIUM_DAYS` days we don't get $0.00 USD. Instead, we get this `PREMIUM_OFFSET` value
 *  ($47.68 USD).
 *
 * Solution:
 *  Subtract this value from the decayed temporary premium to get the actual temporary premium.
 */
export const PREMIUM_OFFSET = approxScalePrice(
  PREMIUM_START_PRICE,
  PREMIUM_DECAY ** Number(TEMPORARY_PREMIUM_DAYS)
);
