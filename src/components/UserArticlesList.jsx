import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserStatus } from "../features/user/userSlice";
import { fetch_posts, publish_post } from "../features/posts/postsSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserArticlesList() {
  const dispatch = useDispatch();
  const user_status = useSelector(selectUserStatus);
  const posts_state = useSelector((state) => state.posts);
  // here we can modify to use normalization

  console.log(posts_state);

  useEffect(() => {
    if (posts_state.status === "idle" && user_status.is_logged_in) {
      dispatch(fetch_posts(user_status.user_id));
    }
  }, [posts_state.status, user_status.is_logged_in]);

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

  const rendered_posts = posts_state.posts.map((post) => {
    return <PostExcerpt post={post} key={post.id} />;
  });

  return (
    <>
      <h2>Lame ass users blogs!</h2>
      <>{rendered_posts}</>
    </>
  );
}

let PostExcerpt = ({ post }) => {
  // const post = useSelector((state) => selectPostById(state, postId))
  const dispatch = useDispatch();
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);

  async function handlePublish() {
    // try catch logic needs to be implemented here to update publishing state
    if (!publishing) {
      try {
        setPublishing(true);
        await dispatch(
          publish_post({ post_id: post.id, action: "publish" })
        ).unwrap();
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
        const publishResults = await dispatch(
          publish_post({ post_id: post.id, action: "unpublish" })
        ).unwrap();
      } catch (err) {
        setError(err);
      } finally {
        setPublishing(false);
      }
    }
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
