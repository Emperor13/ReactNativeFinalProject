import { View } from "react-native";
import { Text, Card, Input, Button, renderNode, Icon } from "@rneui/base";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { login } from "../services/auth-service";
import { AxiosError } from "../services/http-service";
import Toast from "react-native-toast-message";
import { setIsLogin } from "../auth/auth-slice";
import { useAppDispatch } from "../redux-toolkit/hooks";

const LoginScreen = (): React.JSX.Element => {
  const [showPass, setShowPass] = useState(false);
  const dispatch = useAppDispatch();

  // 1.define validation with Yub
  const schema = yup.object().shape({
    username: yup.string().required("Please enter your username"),
    password: yup
      .string()
      .required("Please enter your password.")
      .min(6, "Password must be at least 6 characters"),
  });
  //2. Apply with react hook form
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onLogin = async (data: any) => {
    try {
      const res = await login(data.username, data.password);
      //console.log("Response from server:", res.data);
      if (res.status === 200) {
        dispatch(setIsLogin(true));
        Toast.show({ type: "success", text1: "Login Successful!" });
        console.log("Login successful!");
      }

    } catch (error: any) {

      let err: AxiosError<any> = error;
      if (err.response?.status === 401) {
        Toast.show({ type: "error", text1: err.response.data.message });
        console.log(err.response.data.message);
      } else {
        Toast.show({ type: "error", text1: "Fail to connect to server . . ." });
        console.log("Fail to connect to server . . .");
      }

    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text h2>Thai-Nichi Apirak</Text>
      <Card containerStyle={{ padding: 10, width: "90%" }}>
        <Controller
          name="username"
          control={control}
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              placeholder="Usernmae"
              leftIcon={{ name: "email" }}
              keyboardType="default"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.username?.message}
            />
          )}
        />
        
        <Controller
          name="password"
          control={control}
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              secureTextEntry={!showPass}
              placeholder="Password"
              leftIcon={{ name: "key" }}
              rightIcon={
                //Add Icon to switch between hide/show password
                <Icon
                  name={showPass ? "eye" : "eye-off"}
                  type="feather"
                  onPress={() => setShowPass(!showPass)}
                />
              }
              keyboardType="default"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.password?.message}
            />
          )}
        />
        <Button
          title="Login"
          size="lg"
          onPress={handleSubmit(onLogin)}
          loading={isSubmitting}
          disabled={!isValid}
        />
      </Card>
    </View>
  );
};

export default LoginScreen;
