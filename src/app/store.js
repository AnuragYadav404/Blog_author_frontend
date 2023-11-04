import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "../features/user/userSlice";
import postsReducer from "../features/posts/postsSlice";

export default configureStore({
  reducer: {
    user: userSliceReducer,
    posts: postsReducer,
  },
});
