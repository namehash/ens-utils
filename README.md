# @namehash/ens-utils

## Install

```bash
npm install @namehash/ens-utils
```

## Usage

### Currency

#### `parseStringToCurrency(str: string): Currency`

```ts
import { parseStringToCurrency } from "@namehash/ens-utils/currency";

const formattedPrice = parseStringToCurrency("ETH");

// formattedPrice equals Currency.Eth
```

### Number

### Time

### Price

#### `priceAsNumber(price: Price): number`

```ts
import { priceAsNumber } from "@namehash/ens-utils/price";

const tenUSDC = {
  value: 100000n,
  currency: Currency.Usdc
}

const tenUsdcAsNumber = priceAsNumber(tenUSDC);

// tenUsdcDollarsAsNumber equals Number(1)
```

#### `numberAsPrice(number: number, currency: Currency): Price`

```ts
import { numberAsPrice } from "@namehash/ens-utils/price";

const fromNumberTenToEthValue = numberAsPrice(10, Currency.Eth);

// fromNumberTenToEthValue equals {
//   value: 10000000000000000000n,
//   currency: Currency.Eth
// }
```

#### `addPrices = (prices: Array<Price>): Price`

```ts
import { addPrices } from "@namehash/ens-utils/price";

const networkFee: Price = {
  value: X,
  currency: Currency.Eth
}
const ethDomainPrice: Price = {
  value: Y,
  currency: Currency.Eth
}

const totalCost = addPrices([
  networkFee,
  ethDomainPrice,
]);

// totalCost equals {
//   value: X + Y,
//   currency: Currency.Eth
// }
```

#### `subtractPrices = (price1: Price, price2: Price): Price`

```ts
import { subtractPrices } from "@namehash/ens-utils/price";

const ethDomainPrice: Price = {
  value: X,
  currency: Currency.Eth
}
const ethDomainPricePremium: Price = {
  value: Y,
  currency: Currency.Eth
}

const totalCost = subtractPrices(
  ethDomainPrice,
  ethDomainPricePremium,
);

// totalCost equals {
//   value: X - Y,
//   currency: Currency.Eth
// }
```

#### `multiplyPriceByNumber = (price1: Price, price2: number): Price`

```ts
import { multiplyPriceByNumber } from "@namehash/ens-utils/price";

const ethDomainPrice: Price = {
  value: X,
  currency: Currency.Eth
}
const multiplier = 2

const totalCost = multiplyPriceByNumber(
  ethDomainPrice,
  multiplier,
);

// totalCost equals {
//   value: X * 2,
//   currency: Currency.Eth
// }
```

#### `formattedPrice = ({ price, withPrefix = false, withSufix = false }: { price: Price; withPrefix?: boolean; withSufix?: boolean }): string`

```ts
import { formattedPrice } from "@namehash/ens-utils/price";

const fiveDollarsInEth = 5000000000000000000n

const a = formattedPrice({
  price: { currency: Currency.Eth, value: fiveDollarsInEth },
})

const b = formattedPrice({
  price: { currency: Currency.Eth, value: fiveDollarsInEth },
  withSufix: true
})

const c = formattedPrice({
  price: { currency: Currency.Eth, value: fiveDollarsInEth },
  withPrefix: true
})

const d = formattedPrice({
  price: { currency: Currency.Eth, value: fiveDollarsInEth },
  withPrefix: true,
  withSufix: true
})

// a equals 5.000
// b equals 5.000 ETH
// c equals Ξ5.000
// d equals Ξ5.000 ETH
```

#### `approxScalePrice = (price: Price, scaleFactor: number, digitsOfPrecision = 20n): Price`

```ts
import { approxScalePrice } from "@namehash/ens-utils/price";

[...]

const decayedPrice = approxScalePrice(PREMIUM_START_PRICE, decayFactor);

// decayedPrice equals PREMIUM_START_PRICE scaled (up or down, depending on decayFactor value) by decayedPrice
```

#### `convertCurrencyWithRates = (price: Price, scaleFactor: number, digitsOfPrecision = 20n): Price`

```ts
import { convertCurrencyWithRates } from "@namehash/ens-utils/price";

const fromUsd = {
  value: 500n,
  currency: Currency.Usd
}

const exchangeRatesRecord = {
  [Currency.Eth]: 2277.56570676,
  [Currency.Usd]: 1
}

const fromUsdToEth = convertCurrencyWithRates(
  fromUsd,
  Currency.Eth,
  exchangeRatesRecord,
);

// fromUsdToEth equals the Eth amount of $5 based on the provided currencies exchange rates
```

#### `PREMIUM_START_PRICE: Price`

At the moment a .eth name expires, this recently released temporary premium is added to its price.
NOTE: The actual recently released temporary premium added subtracts `PREMIUM_OFFSET`.

```ts
const PREMIUM_START_PRICE: Price = {
  value: 10000000000n, // $100,000,000.00 (100 million USD)
  currency: Currency.Usd,
};
```

#### `PREMIUM_DECAY: number`

The recently released temporary premium drops exponentially by 50% each day.

```ts
const PREMIUM_DECAY = 0.5;
```

#### `PREMIUM_DECAY: number`

The recently released temporary premium drops exponentially by 50% each day.

```ts
const PREMIUM_DECAY = 0.5;
```

#### `PREMIUM_OFFSET: Price`

Goal:
 The temporary premium should drop to $0.00 after exactly `PREMIUM_DAYS` days have passed.

Challenge:
 If we decay `PREMIUM_START` by a rate of `PREMIUM_DECAY` each day over the course of
 `PREMIUM_DAYS` days we don't get $0.00 USD. Instead, we get this `PREMIUM_OFFSET` value
 ($47.68 USD).

 Solution:
  Subtract this value from the decayed temporary premium to get the actual temporary premium.

```ts
const PREMIUM_OFFSET = approxScalePrice(
  PREMIUM_START_PRICE,
  PREMIUM_DECAY ** Number(TEMPORARY_PREMIUM_DAYS)
);
```
