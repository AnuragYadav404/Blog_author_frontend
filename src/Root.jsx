import "./index.css";
import { Outlet } from "react-router-dom";
import Navbar from "./app/Navbar";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUserStatus,
  fetch_login_status,
} from "./features/user/userSlice";
import { apiSlice } from "./features/api/apiSlice";

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
  }, [userStatus.fetch_status]);
  console.log("user status is", userStatus);

  // we should fetch the posts state here, as then it can be shared
  // among the siblings component
  // articles/all and articles/:articleID

  /*******
   * 
   const {
    data: posts,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsQuery(user_status.user_id);
  // using react query hooks
  // here the problem is user_id is going to be null at first
  // second we cannot wrap useHook inside useEffect
  // solutions
  // 1. transform Response when user id is null to [] empty array
  // 2. use the .initiate() method inside useEffect when user_id is available
   */
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (userStatus.is_logged_in) {
      console.log(
        "starting the initiate posts with user id",
        userStatus.user_id
      );
      console.log(apiSlice.endpoints.fetchAllPosts);
      dispatch(apiSlice.endpoints.getPosts.initiate(userStatus.user_id));
    }
  }, [userStatus.is_logged_in]);

  return (
    <>
      {userStatus.error && <h1>{userStatus.error}</h1>}
      {!userStatus.error && <Navbar />}
      {!userStatus.error && userStatus.fetch_status === "completed" && (
        <div id="detail">
          <Outlet />
        </div>
      )}
    </>
  );
}

export default App;
