import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Avatar from "../../assets/avatar.jpg";
import { toast } from "react-toastify";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["likes", post._id], () =>
    makeRequest.get("/likes?postId=" + post._id).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post._id);
      return makeRequest.post("/likes", { postId: post._id });
    },
    {
      onMutate: async (liked) => {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries(["likes", post._id]);

        // Snapshot the previous value
        const previousLikes = queryClient.getQueryData(["likes", post._id]);

        // Optimistically update to the new value
        queryClient.setQueryData(["likes", post._id], (old) => {
          if (liked) {
            // Remove the current user's like
            return old.filter((userId) => userId !== currentUser._id);
          } else {
            // Add the current user's like
            return [...old, currentUser._id];
          }
        });

        // Return a context object with the snapshotted value
        return { previousLikes };
      },
      onError: (err, liked, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        queryClient.setQueryData(["likes", post._id], context.previousLikes);
        toast.error("Failed to update like. Please try again.");
      },
      onSettled: () => {
        // Always refetch after error or success to ensure we're in sync with the server
        queryClient.invalidateQueries(["likes", post._id]);
      },
    }
  );
  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser._id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post._id);
    toast.success("Post Deleted Successfull");
  };

  const isVideo = (fileName) => {
    if (!fileName) return false;
    const videoExtensions = [".mp4", ".mov", ".mkv", ".avi", ".wmv", ".avchd", ".webm", ".flv", ".m4v"];
    return videoExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  };

  const getMediaPath = (mediaPath) => {
    if (!mediaPath) return null;
    // If it's already a full URL (Cloudinary or external)
    if (/^https?:\/\//.test(mediaPath)) return mediaPath;
    // If it starts with /upload/ or upload/, use as-is or add leading slash
    if (mediaPath.startsWith("/upload/") || mediaPath.startsWith("upload/")) {
      return mediaPath.startsWith("/") ? mediaPath : `/${mediaPath}`;
    }
    // Otherwise, prepend /upload/
    return `/upload/${mediaPath}`;
  };

  const getProfileImage = (pic) => {
    if (!pic) return Avatar;
    if (/^https?:\/\//.test(pic)) return pic;
    if (pic.startsWith("/upload/") || pic.startsWith("upload/")) {
      return pic.startsWith("/") ? pic : `/${pic}`;
    }
    return `/upload/${pic}`;
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={getProfileImage(post.userId.profilePic)} alt={post.userId.name || "Profile"} />
            <div className="details">
              <Link
                to={`/profile/${post.userId._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.userId.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId._id === currentUser._id && (
            <button className="btn" onClick={handleDelete}>
              <DeleteOutlinedIcon />
            </button>
          )}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          {post.img && (
            isVideo(post.img) ? (
              <video className="media" controls preload="metadata">
                <source src={getMediaPath(post.img)} type={`video/${post.img.split('.').pop()}`} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img className="media" src={getMediaPath(post.img)} alt="Post content" />
            )
          )}
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "loading"
            ) : data.includes(currentUser._id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>
          {/* <div className="item">
            <ShareOutlinedIcon />
            Share
          </div> */}
        </div>
        {commentOpen && <Comments postId={post._id} />}
      </div>
    </div>
  );
};

export default Post;
