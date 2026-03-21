import { getCurrencyForCountry, getExchangeRate } from "./currency";

export const AFRICAN_COUNTRIES = [
  "Algeria",
  "Angola",
  "Benin",
  "Botswana",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cameroon",
  "Central African Republic",
  "Chad",
  "Comoros",
  "Congo",
  "Congo (Democratic Republic of the)",
  "Djibouti",
  "Egypt",
  "Equatorial Guinea",
  "Eritrea",
  "Eswatini",
  "Ethiopia",
  "Gabon",
  "Gambia",
  "Ghana",
  "Guinea",
  "Guinea-Bissau",
  "Ivory Coast",
  "Kenya",
  "Lesotho",
  "Liberia",
  "Libya",
  "Madagascar",
  "Malawi",
  "Mali",
  "Mauritania",
  "Mauritius",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Niger",
  "Nigeria",
  "Rwanda",
  "Sao Tome and Principe",
  "Senegal",
  "Seychelles",
  "Sierra Leone",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Sudan",
  "Tanzania",
  "Togo",
  "Tunisia",
  "Uganda",
  "Zambia",
  "Zimbabwe",
];

export function getPriceMultiplier(country) {
  if (!country) return 1;

  // If the country is in Africa, use base price (multiplier 1)
  if (AFRICAN_COUNTRIES.includes(country)) {
    return 1;
  }

  // Otherwise, it's a "good economy" country (multiplier 4)
  return 4;
}

export function calculateAdjustedPrice(basePrice, country) {
  const multiplier = getPriceMultiplier(country);
  return basePrice * multiplier;
}

export async function convertAndAdjustPrice(
  basePrice,
  baseCurrency,
  targetCountry,
) {
  const multiplier = getPriceMultiplier(targetCountry);
  const targetCurrency = getCurrencyForCountry(targetCountry);

  const adjustedPrice = basePrice * multiplier;

  if (baseCurrency === targetCurrency) {
    return {
      price: adjustedPrice,
      currency: targetCurrency,
    };
  }

  const rate = await getExchangeRate(baseCurrency, targetCurrency);
  const convertedPrice = adjustedPrice * rate;

  return {
    price: convertedPrice,
    currency: targetCurrency,
  };
}
