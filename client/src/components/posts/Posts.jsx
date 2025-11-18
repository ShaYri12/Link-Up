import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery(["posts", userId], () =>
    makeRequest.get(`/posts?userId=${userId ?? ""}`).then((res) => {
      const raw = res.data;
      if (Array.isArray(raw)) return raw;
      if (Array.isArray(raw?.posts)) return raw.posts;
      return [];
    })
  );

  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : Array.isArray(data)
        ? data.map((post) => <Post post={post} key={post._id} />)
        : null}
    </div>
  );
};

export default Posts;
