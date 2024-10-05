import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

//Screen Import
import LoginScreen from "./screens/LoginScreen";

//navigation import
import { Provider } from "react-redux";
import { store } from "./redux-toolkit/store";
import { NavigationContainer } from "@react-navigation/native";

function App() {
  return (
    <>
      <LoginScreen />
    </>
  );
}

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <App />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};
export default AppWrapper;
