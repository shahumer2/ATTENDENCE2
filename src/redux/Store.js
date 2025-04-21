import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default storage (localStorage in web)
import SignInSlice from "./Slice/SignInSlice"; // Import SignInSlice here

// Redux Persist Configuration
const persistConfig = {
  key: "root", // Key for the persist storage
  storage, // This uses localStorage by default
};

// Persisted reducer configuration
const persistedReducer = persistReducer(persistConfig, SignInSlice); // Use the slice reducer

// Configure the Redux store
export const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
});

// Create the persistor to handle persisted state
export const persistor = persistStore(store);
