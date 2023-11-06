import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserStatus } from "../features/user/userSlice";
import {
  select_all_posts,
  fetch_posts,
  publish_post,
} from "../features/posts/postsSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import {} from "../features/posts/postsSlice";
import {
  useGetPostsQuery,
  useModifyPublishPostMutation,
  selectAllArticles,
  apiSlice,
  postsRTKAdapter,
} from "../features/api/apiSlice";
import { createSelector } from "@reduxjs/toolkit";
import { useMemo } from "react";
export default function UserArticlesList() {
  const user_status = useSelector(selectUserStatus);
  // const posts_state_status = useSelector((state) => state.posts.status);
  // const [posts_state, setPostState] = useState([]);
  // here we can modify to use normalization

  /******************8
   * 
   * const dispatch = useDispatch();
  const user_status = useSelector(selectUserStatus);
  // const posts_state_status = useSelector((state) => state.posts.status);
  // const [posts_state, setPostState] = useState([]);
  // here we can modify to use normalization

  //
  console.log(user_status.user_id);

  // const {
  //   data: posts,
  //   isLoading,
  //   isSuccess,
  //   isError,
  //   error,
  // } = useGetPostsQuery(user_status.user_id);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    console.log("asshole");
    dispatch(apiSlice.endpoints.getPosts.initiate(user_status.user_id))
      .unwrap()
      .then((result) => {
        console.log("fuck is: ", result);
        if (result) {
          setPosts(result);
        }
      });
  }, []);

  //
  console.log("posts is", posts);

  let rendered_posts = [];

  console.log("state is: ", posts.articles);
  rendered_posts = posts.map((post) => {
    return <PostExcerpt post={post} key={post.id} />;
  });
   * 
   * 
   */
  //
  console.log(user_status.user_id);

  const objQUeryHOok = useGetPostsQuery(user_status.user_id);
  console.log("data from useQuery hooks is posts:", objQUeryHOok);
  /************** */
  const selectDataForPikachu = apiSlice.endpoints.getPosts.select(
    user_status.user_id
  );

  const pikachuData = useSelector(selectDataForPikachu);
  console.log("pikachu data is", pikachuData.data);

  // const selectAllArticlesPosts = useMemo(
  //   (state) => {
  //     const selectAllArticlesPostsCacheEntry = selectDataForPikachu;
  //     console.log("siiu");
  //     const { selectAll } = postsRTKAdapter.getSelectors();
  //     console.log("sewwy");
  //     return createSelector(
  //       (state) => {
  //         const someResult = selectAllArticlesPostsCacheEntry(state);
  //         console.log("ome results is", someResult);
  //         return someResult;
  //       },
  //       (cacheData) => {
  //         console.log("some bullshit cachdata is", cacheData);
  //         const initialState = [];
  //         const answerResult = selectAll(cacheData) ?? initialState;
  //         console.log("answer result is", answerResult);
  //         return answerResult;
  //       }
  //     );
  //   },
  //   [user_status.user_id]
  // );
  // const gigAnswer = useSelector(selectAllArticlesPosts);
  // console.log("gigAnswer is", gigAnswer);
  // const allArticlesFetch = useSelector((state) => {
  //   console.log("selecting");
  //   return selectAllArticles(state);
  // });
  // console.log("all articles is:", allArticlesFetch);
  /***** */
  // console.log("posts is", posts);

  // let rendered_posts = [];

  // if (isSuccess) {
  //   console.log("state is: ", posts);
  //   rendered_posts = posts.map((post) => {
  //     return <PostExcerpt post={post} key={post.id} />;
  //   });
  // }

  // useEffect(() => {
  //   if (posts_state_status === "idle" && user_status.is_logged_in) {
  //     dispatch(fetch_posts(user_status.user_id));
  //   }
  // }, [posts_state_status, user_status.is_logged_in]);

  // if the user ain't logged in
  if (!user_status.is_logged_in) {
    return (
      <>
        <h2>You need to login to view your blogs!</h2>
      </>
    );
  }
  // if the user is logged in
  // fetch the user blogs, and display!
  // userid is available in user_status

  return (
    <>
      <h2>Lame ass users blogs!</h2>
      {/* <>{rendered_posts}</> */}
    </>
  );
}

let PostExcerpt = ({ post }) => {
  // const post = useSelector((state) => selectPostById(state, postId))
  const dispatch = useDispatch();
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);
  const [publishPost, { isFetching }] = useModifyPublishPostMutation();
  const user_status = useSelector(selectUserStatus);
  async function handlePublish() {
    // try catch logic needs to be implemented here to update publishing state
    if (!publishing) {
      try {
        setPublishing(true);
        await publishPost({
          post_id: post.id,
          action: "publish",
          user_id: user_status.user_id,
        });
      } catch (err) {
        setError(err);
      } finally {
        setPublishing(false);
      }
    }
  }

  async function handleUnPublish() {
    if (!publishing) {
      try {
        setPublishing(true);
        console.log("user status state is: ", user_status);
        await publishPost({
          post_id: post.id,
          action: "unpublish",
          user_id: user_status.user_id,
        });
      } catch (err) {
        setError(err);
      } finally {
        setPublishing(false);
      }
    }
  }

  if (!user_status.is_logged_in) {
    return <i>You must be logged in to view articles</i>;
  }

  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      {/* <p>{post.author.username}</p> */}
      <p className="post-content">{post.content.substring(0, 100)}</p>
      {/* <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link> */}
      <p>created at: {post.createdAt_formatted}</p>

      <Link to={`/articles/${post.id}`}>
        <button>View</button>
      </Link>

      {post.isPublished ? (
        <>
          <p>Published</p>
          <button onClick={handleUnPublish} disabled={publishing}>
            Unpublish
          </button>
          {error && <i>There was an {error.message} when updating the post</i>}
        </>
      ) : (
        <>
          <p>Unpublished</p>
          <button onClick={handlePublish} disabled={publishing}>
            publish
          </button>
          {error && <i>There was an {error.message} when updating the post</i>}
        </>
      )}
    </article>
  );
};

PostExcerpt = React.memo(PostExcerpt);
