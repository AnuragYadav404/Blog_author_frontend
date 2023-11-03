import { useDispatch, useSelector } from "react-redux";
import { selectUserStatus } from "../features/user/userSlice";
import { useState } from "react";
import { updateLoginStatus, updateUserError } from "../features/user/userSlice";

import axios from "axios";

export default function LoginPage() {
  const userStatus = useSelector(selectUserStatus);

  // gotta do a login form render
  return (
    <>
      {userStatus.is_logged_in && (
        <>
          <h2>Hey {userStatus.username}, you are logged in!</h2>
        </>
      )}
      {!userStatus.is_logged_in && <LoginForm />}
    </>
  );
}

function LoginForm() {
  const [formEnabled, setFormEnabled] = useState(true);
  const [inputUsername, setUsername] = useState("");
  const [inputPassword, setPassword] = useState("");
  const [loginResponseMsg, setLoginResponseMsg] = useState("");
  const dispatch = useDispatch();

  function handleLoginFormSubmit(e) {
    e.preventDefault();
    setFormEnabled(false);
    // now i wanna dispatch an action for updating user state to login
    LoginSubmitRequest({
      username: inputUsername,
      password: inputPassword,
    })
      .then((result) => {
        const data = result.data;
        if (data.statusCode === 401) {
          console.log("Invalid Login Credentials, Login Failed!");
          setLoginResponseMsg("Invalid Login Credentials, Login Failed!");
          setFormEnabled(true);
        } else if (data.statusCode === 200) {
          // login succeeded, update user status
          // dispatch an action to update user status
          console.log("Login suceedded");

          dispatch(
            updateLoginStatus({
              user_id: data.user_id,
              is_logged_in: true,
              username: data.username,
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
        // should we dispatch error for user state?
        dispatch(updateUserError(error.message));
      });
  }

  return (
    <>
      {formEnabled && (
        <form onSubmit={handleLoginFormSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            minLength={3}
            maxLength={30}
            required={true}
            value={inputUsername}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            minLength={5}
            maxLength={16}
            required={true}
            value={inputPassword}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      )}
      <i>{loginResponseMsg}</i>
    </>
  );
}

function LoginSubmitRequest(login_credentials) {
  console.log(login_credentials);
  return new Promise((resolve) => {
    resolve(
      axios({
        method: "POST",
        url: `http://localhost:3000/users/login`,
        withCredentials: true,
        data: {
          username: login_credentials.username, // here both these fields
          password: login_credentials.password, // need to be validated
        },
        headers: {
          "Content-Type": "application/json", // Adjust content type as needed
        },
      })
    );
  });
}
