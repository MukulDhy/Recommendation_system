import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

// User login thunk
export const loginUser = createAsyncThunk("user/loginUser", async (info) => {
  try {
    const response = await axios.post(
      `http://localhost:4000/api/user/login`,
      info
    );
    console.log(response);
    localStorage.setItem("token", response.data.token); // Store token in localStorage
    localStorage.setItem("user", JSON.stringify(response.data.user)); // Store token in localStorage
    // setCookie("token", response.data.token, 15);
    return response.data; // Return user data
  } catch (error) {
    throw new Error(error.response.data.message); // Throw error message
  }
});

// User registration thunk
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (info) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/user/register`,
        info
      );
      localStorage.setItem("token", response.data.token); // Store token in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user)); // Store token in localStorage
      // setCookie("token", response.data.token, 15);
      return response.data; // Return user data
    } catch (error) {
      throw new Error(error.response.data.message); // Throw error message
    }
  }
);
export const logoutUser = createAsyncThunk("user/logout", async () => {
  try {
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("user"); // Remove token from localStorage
    return true; // Return user data
  } catch (error) {
    throw new Error(error.response.data.message); // Throw error message
  }
});

// User logout action
// export const logoutUser = (state) => {
//   localStorage.removeItem("token"); // Remove token from localStorage
//   localStorage.removeItem("user"); // Remove token from localStorage
//   state.user = null; // Clear user from state
//   return true;
// };

// User slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    error: null,
    token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
        state.token = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.error.message || "An error occurred";
        state.token = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
        state.token = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.error.message || "An error occurred";
        state.token = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = false;
        state.token = null;
      });
  },
});

export default userSlice.reducer;
