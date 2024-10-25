import AsyncStorage from "@react-native-async-storage/async-storage";
import { http } from "./http-service";

export async function register(
  firstName: string,
  lastName: string,
  username: string,
  password: string
) {
  console.log("Payload:", { firstName, lastName, username, password });
  try {
    const res = await http.post("http://172.20.10.6:3000/register", {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
    });

    console.log("Register Successful!");
    return res;
  } catch (error: any) {
    console.error("Error: ", error.response.data.message);
    throw error;
  }
}

export async function login(username: string, password: string) {
  console.log("Username:", username);
  console.log("Password:", password);
  try {
    const res = await http.post("http://172.20.10.6:3000/login", {
      username: username,
      password: password,
    });

    //save token to storage

    const token = res.data.token;
    await AsyncStorage.setItem("@token", token);
    await AsyncStorage.setItem("@username", username);

    const savedToken = await AsyncStorage.getItem("@token");
    const savedUsername = await AsyncStorage.getItem("@username");
    console.log("Saved Token:", savedToken);
    console.log("Saved Username: ", savedUsername);
    console.log("Login Successful!");
    return res;
  } catch (error) {
    console.error("Password Incorrect:");
    throw error; 
  }
}

export async function logout() {
  await AsyncStorage.removeItem("@token");
  await AsyncStorage.removeItem("@username");
  console.log("Logout Successful . . .");
}

export async function getProfile() {
  const tokenString = await AsyncStorage.getItem("@token");
  // if no token
  if (!tokenString) {
    return null;
  }

  //if token exist
  const token = JSON.parse(tokenString);
  console.log("Token:", token);
  const res = await http.get("http://172.20.10.6:3000/profile", {
    headers: { Authorization: "Bearer " + token },
  });

  console.log("Get Profile Successfully!!");
  return res;
}
