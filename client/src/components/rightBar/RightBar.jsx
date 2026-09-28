import "./rightBar.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import { useContext, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Avatar from "../../assets/avatar.jpg";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const currentUserId = useMemo(() => currentUser?._id, [currentUser?._id]);

  // Fetch online friends using React Query
  const {
    data: onlineFriendsData,
    isLoading: onlineFriendsLoading,
    error: onlineFriendsError,
  } = useQuery({
    queryKey: ["onlineFriends"],
    queryFn: async () => {
      const response = await makeRequest.get("/users/online-followed");
      const raw = response.data;
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.users)
        ? raw.users
        : [];
      return list;
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    cacheTime: 300000, // Keep in cache for 5 minutes
  });

  // Fetch suggested users using React Query
  const {
    data: suggestedUsersData,
    isLoading: loading,
    error: error,
  } = useQuery({
    queryKey: ["suggestedUsers", currentUserId],
    queryFn: async () => {
      const response = await makeRequest.get("/users/suggestion");
      const raw = response.data;
      const candidates = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.users)
        ? raw.users
        : [];
      // Filter out the current user from suggested users
      const filteredUsers = candidates.filter(
        (user) => user?._id !== currentUserId
      );
      return filteredUsers;
    },
    enabled: !!currentUserId,
    staleTime: 60000, // Consider data fresh for 60 seconds
    cacheTime: 300000, // Keep in cache for 5 minutes
  });

  const [dismissedUsers, setDismissedUsers] = useState([]);

  // Mutation for following a user
  const followMutation = useMutation({
    mutationFn: (followerId) =>
      makeRequest.post("/relationships", { userId: followerId }),
    onSuccess: (_, followerId) => {
      setDismissedUsers((prev) => [...prev, followerId]);
      // Optionally invalidate suggestions
      // queryClient.invalidateQueries(["suggestedUsers"]);
    },
  });

  const handleFollow = async (followerId) => {
    followMutation.mutate(followerId);
  };

  const handleDismiss = (userId) => {
    setDismissedUsers((prev) => [...prev, userId]);
  };

  // Filter out dismissed users from suggestions
  const suggestedUsers = useMemo(() => {
    if (!suggestedUsersData) return [];
    return suggestedUsersData.filter(
      (user) => !dismissedUsers.includes(user._id)
    );
  }, [suggestedUsersData, dismissedUsers]);

  const onlineFriends = onlineFriendsData || [];

  return (
    <>
      <div className="rightbar-behind"></div>
      <div className="rightBar">
        <div className="container">
          <div className="item">
            <span>Suggestions For You</span>
            {loading && <span className="d-block pt-3">Loading...</span>}
            {error && (
              <span className="d-block pt-3">Failed to fetch suggestions</span>
            )}
            {!loading && !error && suggestedUsers && suggestedUsers.length > 0 ? (
              suggestedUsers.map((user) => (
                <div className="user" key={user._id}>
                  <Link to={`/profile/${user._id}`} className="userInfo">
                    <img
                      className="img-fluid"
                      src={
                        user.profilePic
                          ? /^https?:\/\//.test(user.profilePic)
                            ? user.profilePic
                            : user.profilePic.startsWith("/upload/") ||
                              user.profilePic.startsWith("upload/")
                            ? user.profilePic.startsWith("/")
                              ? user.profilePic
                              : `/${user.profilePic}`
                            : `/upload/${user.profilePic}`
                          : Avatar
                      }
                      alt={user.username}
                    />
                    <span>{user.name}</span>
                  </Link>
                  <div className="buttons">
                    <button
                      className="btn btn-follow"
                      type="button"
                      onClick={() => handleFollow(user._id)}
                      disabled={followMutation.isLoading}
                    >
                      <PersonAddIcon />
                    </button>
                    <button
                      className="btn btn-dismiss"
                      type="button"
                      onClick={() => handleDismiss(user._id)}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              !loading && (
                <span className="d-block pt-3">No suggestions available</span>
              )
            )}
          </div>

          <div className="item">
            <span>Online Friends</span>
            {onlineFriendsLoading && (
              <span className="d-block pt-3">Loading...</span>
            )}
            {onlineFriendsError && (
              <span className="d-block pt-3">Failed to fetch online friends</span>
            )}
            {!onlineFriendsLoading &&
            !onlineFriendsError &&
            Array.isArray(onlineFriends) &&
            onlineFriends.length > 0 ? (
              onlineFriends.map((friend) => (
                <div className="user" key={friend._id}>
                  <Link to={`/profile/${friend._id}`} className="userInfo">
                    <img
                      className="img-fluid"
                      src={
                        friend.profilePic
                          ? /^https?:\/\//.test(friend.profilePic)
                            ? friend.profilePic
                            : friend.profilePic.startsWith("/upload/") ||
                              friend.profilePic.startsWith("upload/")
                            ? friend.profilePic.startsWith("/")
                              ? friend.profilePic
                              : `/${friend.profilePic}`
                            : `/upload/${friend.profilePic}`
                          : Avatar
                      }
                      alt={friend.username}
                    />
                    <div className="online" />
                    <span>{friend.name}</span>
                  </Link>
                </div>
              ))
            ) : (
              !onlineFriendsLoading && (
                <span className="d-block pt-3">
                  No online friends available
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RightBar;
