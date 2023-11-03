import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserStatus } from "../features/user/userSlice";

export default function Navbar() {
  // const dispatch = useDispatch();
  const userStatus = useSelector(selectUserStatus);

  return (
    <div id="sidebar">
      <nav>
        {/* <button onClick={() => dispatch(fetch_login_status())}>
          Dispatch updateUser
        </button> */}
        {userStatus.is_logged_in && <Link to="/articles/all">My Articles</Link>}
        {userStatus.is_logged_in && <Link to="/articles/new">New Article</Link>}
        {!userStatus.is_logged_in && <Link to="/accounts/login">Login</Link>}
        {!userStatus.is_logged_in && <Link to="/accounts/signup">Sign-up</Link>}
        {userStatus.is_logged_in && <Link to="/accounts/logout">Logout</Link>}
      </nav>
    </div>
  );
}
