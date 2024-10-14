import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { styleCurrencyRate, pickerSelectStyles } from "../styles/styles";

// ติดตั้ง 2 อย่างนี้เพื่อใช้ Dropdown กับ Icon
// npm install react-native-picker-select
// npm install react-native-vector-icons

type CountryOption = { label: string; value: string; flag: string };

const CurrencyRate = () => {
  const [countries, setCountries] = useState<
    { label: string; value: string; flag: string }[]
  >([]);
  const [fromCurrency, setFromCurrency] = useState<string>("JPY");
  const [toCurrency, setToCurrency] = useState<string>("THB");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>("1");
  const [allRates, setAllRates] = useState<
    { currency: string; rate: number; reversed: boolean }[]
  >([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countryData = response.data.map((country: any) => ({
          label: `${country.name.common} (${Object.keys(
            country.currencies || {}
          ).join(", ")})`,
          value: Object.keys(country.currencies || {}).join(", "),
          flag: country.flags.png,
        }));
        const sortedCountries = countryData.sort(
          (a: CountryOption, b: CountryOption) => a.label.localeCompare(b.label)
        );
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (fromCurrency && toCurrency) {
        try {
          const response = await axios.get(
            `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
          );
          const rate = response.data.rates[toCurrency];
          setExchangeRate(rate);
        } catch (error) {
          console.error("Error fetching exchange rate:", error);
        }
      }
    };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    const fetchAllRates = async () => {
      try {
        const response = await axios.get(
          `https://api.exchangerate-api.com/v4/latest/THB`
        );
        // setAllRates(response.data.rates);
        const rates = response.data.rates;
        const rateArray = Object.keys(rates).map((currency) => ({
          currency,
          rate: rates[currency],
          reversed: false,
        }));
        setAllRates(rateArray);
      } catch (error) {
        console.error("Error fetching all rates:", error);
      }
    };

    fetchAllRates();
  }, []);

  const findFlagByCurrency = (currencyCode: string) => {
    const country = countries.find((c) => c.value.includes(currencyCode));
    return country ? country.flag : null;
  };

  const toggleRowReversal = (index: number) => {
    setAllRates((prevRates) =>
      prevRates.map((rate, idx) =>
        idx === index ? { ...rate, reversed: !rate.reversed } : rate
      )
    );
  };

  return (
    <>
      <View style={styleCurrencyRate.containerTop}>
        <View style={styleCurrencyRate.resultRateText}>
          <Text style={styleCurrencyRate.exchangeText}>1 {fromCurrency} equals</Text>
          <Text style={styleCurrencyRate.resultText}>
            {exchangeRate} {toCurrency}
          </Text>
        </View>

        <View style={styleCurrencyRate.inputRow}>
          <TextInput
            style={styleCurrencyRate.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <View style={styleCurrencyRate.separator} />
          <RNPickerSelect
            onValueChange={(value) => setFromCurrency(value)}
            items={countries}
            value={fromCurrency}
            placeholder={{ label: "เลือกสกุลเงิน", value: null }}
            style={pickerSelectStyles}
          />
        </View>

        <View style={styleCurrencyRate.inputRow}>
          <TextInput
            style={styleCurrencyRate.input}
            value={
              exchangeRate
                ? (parseFloat(amount) * exchangeRate).toFixed(2)
                : "0"
            }
            editable={false}
          />
          <View style={styleCurrencyRate.separator} />
          <RNPickerSelect
            onValueChange={(value) => setToCurrency(value)}
            items={countries}
            value={toCurrency}
            placeholder={{ label: "เลือกสกุลเงิน", value: null }}
            style={pickerSelectStyles}
          />
        </View>
      </View>

      <View style={styleCurrencyRate.containerBottom}>
        <Text style={styleCurrencyRate.rateTodayText}>Rate Today</Text>
        <ScrollView>
          {Array.isArray(allRates) &&
            allRates.map((rateData, index) => {
              const { currency, rate, reversed } = rateData;
              const displayRate = reversed ? rate : 1 / rate;
              const allFlag = reversed
                ? "https://flagpedia.net/data/flags/h80/th.png"
                : findFlagByCurrency(currency);
              const thaiFlag = reversed
                ? findFlagByCurrency(currency)
                : "https://flagpedia.net/data/flags/h80/th.png";

              return (
                <View key={index} style={styleCurrencyRate.currencyRow}>
                  <View style={styleCurrencyRate.showCountries}>
                    {allFlag ? (
                      <Image source={{ uri: allFlag }} style={styleCurrencyRate.flag} />
                    ) : (
                      <ActivityIndicator size="small" color="#0000ff" />
                    )}
                    <Text style={styleCurrencyRate.currencyName}>
                      {reversed ? "1 THB" : `1 ${currency}`}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => toggleRowReversal(index)}
                    style={styleCurrencyRate.swapButton}
                  >
                    <Icon name="swap-horizontal" size={28} color="#ffffff" />
                  </TouchableOpacity>

                  <View style={styleCurrencyRate.showThailandFlag}>
                    {thaiFlag ? (
                      <Image source={{ uri: thaiFlag }} style={styleCurrencyRate.flag} />
                    ) : (
                      <ActivityIndicator size="small" color="#0000ff" />
                    )}
                    <Text style={styleCurrencyRate.currencyValue}>
                      {displayRate.toFixed(2)} {reversed ? currency : "THB"}
                    </Text>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </View>
    </>
  );
};

export default CurrencyRate;