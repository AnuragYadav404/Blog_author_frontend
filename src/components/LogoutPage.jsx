import { useState } from "react";
import { selectUserStatus } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateUserError } from "../features/user/userSlice";
import { userLogout } from "../features/user/userSlice";

export default function LogoutPage() {
  const userStatus = useSelector(selectUserStatus);

  const [canLogout, setCanLogout] = useState(true);

  const dispatch = useDispatch();

  function handleLogoutSubmit(e) {
    e.preventDefault();
    setCanLogout(false);
    LogoutSubmitRequest()
      .then((result) => {
        const data = result.data;
        if (data.statusCode === 200) {
          //logout was successfull
          dispatch(userLogout());
        } else if (data.statusCode === 401) {
          // logout failed, as user is not logged in
          dispatch(
            updateUserError(
              "Failed attempt to logout, as the user is not logged in"
            )
          );
        }
      })
      .catch((error) => {
        // network error
        dispatch(updateUserError(error.message));
      });
  }

  return (
    <>
      {!userStatus.is_logged_in ? (
        <>
          <p>Hey {userStatus.username}, you are logged out.</p>
        </>
      ) : (
        <>
          <i>You are curently logged in as {userStatus.username}</i>
          {userStatus.is_logged_in && <p>Are you sure you wanna logout?</p>}
          <form onSubmit={handleLogoutSubmit}>
            <button type="submit" disabled={!canLogout}>
              Logout
            </button>
          </form>
          {!userStatus.is_logged_in && <i>Logging you out...</i>}
        </>
      )}
    </>
  );
}

function LogoutSubmitRequest() {
  return new Promise((resolve) => {
    resolve(
      axios({
        method: "POST",
        url: `http://localhost:3000/users/logout`,
        withCredentials: true,
      })
    );
  });
}
