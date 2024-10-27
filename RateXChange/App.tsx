import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

//Screen Import
import SignupScreen from "./screens/SignupScreen";
//navigation import
import { Provider } from "react-redux";
import { store } from "./redux-toolkit/store";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  selectAuthState,
  setIsLoading,
  setIsLogin,
  setProfile,
} from "./auth/auth-slice";
import HomeScreen from "./screens/HomeScreen";
import CurrencyRate from "./screens/CurrencyRate";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LoginScreen from "./screens/LoginScreen";
import { ActivityIndicator, View } from "react-native";
import { useAppDispatch, useAppSelector } from "./redux-toolkit/hooks";
import { HeaderButtonsProvider } from "react-navigation-header-buttons";
import MenuScreen from "./screens/MenuScreen";
import Convert from "./screens/Convert";
import { getProfile } from "./services/auth-service";
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();
const homeStack = createNativeStackNavigator();
const convertStack = createNativeStackNavigator();
const currencyRateStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function ConvertStack() {
  return (
    <convertStack.Navigator
      initialRouteName="Convert"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#4A90E2",
        },
        headerTitleStyle: { fontWeight: "bold", color: "white" }, 
      }}
    >
      <convertStack.Screen name="Convert" component={Convert} />
      <convertStack.Screen name="Home" component={HomeScreen} />
    </convertStack.Navigator>
  );
}

function CurrencyStack() {
  return (
    <currencyRateStack.Navigator
      initialRouteName="CurrencyRate"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#4A90E2",
        },
        headerTitleStyle: { fontWeight: "bold", color: "white" },
      }}
    >
      <currencyRateStack.Screen name="CurrencyRate" component={CurrencyRate} />
      <currencyRateStack.Screen name="Convert" component={Convert} />
    </currencyRateStack.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <homeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#4A90E2",
        },
        headerTitleStyle: { fontWeight: "bold", color: "white" },
      }}
    >
      <homeStack.Screen name="Home" component={HomeScreen} />

      <homeStack.Screen name="CurrencyRate" component={CurrencyRate} />

      <homeStack.Screen
        name="Convert"
        component={Convert}
        options={{ title: "Convert Currency" }}
      />
    </homeStack.Navigator>
  );
}

function App() {
  const { isLogin, isLoading } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();
  //console.log("setIsLogin 1: ", isLogin);
  const checkLogin = async () => {
    try {
      const res = await getProfile();
      if (res?.data.data.user) {
        dispatch(setProfile(res.data.data.user));
        console.log("Profile: ", res.data.data.user);
        dispatch(setIsLogin(true));
        //console.log("setIsLogin 2: ", isLogin);
      } else {
        dispatch(setIsLogin(false));
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setIsLogin(false));
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      checkLogin();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }
  return (
    <>
      <HeaderButtonsProvider stackType="native">
        {isLogin ? (
          <Drawer.Navigator
            screenOptions={{ headerShown: false }}
            drawerContent={(props) => <MenuScreen {...props} />}
          >
            <Drawer.Screen name="HomeStack" component={HomeStackScreen} />
            <Drawer.Screen name="CurrencyRateStack" component={CurrencyStack} />
            <Drawer.Screen name="ConvertStack" component={ConvertStack} />
          </Drawer.Navigator>
        ) : (
          <Stack.Navigator
            initialRouteName="LoginScreen"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignUpScreen" component={SignupScreen} />
          </Stack.Navigator>
        )}
      </HeaderButtonsProvider>
    </>
  );
}

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <App />
          <Toast />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default AppWrapper;
