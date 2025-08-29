import { createSlice } from "@reduxjs/toolkit";

// Initial state of the user
const initialState = {
  currentUser: null,
  error: null,
  Loading: false,
};

// Create a slice for handling sign in and sign out actions
const SignInSlice = createSlice({
  name: "user", // The name for the slice
  initialState,
  reducers: {
    // Actions related to sign-in
    signinStart: (state) => {
      state.Loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.Loading = false;
      console.log(action.payload,"kkjjkkjj");
      state.currentUser = action.payload;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.Loading = false;
      state.error = action.payload;
    },
    // Actions related to sign-out
    signoutStart: (state) => {
      state.Loading = true;
      state.error = null;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
      state.Loading = false;
      state.error = null;
    },
    signoutFailure: (state, action) => {
      state.Loading = false;
      state.error = action.payload;
    },
    updateToken: (state, action) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          token: action.payload.token,
          refreshToken: action.payload.refreshToken || state.currentUser.refreshToken,
        };
      }
    },
  },
});

// Export actions for dispatching
export const {
  signinStart,
  signInSuccess,
  signInFailure,
  signoutStart,
  signoutSuccess,
  signoutFailure,
  updateToken
} = SignInSlice.actions;

// Export the reducer to be used in the store
export default SignInSlice.reducer;
