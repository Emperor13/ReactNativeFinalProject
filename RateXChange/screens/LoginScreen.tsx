import { Pressable, TouchableOpacity, View } from "react-native";
import React from "react";
import { Text, Card, Input, Button, Icon, Image } from "@rneui/base";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { AxiosError } from "../services/http-service";
import Toast from "react-native-toast-message";
import { login } from "../services/auth-service";
import { useState } from "react";
import { setIsLogin } from "../auth/auth-slice";
import { useAppDispatch } from "../redux-toolkit/hooks";


const LoginScreen = ({ navigation }: any): React.JSX.Element => {
  const [showPw, setshowPw] = useState(false);
  const dispatch = useAppDispatch();

  //1define validate w/ yup name schemema
  const schema = yup.object().shape({
    username: yup.string().required("Please enter your username"),
    password: yup
    .string()
    .required("Please enter your password.")
    .min(6, "Password must be at least 6 characters"),
  });
  //2apply w/ reacthookform
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  //create on login
  const onlogin = async (data: any) => {
    try {
      const response = await login(data.username, data.password);
      if (response.status === 200) {
        dispatch(setIsLogin(true));
        Toast.show({ type: "success", text1: "Login Successful!", });
        console.log("Login successful!");
      }
    } catch (error: any) {
      let err: AxiosError<any> = error;
      if (err.response?.status === 401) {
        Toast.show({ type: "error", text1: err.response.data.message });
      } else {
        Toast.show({
          type: "error",
          text1: "Username or Password Incorrect!",
        });
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#3b83f7",
      }}
    >
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 150, height: 150, padding: 20, margin: 40 }}
      />
      <Card
        containerStyle={{
          width: "100%",
          flex: 1,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          justifyContent: "flex-start",
          paddingTop: 20,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            textAlign: "center",
            padding: 20,
            color: "#474747",
          }}
        >
          Welcome
        </Text>

        <View style={{ marginLeft: 20, marginRight: 20 }}>
          <Controller
            name="username"
            control={control}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                placeholder="username"
                leftIcon={{ name: "person" , color: "#474747",}}
                keyboardType="default"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.username?.message}
                style={{color: "#474747",}}
              />
            )}
          />
        </View>

        <View style={{ marginLeft: 20, marginRight: 20 }}>
          <Controller
            name="password"
            control={control}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                placeholder="password"
                leftIcon={{ name: "key" , color: "#474747",}}
                rightIcon={
                  <Icon
                    name={showPw ? "visibility" : "visibility-off"}
                    type="feature"
                    onPress={() => setshowPw(!showPw)}
                    style={{color: "#474747",}}
                  />
                }
                keyboardType="default"
                secureTextEntry={!showPw}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
                style={{color: "#474747",}}
              />
            )}
          />
        </View>
        <Button
          title="Sign In"
          onPress={handleSubmit(onlogin)}
          buttonStyle={{
            backgroundColor: "#00aaff",
            borderRadius: 25,
            paddingVertical: 10,
            marginVertical: 10,
            marginLeft: 50,
            marginRight: 50,
          }}
          titleStyle={{
            fontSize: 18,
          }}
        />
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 15,
          }}
        >
          <View style={{ flexDirection: "row", marginTop: 15 }}>
            <Text style={{ color: "gray" }}>Don't have an account? </Text>
            <Pressable onPress={() => navigation.navigate("SignUpScreen")}>
              <Text style={{ color: "#00A3FF", fontWeight: "bold" }}>
                SIGN UP
              </Text>
            </Pressable>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default LoginScreen;
