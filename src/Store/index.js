import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slice/userSlice";
import productReducer from "./Slice/productSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
  },
  // Add any middleware or enhancers here if needed
});

// Debugging Steps:
// 1. Ensure Redux DevTools Extension is installed and enabled in your browser.
// 2. Use console.log to debug the store state and dispatched actions.
// 3. Check for errors in your Redux setup, including action types, reducers, and action creators.

// Log the initial state of the store for debugging
console.log("Initial Store State:", store.getState());

// Log dispatched actions for debugging
store.subscribe(() => {
  console.log("Dispatched Action:", store.getState());
});

export default store;
