import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import SignInSlice from "./Slice/SignInSlice"; // Only SignIn will be persisted
import CompanySlice from "./Slice/CompanySlice";

// Redux Persist Configuration
const persistConfig = {
  key: "signin",         // Optional: can be "root" as well
  storage,
  version: 1,
};

// Combine Reducers (in case you want to add more non-persisted reducers later)
const rootReducer = combineReducers({
  user: SignInSlice,
  company:CompanySlice     // Only this will be persisted
});

// Apply persist reducer to the slice you want to persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create and export store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Avoid warnings from redux-persist
    }),
});

// Persistor instance
export const persistor = persistStore(store);
