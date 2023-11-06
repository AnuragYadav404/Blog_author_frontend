import { useParams, Link } from "react-router-dom";
import { select_post_by_id } from "../features/posts/postsSlice";
import { useSelector } from "react-redux";
import { useGetPostsQuery } from "../features/api/apiSlice";
import { selectUserStatus } from "../features/user/userSlice";

export default function PostPage() {
  // i want postPage to have the same data from cache rather than
  // fetch new post everytime
  const user_status = useSelector(selectUserStatus);
  const { post_id } = useParams();
  // const { data: post, isFetching } = useGetPostQuery(post_id);
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
  } = useGetPostsQuery(user_status.user_id, {
    selectFromResult: (result) => {
      return {
        ...result,
        selectedPost: selectPostFromAllPosts(result, post_id),
      };
    },
  });
  console.log(post);
  // const post_item = useSelector((state) => select_post_by_id(state, post_id));
  let rendered_post;
  // if (!post.article) {
  //   return <i>Loading...</i>;
  // }

  if (!user_status.is_logged_in) {
    return (
      <>
        <h2>Ooop oop</h2>
        <h3>Login To view this article</h3>
      </>
    );
  }
  if (isUninitialized) {
    return (
      <>
        <i>boop boop loading....</i>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <i>Sorry to break it to you, but this post does not exist</i>
      </>
    );
  }

  if (!isFetching) {
    const post_item = post;
    rendered_post = (
      <>
        <h2>{post_item.title}</h2>
        <h3>{post_item.author.username}</h3>
        <p>{post_item.content}</p>
        <Link to={`/articles/${post_id}/edit`}>
          <button>Edit</button>
        </Link>
      </>
    );
  } else {
    rendered_post = (
      <>
        <h2>Post Not Found!!!!!!</h2>
      </>
    );
  }
  return <>{rendered_post}</>;
}
