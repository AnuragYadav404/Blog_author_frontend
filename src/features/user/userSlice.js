import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  is_logged_in: false,
  fetch_status: "idle", // "idle", "completed", "pending", "rejected"
  error: null,
  user_id: null,
  username: "Anonymous user",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateLoginStatus: (state, action) => {
      const data = action.payload;
      state.is_logged_in = data.is_logged_in;
      state.user_id = data.user_id;
      state.username = data.username;
      //   state.is_logged_in = action.payload;
    },
    updateUserError: (state, action) => {
      state.error = action.payload;
    },
    userLogout: () => {
      return {
        is_logged_in: false,
        fetch_status: "idle", // "idle", "completed", "pending", "rejected"
        error: null,
        user_id: null,
        username: "Anonymous user",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetch_login_status.pending, (state, action) => {
        // pending state
        state.fetch_status = "pending";
        console.log("Fetching user login status");
      })
      .addCase(fetch_login_status.fulfilled, (state, action) => {
        // fetch completed successfully
        state.fetch_status = "completed";
        // conditional check for updating the user state
        const fetchData = action.payload;
        if (fetchData.status === true) {
          // the session is logged in auth
          state.is_logged_in = true;
          state.user_id = fetchData.user.user_id;
          state.username = fetchData.user.username;
        }
        console.log("Fetching user login status completed");
      })
      .addCase(fetch_login_status.rejected, (state, action) => {
        // rejected if the server is not up
        state.fetch_status = "rejected";
        state.error = action.error.message;
        console.log("Fetching user login status rejected");
      });
  },
});

export const fetch_login_status = createAsyncThunk(
  "user/fetch_login_status",
  async () => {
    // fetch the response
    const response = await axios({
      method: "GET",
      url: `http://localhost:3000/users/isLoggedIn`,
      withCredentials: true,
    });
    // three scenarios for the above request to fail
    // 1. network error -> server ain't up/ no internet connect?
    // 2. the user is not logged in
    // 3. the user is logged in!
    const data = response.data;
    return data; // this return populates the payload of action
  }
);

export const { updateLoginStatus, updateUserError, userLogout } =
  userSlice.actions;

export const selectUserStatus = (state) => state.user;
export default userSlice.reducer;
