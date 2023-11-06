import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import { createSelector } from "@reduxjs/toolkit";

const postsAdapter = createEntityAdapter();

const initialState = postsAdapter.getInitialState({
  status: "idle",
  error: null,
});

// const initialState = {
//   posts: [],
//   status: "idle",
//   error: null,
// };

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
        // modify the below with adapter equivalent
        // state.posts = fetchData.articles;
        console.log("Fetched data before upsertMany is: ", fetchData);
        postsAdapter.upsertMany(state, fetchData.articles);
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
          state.entities[fetchData.article_id].isPublished =
            fetchData.isPublished;
          // state.posts.forEach((post) => {
          //   if (post.id == fetchData.article_id) {
          //     console.log(action.payload);
          //     console.log("SUAAAAAAAAr");
          //     post.isPublished = fetchData.isPublished;
          //   }
          // });
        }
      })
      .addCase(create_post.fulfilled, (state, action) => {
        // conditional check for updating the post state
        const fetchData = action.payload;
        if (fetchData.statusCode === 200) {
          postsAdapter.addOne(state, fetchData.article);
          // state.posts.push(fetchData.article);
        }
      })
      .addCase(update_post.fulfilled, (state, action) => {
        // conditional check for updating the post state
        const fetchData = action.payload;
        if (fetchData.statusCode === 200) {
          state.entities[fetchData.article.id].content =
            fetchData.article.content;
          state.entities[fetchData.article.id].title = fetchData.article.title;
          // const postItem = state.posts.find(
          //   (item) => item.id == fetchData.article.id
          // );
          // postItem.content = fetchData.article.content;
          // postItem.title = fetchData.article.title;
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

export const update_post = createAsyncThunk(
  "posts/update_post",
  async (postData) => {
    const response = await axios({
      method: "PUT",
      url: `http://localhost:3000/articles/${postData.id}`,
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

// export const select_post_by_id = (state, candidate_post_id) => {
//   return state.posts.posts.find((post) => post.id == candidate_post_id);
// };

export const { selectAll: select_all_posts, selectById: select_post_by_id } =
  postsAdapter.getSelectors((state) => state.posts);

// Calling `someEndpoint.select(someArg)` generates a new selector that will return
// the query result object for a query with those parameters.
// To generate a selector for a specific query argument, call `select(theQueryArg)`.
// In this case, the users query has no params, so we don't pass anything to select()
export const selectPostsResult = apiSlice.endpoints.getPosts.select();

const emptyPosts = [];

export const selectAllPosts = createSelector(
  selectPostsResult,
  (postsResult) => {
    console.log(postsResult);
    return postsResult?.data ?? emptyPosts;
  }
);

// export const selectUserById = createSelector(
//   selectAllUsers,
//   (state, userId) => userId,
//   (users, userId) => users.find((user) => user.id === userId)
// );
