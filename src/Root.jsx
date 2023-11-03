import "./index.css";
import { Outlet } from "react-router-dom";
import Navbar from "./app/Navbar";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUserStatus,
  fetch_login_status,
} from "./features/user/userSlice";

function App() {
  /* app will have two things
    1. The side navigation bar
    2. The main outlet
  */
  // maybe implement a quick fetch to the server to check if the user is logged in or not
  // that can be stored as a state in component?
  // this logic is only for conditional rendering of nav buttons
  // it is not basis of user auth for the app

  /* 
    blogs
    new blog
    login
    signup
    logout
  */
  // so the navbar is renders as soon as the website is loaded
  // as it is defined at the root, and everything is defined as its child
  const dispatch = useDispatch();
  const userStatus = useSelector(selectUserStatus);
  useEffect(() => {
    if (userStatus.fetch_status === "idle") {
      dispatch(fetch_login_status());
    }
  }, []);

  return (
    <>
      {userStatus.error && <h1>{userStatus.error}</h1>}
      {!userStatus.error && <Navbar />}
      {!userStatus.error && (
        <div id="detail">
          <Outlet />
        </div>
      )}
    </>
  );
}

export default App;
