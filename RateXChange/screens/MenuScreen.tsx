import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Header, Icon, ListItem } from "@rneui/base";
import { useAppDispatch, useAppSelector } from "../redux-toolkit/hooks";
import { selectAuthState, setIsLogin } from "../auth/auth-slice";
import { StyleHome } from "../styles/styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { logout } from "../services/auth-service";
import {
  Language,
  loadLanguage,
  saveLanguage,
} from "../services/language-service";

const MenuScreen = ({ navigation }: any): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const [language, setLanguage] = useState<Language>("en");

  const toggleLanguage = async () => {
    const newLanguage = language === "en" ? "th" : "en";
    setLanguage(newLanguage);
    await saveLanguage(newLanguage);
  };

  const initializeLanguage = async () => {
    const savedLanguage = await loadLanguage(); // Load saved language
    setLanguage(savedLanguage);
  };

  useEffect(() => {
    initializeLanguage();
  }, [language]);

  const texts = {
    en: {
      home: "Home",
      convertCurrency: "Convert Currency",
      realTime: "Real-Time Currency",
      logout: "LOGOUT",
    },
    th: {
      home: "หน้าหลัก",
      convertCurrency: "แปลงสกุลเงิน",
      realTime: "ค่าเงินปัจจุบัน",
      logout: "ออกจะระบบ",
    },
  };

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: "#4A90E2", width: "100%", height: 210 }}>
        <Image
          source={require("../assets/logo.png")}
          style={{
            width: 150,
            height: 150,
            resizeMode: "contain",
            marginLeft: "20%",
            marginTop: "7%",
          }}
        />
        <Text
          style={{
            fontWeight: "bold",
            color: "white",
            fontSize: 20,
            width: "100%",
            textAlign: "center",
          }}
        >
          RateXChange
        </Text>
      </View>
      <ListItem
        bottomDivider
        onPress={() => {
          navigation.navigate("Home");
        }}
      >
        <Icon name="home" type="material-community" color="#0054fc" />
        <ListItem.Content>
          <ListItem.Title style={{ color: "#474747" }}>
            {texts[language].home}
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron size={25} color={"#4A90E2"} />
      </ListItem>

      <ListItem
        bottomDivider
        onPress={() => {
          navigation.navigate("Convert");
        }}
      >
        <Icon name="redo-variant" type="material-community" color="#0054fc" />
        <ListItem.Content>
          <ListItem.Title style={{ color: "#474747" }}>
            {texts[language].convertCurrency}
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron size={25} color={"#4A90E2"} />
      </ListItem>

      <ListItem
        bottomDivider
        onPress={() => {
          navigation.navigate("CurrencyRate");
        }}
      >
        <Icon name="currency-btc" type="material-community" color="#0054fc" />
        <ListItem.Content>
          <ListItem.Title style={{ color: "#474747" }}>
            {texts[language].realTime}
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron size={25} color={"#4A90E2"} />
      </ListItem>

      <View style={styles.footer}>
        <Pressable onPress={toggleLanguage}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Text style={styles.footerTextSetting}>TH |</Text>
            <Text style={styles.footerTextSetting}> EN</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={async () => {
            try {
              Toast.show({
                type: "success",
                text1: "Thank you, See you later!",
              });
              await logout();
              dispatch(setIsLogin(false));
            } catch (error) {
              console.error("Logout failed: ", error);
            }
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Icon
              name="logout"
              type="material-community"
              color="#e43131"
              size={25}
            />
            <Text style={styles.footerTextLogout}>
              {texts[language].logout}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#4A90E2",
    height: "8%",
    alignItems: "center",
  },
  footerTextSetting: {
    fontSize: 16,
    color: "#f4f4f4",
    fontWeight: "600",
  },
  footerTextLogout: {
    fontSize: 16,
    color: "#f4f4f4",
    fontWeight: "600",
  },
});
export default MenuScreen;
