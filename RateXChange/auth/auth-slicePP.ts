import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../redux-toolkit/store";

// Define a type for the slice state
interface authstate {
  profile : any|null;
  islogin: boolean;
  isLoading: boolean;
}

// Define the initial state using that type
const initialState: authstate = {
  profile:null,
  islogin: false,
  isLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setislogin(state,action:PayloadAction<any|null>){
        state.islogin=action.payload;//update global state

    }
    ,
    setisloading(state,action:PayloadAction<any|null>){
        state.isLoading=action.payload;//update global state
        
    },
    setprofile(state,action:PayloadAction<any|null>){
      state.profile=action.payload;//update global state
      
  }
  },
});

export const { setisloading,setislogin,setprofile } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuthstate = (state: RootState) => state.authState;

export default authSlice.reducer;