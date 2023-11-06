import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "../features/user/userSlice";
import postsReducer from "../features/posts/postsSlice";
import { apiSlice } from "../features/api/apiSlice";

export default configureStore({
  reducer: {
    user: userSliceReducer,
    posts: postsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
