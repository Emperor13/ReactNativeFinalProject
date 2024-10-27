import { http } from "./http-service";

export type CountryOption = { label: string; value: string; flag: string };

export async function getCountries() {
  try {
    const res = await http.get("https://restcountries.com/v3.1/all");
    const countryData = res.data.map((country: any) => ({
      label: `${country.name.common} (${Object.keys(
        country.currencies || {}
      ).join(", ")})`,
      value: Object.keys(country.currencies || {}).join(", "),
      flag: country.flags.png,
    }));
    const sortedCountries = countryData.sort(
      (a: CountryOption, b: CountryOption) => a.label.localeCompare(b.label)
    );
    return sortedCountries;
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    throw error;
  }
}

export async function getExchangeRate(from: string, to: string) {
  try {
    const response = await http.get(
      `https://api.exchangerate-api.com/v4/latest/${from}`
    );
    const rate = response.data.rates[to];
    return rate;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
  }
}
