import { useDispatch, useSelector } from "react-redux";
import { selectUserStatus, signup_user } from "../features/user/userSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import {  } from "../features/user/userSlice";

export default function SignUpPage() {
  const userStatus = useSelector(selectUserStatus);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignupSubmit(e) {
    e.preventDefault();
    if (!loading) {
      try {
        setLoading(true);
        const signup_response = await dispatch(
          signup_user({
            username,
            password,
            description,
            name,
          })
        ).unwrap();
        // console.log(create_post_result);
        navigate(`/accounts/login`);
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    }
  }

  if (userStatus.is_logged_in) {
    return (
      <>
        <i>You are currently logged in</i>
        <i>Logout and sign up as a new user</i>
      </>
    );
  }

  return (
    <>
      <form onSubmit={handleSignupSubmit}>
        {error && <i>{error.message}</i>}
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          name="username"
          id="username"
          required={true}
          minLength={3}
          maxLength={30}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
        <label htmlFor="password">Password: </label>
        <input
          type="text"
          name="password"
          id="password"
          required={true}
          minLength={5}
          maxLength={16}
          value={password}
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="name">Name: </label>
        <input
          type="text"
          name="name"
          id="name"
          required={true}
          minLength={2}
          maxLength={100}
          value={name}
          disabled={loading}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="description">Short Description about yourself: </label>
        <textarea
          name="description"
          id="description"
          cols="30"
          rows="10"
          maxLength={1000}
          value={description}
          disabled={loading}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button type="submit" disabled={loading}>
          Sign up
        </button>
      </form>
      <i>Sign up loser</i>
    </>
  );
}
