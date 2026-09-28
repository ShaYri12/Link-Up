import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import Avatar from "../../assets/avatar.jpg";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["comments"], () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  // Helper function to get the correct image path
  const getImagePath = (pic) => {
    if (!pic) return Avatar;
    if (/^https?:\/\//.test(pic)) return pic;
    if (pic.startsWith("/upload/") || pic.startsWith("upload/")) {
      return pic.startsWith("/") ? pic : `/${pic}`;
    }
    return `/upload/${pic}`;
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={getImagePath(currentUser.profilePic)} alt={currentUser.name || "Profile"} />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.map((comment) => (
            <div className="comment" key={comment._id}>
              <img src={getImagePath(comment.userId.profilePic)} alt={comment.userId.name || "Profile"} />
              <div className="info my-auto">
                <span className="my-auto">{comment.userId.name}</span>
                <p>{comment.desc}</p>
              </div>
              <span className="date my-auto">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
