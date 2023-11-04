import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  posts: [],
  status: "idle",
  error: null,
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    dumbSomething: (state, action) => {
      console.log("Dumb Reducer called!");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetch_posts.pending, (state, action) => {
        // pending state
        state.status = "pending";
        console.log("Fetching user posts");
      })
      .addCase(fetch_posts.fulfilled, (state, action) => {
        // fetch completed successfully
        state.status = "completed";
        // conditional check for updating the user state
        const fetchData = action.payload;
        // if (fetchData.status === true) {
        //   // the session is logged in auth
        //   state.is_logged_in = true;
        //   state.user_id = fetchData.user.user_id;
        //   state.username = fetchData.user.username;
        // }
        state.posts = fetchData.articles;
        console.log("Fetching user login status completed");
        console.log("Fetched data: ", fetchData);
      })
      .addCase(fetch_posts.rejected, (state, action) => {
        // rejected if the server is not up
        state.status = "rejected";
        state.error = action.error.message;
        console.log("Fetching user posts rejected");
      })
      .addCase(publish_post.fulfilled, (state, action) => {
        // conditional check for updating the post state
        const fetchData = action.payload;
        if (fetchData.statusCode === 200) {
          console.log("publish successfull, updating state");

          state.posts.forEach((post) => {
            if (post.id == fetchData.article_id) {
              console.log(action.payload);
              console.log("SUAAAAAAAAr");
              post.isPublished = fetchData.isPublished;
            }
          });
        }
      })
      .addCase(create_post.fulfilled, (state, action) => {
        // conditional check for updating the post state
        const fetchData = action.payload;
        if (fetchData.statusCode === 200) {
          state.posts.push(fetchData.article);
        }
      });
  },
});

export const fetch_posts = createAsyncThunk(
  "posts/fetch_posts",
  async (user_id) => {
    // fetch the response
    const response = await axios({
      method: "GET",
      url: `http://localhost:3000/users/${user_id}/articles`,
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

export const publish_post = createAsyncThunk(
  "posts/publish_post",
  async (actionInfo) => {
    console.log("Publish article ", actionInfo);
    // fetch the response
    console.log("act is: ", actionInfo);
    console.log(
      `http://localhost:3000/articles/${actionInfo.post_id}/${actionInfo.action}`
    );

    const response = await axios({
      method: "POST",
      url: `http://localhost:3000/articles/${actionInfo.post_id}/${actionInfo.action}`,
      withCredentials: true,
    });
    // three scenarios for the above request to fail
    // 1. network error -> server ain't up/ no internet connect?
    // 2. the user is not logged in
    // 3. the user is logged in!
    const data = response.data;
    console.log(data);
    return data;
  }
);

export const create_post = createAsyncThunk(
  "posts/create_post",
  async (postData) => {
    const response = await axios({
      method: "POST",
      url: `http://localhost:3000/articles/create`,
      withCredentials: true,
      data: {
        title: postData.title, // here both these fields
        content: postData.content, // need to be validated
      },
      headers: {
        "Content-Type": "application/json", // Adjust content type as needed
      },
    });
    // three scenarios for the above request to fail
    // 1. network error -> server ain't up/ no internet connect?
    // 2. bad request
    // 3. user not logged in,due to session expired
    const data = response.data;
    console.log(data);
    return data;
  }
);

export const { dumbSomething } = postsSlice.actions;

export default postsSlice.reducer;

export const select_post_by_id = (state, candidate_post_id) => {
  return state.posts.posts.find((post) => post.id == candidate_post_id);
};
