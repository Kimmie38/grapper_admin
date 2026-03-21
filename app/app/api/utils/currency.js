export const COUNTRY_TO_CURRENCY = {
  Algeria: "DZD",
  Angola: "AOA",
  Benin: "XOF",
  Botswana: "BWP",
  "Burkina Faso": "XOF",
  Burundi: "BIF",
  "Cabo Verde": "CVE",
  Cameroon: "XAF",
  "Central African Republic": "XAF",
  Chad: "XAF",
  Comoros: "KMF",
  Congo: "XAF",
  "Congo (Democratic Republic of the)": "CDF",
  Djibouti: "DJF",
  Egypt: "EGP",
  "Equatorial Guinea": "XAF",
  Eritrea: "ERN",
  Eswatini: "SZL",
  Ethiopia: "ETB",
  Gabon: "XAF",
  Gambia: "GMD",
  Ghana: "GHS",
  Guinea: "GNF",
  "Guinea-Bissau": "XOF",
  "Ivory Coast": "XOF",
  Kenya: "KES",
  Lesotho: "LSL",
  Liberia: "LRD",
  Libya: "LYD",
  Madagascar: "MGA",
  Malawi: "MWK",
  Mali: "XOF",
  Mauritania: "MRU",
  Mauritius: "MUR",
  Morocco: "MAD",
  Mozambique: "MZN",
  Namibia: "NAD",
  Niger: "XOF",
  Nigeria: "NGN",
  Rwanda: "RWF",
  "Sao Tome and Principe": "STN",
  Senegal: "XOF",
  Seychelles: "SCR",
  "Sierra Leone": "SLL",
  Somalia: "SOS",
  "South Africa": "ZAR",
  "South Sudan": "SSP",
  Sudan: "SDG",
  Tanzania: "TZS",
  Togo: "XOF",
  Tunisia: "TND",
  Uganda: "UGX",
  Zambia: "ZMW",
  Zimbabwe: "ZWL",
  "United States": "USD",
  Canada: "CAD",
  "United Kingdom": "GBP",
  Germany: "EUR",
  France: "EUR",
  Italy: "EUR",
  Spain: "EUR",
  Netherlands: "EUR",
  Belgium: "EUR",
  Switzerland: "CHF",
  Japan: "JPY",
  China: "CNY",
  India: "INR",
  Australia: "AUD",
  "New Zealand": "NZD",
  Brazil: "BRL",
  Mexico: "MXN",
  "United Arab Emirates": "AED",
  "Saudi Arabia": "SAR",
  Israel: "ILS",
  "South Korea": "KRW",
  Singapore: "SGD",
  "Hong Kong": "HKD",
  Turkey: "TRY",
  Russia: "RUB",
};

export async function getExchangeRate(from, to) {
  if (from === to) return 1;

  try {
    // Using Frankfurter API (free, no key required for basic usage)
    const response = await fetch(
      `https://api.frankfurter.app/latest?from=${from}&to=${to}`,
    );
    if (!response.ok) {
      // Fallback or handle error
      console.error(`Failed to fetch exchange rate from ${from} to ${to}`);
      return 1;
    }
    const data = await response.json();
    return data.rates[to] || 1;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return 1;
  }
}

export function getCurrencyForCountry(country) {
  return COUNTRY_TO_CURRENCY[country] || "USD";
}
