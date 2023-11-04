import { useParams } from "react-router-dom";
import { select_post_by_id } from "../features/posts/postsSlice";
import { useSelector } from "react-redux";

export default function PostPage() {
  const { post_id } = useParams();
  const post_item = useSelector((state) => select_post_by_id(state, post_id));
  let rendered_post;
  if (post_item) {
    rendered_post = (
      <>
        <h2>{post_item.title}</h2>
        <h3>{post_item.author.username}</h3>
        <p>{post_item.content}</p>
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
