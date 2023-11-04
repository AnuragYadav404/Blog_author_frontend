import { useDispatch, useSelector } from "react-redux";
import { selectUserStatus } from "../features/user/userSlice";
import { useState } from "react";
import { update_post } from "../features/posts/postsSlice";
import { useParams, useNavigate } from "react-router-dom";
import { select_post_by_id } from "../features/posts/postsSlice";

export default function EditPost() {
  const user_status = useSelector(selectUserStatus);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // get the post item
  const { post_id } = useParams();
  const post_item = useSelector((state) => select_post_by_id(state, post_id));

  const [title, setTitle] = useState(post_item.title);
  const [content, setContent] = useState(post_item.content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!user_status.is_logged_in) {
    return (
      <>
        <h2>Login to edit this article!</h2>
      </>
    );
  }

  async function handleUpdateArticle(e) {
    e.preventDefault();
    if (!loading) {
      try {
        setLoading(true);
        const update_post_result = await dispatch(
          update_post({
            title,
            content,
            id: post_id,
          })
        ).unwrap();
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
        <button type="submit" disabled={loading}>
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
          disabled={loading}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </form>
    </>
  );
}
