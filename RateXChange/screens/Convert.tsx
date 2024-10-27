//React import
import React, { useState, useEffect, useLayoutEffect } from "react";
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
  Pressable,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/Ionicons";
import { pickerSelectStyles2, styleCovert } from "../styles/styles";
import {
  HeaderButton,
  HeaderButtons,
  Item,
} from "react-navigation-header-buttons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

//Services import
import { logout } from "../services/auth-service";
import { setIsLogin } from "../auth/auth-slice";
import {
  deleteExchangeHistory,
  ExchangeHistoryEntry,
  getExchangeHistory,
  setExchangeHistory,
} from "../services/exchange-service";
import { useAppDispatch } from "../redux-toolkit/hooks";
import {
  CountryOption,
  getCountries,
  getExchangeRate,
} from "../services/currency-service";
import {
  Language,
  loadLanguage,
  saveLanguage,
} from "../services/language-service";

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

const Convert = ({ navigation }: any): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>("JPY");
  const [toCurrency, setToCurrency] = useState<string>("THB");
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [amount, setAmount] = useState<string>("0.00");
  const [history, setHistory] = useState<ExchangeHistoryEntry[]>([]);
  const [language, setLanguage] = useState<Language>("en");
  const [user, setUser] = useState<string | null>("");

  const toggleLanguage = async () => {
    const newLanguage = language === "en" ? "th" : "en";
    setLanguage(newLanguage);
    await saveLanguage(newLanguage);
  };

  const initializeLanguage = async () => {
    const savedLanguage = await loadLanguage(); // Load saved language
    setLanguage(savedLanguage);
  };

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
        const res = await getExchangeRate(fromCurrency, toCurrency);
        setExchangeRate(res);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    }
  };

  useEffect(() => {
    initializeLanguage();
    fetchCountries();
  }, []);

  useEffect(() => {
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

  const addToHistory = async () => {
    try {
      if (exchangeRate) {
        const result = (parseFloat(amount) * exchangeRate).toFixed(2);
        const timestamp = new Date().toLocaleString();
        const fromFlag = findFlagByCurrency(fromCurrency);
        const toFlag = findFlagByCurrency(toCurrency);

        if (!user) {
          throw new Error("No user found in storage.");
        }

        await setExchangeHistory(
          user,
          fromCurrency,
          toCurrency,
          exchangeRate,
          amount,
          result,
          fromFlag || "",
          toFlag || "",
          timestamp
        );

        //console.log("Exchange history added:", res.data);
        Toast.show({ type: "success", text1: "Exchange Success!!" });
        await getHistory();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Exchange failed please try again . . .",
      });
      //console.error("Failed to add to history:", error);
    }
  };

  const getUser = async () => {
    const user = await AsyncStorage.getItem("@username");
    //console.log("User data:", user);
    setUser(user);
  };

  const clearHistory = async () => {
    //console.log("User: ", user);
    if (!user) {
      throw new Error("No user found in storage.");
    }
    try {
      if (history.length <= 0) {
        Toast.show({ type: "error", text1: "No data to delete . . ." });
      } else {
        const res = await deleteExchangeHistory(user);
        console.log("Exchange history deleted:", res.data);
        await getHistory();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to delete history, please try again . . .",
      });
      console.error("Error deleting exchange history:", error);
    }
  };

  const fromCurrencyFlag = findFlagByCurrency(fromCurrency);
  const toCurrencyFlag = findFlagByCurrency(toCurrency);

  const getHistory = async () => {
    const user = await AsyncStorage.getItem("@username");
    if (!user) {
      throw new Error("No user found in storage.");
    }
    try {
      const res = await getExchangeHistory(user);
      const exchangeHistory = res.data.exchangeHistory || [];
      setHistory(exchangeHistory);
      //console.log("History retrieve successfully . . .");
    } catch (error) {
      //console.log("username: ", user);
      //console.log("Failed to get history from file . . .");
      console.error(error);
    }
  };

  const handleSubmission = () => {
    if (amount.trim() === "" || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    addToHistory();
  };

  useEffect(() => {
    getUser();
    getHistory();
  }, []);

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
            <Pressable style={{ marginRight: 10 }} onPress={toggleLanguage}>
              <Text
                style={{ color: "#f4f4f4", fontWeight: "bold", fontSize: 16 }}
              >
                TH | EN
              </Text>
            </Pressable>
          </HeaderButtons>
          <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
            <Item
              title="logout"
              iconName="logout"
              color={"#e43131"}
              onPress={async () => {
                await logout();
                dispatch(setIsLogin(false));
              }}
            />
          </HeaderButtons>
        </>
      ),
    });
  }, [navigation, toggleLanguage]);

  const texts = {
    en: {
      selectCurrency: "Select Currency",
      convertCurrency: "Convert Currency",
      history: "History",
      clearAll: "Clear All",
      noEx: "No exchange history . . .",
      time: "Time:",
    },
    th: {
      selectCurrency: "เลือกสกุลเงิน",
      convertCurrency: "แปลงสกุลเงิน",
      history: "ประวัติการแลกเปลี่ยน",
      clearAll: "ล้างทั้งหมด",
      noEx: "ไม่มีประวัติการแลกเปลี่ยน . . .",
      time: "เวลา:",
    },
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={styleCovert.containerTop}>
          <View style={styleCovert.resultRateText}>
            <Text style={styleCovert.resultText}>
              {texts[language].convertCurrency}
            </Text>
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
              placeholder={{
                label: texts[language].selectCurrency,
                value: null,
              }}
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
              placeholder={{
                label: texts[language].selectCurrency,
                value: null,
              }}
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
            <Text style={styleCovert.HistoryText}>
              {texts[language].history}
            </Text>
            <TouchableOpacity
              onPress={clearHistory}
              style={styleCovert.clearButton}
            >
              <Text style={styleCovert.clearButtonText}>
                {texts[language].clearAll}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ height: 300 }}>
            {history.length > 0 ? (
              history.map((entry, index) => (
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
                    >{`${texts[language].time} ${entry.timestamp}`}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text
                style={{ textAlign: "center", color: "gray", fontSize: 20 }}
              >
                {texts[language].noEx}
              </Text>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Convert;
