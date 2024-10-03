import AsyncStorage from "@react-native-async-storage/async-storage";
import { http } from "./http-service";

export async function register(
  firstName: string,
  lastName: string,
  username: string,
  password: string
) {
  const res = await http.post("http://172.20.10.6:3000/register", {
    firtName: firstName,
    lastName: lastName,
    username: username,
    password: password,
  });

  //save token to storage
  const token = res.data.token;
  await AsyncStorage.setItem("@token", token);

  const savedToken = await AsyncStorage.getItem("@token");
  console.log("Saved Token:", savedToken);
  return res;
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

    const savedToken = await AsyncStorage.getItem("@token");
    console.log("Saved Token:", savedToken);
    return res;
  } catch (error) {
    console.error("Password Incorrect:");
    throw error; // Rethrow the error to handle it in the calling function
  }
}

export async function logout() {
  await AsyncStorage.removeItem("@token");
}

/** 
export async function getProfile() {
  const tokenString = await AsyncStorage.getItem("@token");
  // if no token
  if (!tokenString) {
    return null;
  }

  //if token exist
  const token = JSON.parse(tokenString);
  const res = await http.get("https://api.codingthailand.com/api/profile", {
    headers: { Authorization: "Bearer " + token.access_token },
  });

  return res;
}
  */
