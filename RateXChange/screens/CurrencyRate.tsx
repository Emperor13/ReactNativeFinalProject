import React, { useState, useEffect, useLayoutEffect } from "react";
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
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { HeaderButton, HeaderButtons, Item } from "react-navigation-header-buttons";
import { logout } from "../services/auth-service";
import { setIsLogin } from "../auth/auth-slice";
import { useAppDispatch } from "../redux-toolkit/hooks";
import { getCountries, getExchangeRate } from "../services/currency-service";

type CountryOption = { label: string; value: string; flag: string };

const MaterialHeaderButton = (props: any) => (
  // the `props` here come from <Item ... />
  // you may access them and pass something else to `HeaderButton` if you like
  <HeaderButton
    IconComponent={MaterialIcon}
    iconSize={23}
    color={"white"}
    {...props}
  />
);

const CurrencyRate = ({ navigation }: any):React.JSX.Element => {
  const dispatch = useAppDispatch();
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>("JPY");
  const [toCurrency, setToCurrency] = useState<string>("THB");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>("1");
  const [allRates, setAllRates] = useState<
    { currency: string; rate: number; reversed: boolean }[]
  >([]);


  const fetchCountries = async () => {
    try {
      const res = await getCountries();
      setCountries(res);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchExchangeRate = async () => {
    if (fromCurrency && toCurrency) {
      try {
        const res = await getExchangeRate(fromCurrency, toCurrency)
        setExchangeRate(res);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    }
  };

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

  useEffect(() => {
    fetchCountries();
    fetchAllRates();
  }, []);

  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

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

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <Item
            title="menu"
            iconName="menu"
            onPress={() => navigation.openDrawer()}
          />
        </HeaderButtons>
      ),
      headerRight: () => (
        <>
            <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
              <Item style={{marginRight: 10}}
                title="logout"
                iconName="cog"
                onPress={async () => {
                  await logout();
                  dispatch(setIsLogin(false));
                }}
              />
            </HeaderButtons>
            <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
              <Item
                title="logout"
                iconName="logout"
                onPress={async () => {
                  await logout();
                  dispatch(setIsLogin(false));
                }}
              />
            </HeaderButtons>
        </>
      ),
    });
  }, [navigation]);

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
            editable={false}
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
        <ScrollView style={{ height: 340 }}>
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
