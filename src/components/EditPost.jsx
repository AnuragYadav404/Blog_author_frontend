import { useDispatch, useSelector } from "react-redux";
import { selectUserStatus } from "../features/user/userSlice";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { select_post_by_id } from "../features/posts/postsSlice";
import { useGetPostsQuery } from "../features/api/apiSlice";
import { useUpdatePostMutation } from "../features/api/apiSlice";

export default function EditPost() {
  const user_status = useSelector(selectUserStatus);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // get the post item
  const { post_id } = useParams();
  // const post_item = useSelector((state) => select_post_by_id(state, post_id));

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectPostFromAllPosts = (result, post_id) => {
    console.log("data for select single is: ", result);
    console.log("post id for select single is: ", post_id);
    const emptyarray = [];
    const returnResult =
      result.data?.find((post) => post.id === post_id) ?? undefined;
    console.log("return result is", returnResult);
    return returnResult;
  };

  const {
    selectedPost: post,
    isFetching,
    isUninitialized,
    status: getPostQueryStatus,
  } = useGetPostsQuery(user_status.user_id, {
    selectFromResult: (result) => {
      return {
        ...result,
        selectedPost: selectPostFromAllPosts(result, post_id),
      };
    },
  });

  const [update_post, { isFetchingUpdatePost }] = useUpdatePostMutation();

  useEffect(() => {
    if (getPostQueryStatus === "fulfilled" && post) {
      console.log("Hey buddy the post is: ", post);
      setTitle(post.title);
      setContent(post.content);
    }
  }, [getPostQueryStatus]);

  if (!user_status.is_logged_in) {
    return (
      <>
        <h2>Login to edit this article!</h2>
      </>
    );
  }

  if (isUninitialized) {
    return (
      <>
        <i>Beep boop fetching blog info</i>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <i>Hey bud, this post does not exist!</i>
      </>
    );
  }

  async function handleUpdateArticle(e) {
    e.preventDefault();
    if (!loading) {
      try {
        setLoading(true);
        await update_post({
          title,
          content,
          post_id: post_id,
        });
        // console.log(create_post_result);
        navigate(`/articles/${post_id}`);
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    }
  }

  return (
    <>
      <h2>Update article</h2>
      <h3>{`What's on your mind?`}</h3>
      {error && <i>{error.message}</i>}
      <form onSubmit={handleUpdateArticle}>
        <button type="submit" disabled={loading || isFetchingUpdatePost}>
          Update
        </button>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          required={true}
          minLength={3}
          maxLength={190}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <label htmlFor="content">Content: </label>
        <textarea
          name="content"
          id="content"
          cols="50"
          rows="50"
          required={true}
          minLength={1}
          maxLength={5000}
          value={content}
          disabled={loading || isFetchingUpdatePost}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </form>
    </>
  );
}
