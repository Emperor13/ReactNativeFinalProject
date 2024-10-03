import AsyncStorage from '@react-native-async-storage/async-storage';
import { http } from './http-service';

export async function register (firstName:string, lastName:string, username:string, password:string) {
    const res = await http.post('http://localhost:3000/register', {
        firtName:firstName,
        lastName:lastName,
        username:username,
        password:password
    });

    //save token to storage

    await AsyncStorage.setItem('@token', JSON.stringify(res.data));
    return res;
}

export async function login(username:string, password:string) {
    const res = await http.post('http://localhost:3000/login', {
        username:username,
        password:password
    });

    //save token to storage

    await AsyncStorage.setItem('@token', JSON.stringify(res.data));
    return res;
}

export async function logout() {
    await AsyncStorage.removeItem('@token');
}

export async function getProfile() {
    const tokenString = await AsyncStorage.getItem('@token');
    // if no token
    if(!tokenString) {
        return null;
    }

    //if token exist
    const token = JSON.parse(tokenString);
    const res = await http.get('https://api.codingthailand.com/api/profile', {
        headers: {'Authorization':'Bearer ' + token.access_token}
    });

    return res;
}