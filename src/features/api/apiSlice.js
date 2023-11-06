/*****rtk query */
///
///
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
//defining api slice

import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

export const postsRTKAdapter = createEntityAdapter();

const initialState = postsRTKAdapter.getInitialState();

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/",
    credentials: "include",
  }),
  tagTypes: ["Post"],
  endpoints: (builder) => {
    return {
      getPosts: builder.query({
        query: (user_id) => `users/${user_id}/articles`,
        // providesTags: (result = [], error, arg) => {
        //   console.log("arg is", arg);
        //   console.log("result is", result);
        //   return [
        //     "Post",
        //     ...result.entities.map(({ id }) => ({ type: "Post", id })),
        //   ];
        // },
        transformResponse: (responseData) => {
          console.log("data set all for rtk is", responseData);
          const data = responseData.articles;
          console.log("data is", data);
          const normalizedData = { ids: [], entities: {} };
          data.forEach((post) => {
            normalizedData.entities[post.id] = post;
            normalizedData.ids.push(post.id);
          });
          console.log("modified data is", normalizedData);
          const result = postsRTKAdapter.setAll(
            initialState,
            responseData.articles
          );
          console.log("rtk result return is", result);
          console.log("data and adapter is equal", result == normalizedData);
          return result;
        },
      }),
      createPost: builder.mutation({
        query: (postInfo) => {
          return {
            url: "articles/create",
            method: "POST",
            body: postInfo,
          };
        },
        invalidatesTags: ["Post"],
      }),
      getPost: builder.query({
        query: (post_id) => {
          console.log("post id is", post_id);
          return {
            url: `articles/${post_id}`,
          };
        },
        providesTags: (result, arg, error) => {
          return [{ type: "Post", id: result.id }];
        },
      }),
      updatePost: builder.mutation({
        query: (postInfo) => {
          return {
            url: `articles/${postInfo.post_id}`,
            method: "PUT",
            body: postInfo,
          };
        },
        invalidatesTags: (result, error, arg) => {
          // console.log(arg, result);
          return [{ type: "Post", id: arg.post_id }];
        },
      }),
      modifyPublishPost: builder.mutation({
        query: ({ post_id, action, user_id }) => {
          return {
            url: `articles/${post_id}/${action}`,
            method: "POST",
          };
        },
        async onQueryStarted(
          { post_id, action, user_id },
          { dispatch, queryFulfilled }
        ) {
          // `updateQueryData` requires the endpoint name and cache key arguments,
          // so it knows which piece of cache state to update
          console.log(typeof user_id);
          const patchResult = dispatch(
            apiSlice.util.updateQueryData("getPosts", user_id, (draft) => {
              // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
              // const post = draft.find((post) => post.id === postId);
              // if (post) {
              //   post.reactions[reaction]++;
              // }
              console.log("draft is : ", draft);
              const result = draft.find((post) => {
                if (post.id === post_id) {
                  return post;
                }
              });
              console.log("result is", result);
              console.log("action is", action);
              result.isPublished = action === "publish";
            })
          );
          try {
            const result = await queryFulfilled;
            console.log("query fullfiled result was, ", result.data);
            if (result.data.statusCode !== 200) {
              patchResult.undo();
            }
          } catch {
            patchResult.undo();
          }
        },
      }),
      // fetchAllPosts: builder.query({
      //   query: () => "/articles",
      //   transformResponse: (responseData) => {
      //     console.log(
      //       "response for all posts fetch is",
      //       responseData.result.docs
      //     );
      //     const data = responseData.result.docs;

      //     const adapterResult = articlesRTKAdapter.setAll(initialState, data);
      //     console.log("adapterResult si", adapterResult);
      //     return adapterResult;
      //   },
      // }),
      // builder.query({
      //   query: (user_id) => `users/${user_id}/articles`,
      //   providesTags: (result = [], error, arg) => {
      //     console.log("arg is", arg);
      //     console.log("result is", result);
      //     return ["Post", ...result.map(({ id }) => ({ type: "Post", id }))];
      //   },
      //   transformResponse: (responseData) => {
      //     console.log("data set all for rtk is", responseData.articles);
      //     postsRTKAdapter.upsertMany(initialState, responseData.articles);
      //     return responseData.articles;
      //   },
      // }),
    };
  },
});

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useGetPostQuery,
  useUpdatePostMutation,
  useModifyPublishPostMutation,
  // useFetchAllPostsQuery,
} = apiSlice;

const selectAllArticlesFetch = apiSlice.endpoints.getPosts.select();

const selectArticlesFromState = createSelector(
  selectAllArticlesFetch,
  (result) => {
    console.log("all articles fetch select is", result);
    return result;
  }
);

export const { selectAll: selectAllArticles } = postsRTKAdapter.getSelectors(
  (state) => {
    return selectArticlesFromState(state) ?? initialState;
  }
);
///
///
