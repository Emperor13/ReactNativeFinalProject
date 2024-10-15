import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { pickerSelectStyles2, styleCovert } from "../styles/styles";

type CountryOption = { label: string; value: string; flag: string };

const Convert = () => {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>("JPY");
  const [toCurrency, setToCurrency] = useState<string>("THB");
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [amount, setAmount] = useState<string>("0.00");
  const [history, setHistory] = useState<
    {
      from: string;
      to: string;
      rate: number;
      amount: string;
      result: string;
      fromFlag: string;
      toFlag: string;
      timestamp: string;
    }[]
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

  const findFlagByCurrency = (currencyCode: string) => {
    const country = countries.find((c) => c.value.includes(currencyCode));
    return country ? country.flag : null;
  };

  const handleFocus = () => {
    setAmount("");
  };

  const handleBlur = () => {
    if (amount === "") {
      setAmount("0.00");
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const addToHistory = () => {
    if (exchangeRate) {
      const result = (parseFloat(amount) * exchangeRate).toFixed(2);
      const timestamp = new Date().toLocaleString();
      const fromFlag = findFlagByCurrency(fromCurrency);
      const toFlag = findFlagByCurrency(toCurrency);
      setHistory([
        ...history,
        {
          from: fromCurrency,
          to: toCurrency,
          rate: exchangeRate,
          amount,
          result,
          fromFlag: fromFlag || "",
          toFlag: toFlag || "",
          timestamp,
        },
      ]);
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleSubmission = () => {
    if (amount.trim() === "" || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    addToHistory();
  };

  const fromCurrencyFlag = findFlagByCurrency(fromCurrency);
  const toCurrencyFlag = findFlagByCurrency(toCurrency);

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <View style={styleCovert.containerTop}>
            <View style={styleCovert.resultRateText}>
              <Text style={styleCovert.resultText}>Convert Currency</Text>
            </View>

            <View style={styleCovert.inputRow}>
              {fromCurrencyFlag && (
                <Image
                  source={{ uri: fromCurrencyFlag }}
                  style={styleCovert.flag}
                />
              )}
              <RNPickerSelect
                onValueChange={(value) => setFromCurrency(value)}
                items={countries}
                value={fromCurrency}
                placeholder={{ label: "เลือกสกุลเงิน", value: null }}
                style={pickerSelectStyles2}
              />
              <View style={styleCovert.separator} />
              <TextInput
                style={styleCovert.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onSubmitEditing={handleSubmission}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                swapCurrencies();
              }}
              style={styleCovert.swapButtonTop}
            >
              <Icon name="swap-horizontal" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styleCovert.inputRow}>
              {toCurrencyFlag && (
                <Image
                  source={{ uri: toCurrencyFlag }}
                  style={styleCovert.flag}
                />
              )}
              <RNPickerSelect
                onValueChange={(value) => setToCurrency(value)}
                items={countries}
                value={toCurrency}
                placeholder={{ label: "เลือกสกุลเงิน", value: null }}
                style={pickerSelectStyles2}
              />
              <View style={styleCovert.separator} />
              <TextInput
                style={styleCovert.input}
                value={
                  exchangeRate && !isNaN(parseFloat(amount))
                    ? (parseFloat(amount) * exchangeRate).toFixed(2)
                    : "0.00"
                }
                editable={false}
              />
            </View>
          </View>

          {/* ส่วนแสดงประวัติการแปลงค่า */}
          <View style={styleCovert.containerBottom}>
            <View style={styleCovert.historyHeader}>
              <Text style={styleCovert.HistoryText}>History</Text>
              <TouchableOpacity
                onPress={clearHistory}
                style={styleCovert.clearButton}
              >
                <Text style={styleCovert.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {history.map((entry, index) => (
                <View key={index} style={styleCovert.historyRow}>
                  <View style={styleCovert.historyInfo}>
                    <View style={styleCovert.showCountryLeft}>
                      <Image
                        source={{ uri: entry.fromFlag }}
                        style={styleCovert.historyFlag}
                      />
                      <Text
                        style={styleCovert.currencyValueLeft}
                      >{`${entry.amount} ${entry.from}`}</Text>
                    </View>

                    <Icon
                      name="swap-horizontal"
                      size={23}
                      color="#676767"
                      style={styleCovert.swapIcon}
                    />

                    <View style={styleCovert.showCountryRight}>
                      <Image
                        source={{ uri: entry.toFlag }}
                        style={styleCovert.historyFlag}
                      />
                      <Text
                        style={styleCovert.currencyValueRight}
                      >{`${entry.result} ${entry.to}`}</Text>
                    </View>
                  </View>

                  <View style={styleCovert.dateInfo}>
                    <Text
                      style={styleCovert.Date}
                    >{`Time: ${entry.timestamp}`}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
  );
};

export default Convert;
