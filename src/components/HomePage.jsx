import { selectUserStatus } from "../features/user/userSlice";
import { useSelector } from "react-redux";

export default function HomePage() {
  const userStatus = useSelector(selectUserStatus);
  return (
    <>
      <h2>Welcome to the author-side(website) of Blog-Spec</h2>
      <h3>Use This Site to create, publish and control your blog content</h3>

      {userStatus.is_logged_in ? (
        <p>
          Welcome user, you are logged in as <b>{userStatus.username}</b>
        </p>
      ) : (
        <p>
          Welcome user,<b> you are currently not logged in</b>
        </p>
      )}

      {!userStatus.is_logged_in && (
        <>
          <p>
            You need to login as a user to use this website, ignore if already
            logged in!
          </p>
          <p>
            Sign-up as an user to start sharing with the world your awesome
            blogs!
          </p>{" "}
        </>
      )}
    </>
  );
}
