import { useDispatch, useSelector } from "react-redux";
import { selectUserStatus } from "../features/user/userSlice";
import { useState } from "react";
import { create_post } from "../features/posts/postsSlice";
import { useNavigate } from "react-router-dom";
import { useCreatePostMutation } from "../features/api/apiSlice";

export default function CreateArticle() {
  const user_status = useSelector(selectUserStatus);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addNewPost, { isLoading }] = useCreatePostMutation();

  if (!user_status.is_logged_in) {
    return (
      <>
        <h2>Login to create a new article!</h2>
      </>
    );
  }

  async function handleNewArticle(e) {
    e.preventDefault();
    if (!loading) {
      try {
        setLoading(true);
        const create_post_result = await addNewPost({
          title,
          content,
        }).unwrap();
        console.log(create_post_result);
        navigate(`/articles/${create_post_result.id}`);
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    }
  }

  return (
    <>
      <h2>Create a new article</h2>
      <h3>{`What's on your mind?`}</h3>
      {error && <i>{error.message}</i>}
      <form onSubmit={handleNewArticle}>
        <button type="submit" disabled={loading}>
          Create
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
