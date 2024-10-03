import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../redux-toolkit/store';

// Define a type for the slice state
interface AuthState {
  profile: any|null;
  isLogin: boolean;
  isLoading: boolean;
}

// Define the initial state using that type
const initialState: AuthState = {
  profile: null,
  isLogin: false,
  isLoading: false,
}

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIsLogin(state,action:PayloadAction<any|null>) {
        state.isLogin = action.payload; // update global state
    },
    setIsLoading(state, action:PayloadAction<any|null>) {
        state.isLoading = action.payload;
    },
    setProfile(state, action:PayloadAction<any|null>) {
        state.profile = action.payload;
    }
  },
})

export const { setIsLoading, setIsLogin, setProfile } = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectAuthState = (state: RootState) => state.authState;

export default authSlice.reducer