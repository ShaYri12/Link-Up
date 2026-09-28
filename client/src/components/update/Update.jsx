import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [texts, setTexts] = useState({
    email: user.email,
    password: user.password,
    name: user.name,
    city: user.city,
    website: user.website,
  });

  // File size limit: 5MB
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const validateFileSize = (file) => {
    if (file && file.size > MAX_FILE_SIZE) {
      toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
      return false;
    }
    return true;
  };

  const upload = async (file, type) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const config = {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // Calculate overall progress based on which files are being uploaded
          const totalFiles = (cover ? 1 : 0) + (profile ? 1 : 0);
          const baseProgress = type === "cover" ? 0 : 50;
          const fileProgress = progress / totalFiles;
          setOverallProgress(Math.round(baseProgress + fileProgress));
        },
        timeout: 60000, // 60 seconds timeout
      };

      const res = await makeRequest.post("/upload", formData, config);
      return res.data;
    } catch (err) {
      console.error("Upload error:", err);
      if (err.code === "ECONNABORTED") {
        throw new Error("Upload timeout. Please try with a smaller file.");
      } else if (err.response?.status === 413) {
        throw new Error("File is too large. Please use a smaller image (max 5MB).");
      } else if (err.message === "Network Error") {
        throw new Error("Network error. Please check your connection and try again.");
      } else {
        throw new Error("Failed to upload file. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFileSize(file)) {
      setCover(file);
    } else {
      e.target.value = null;
    }
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFileSize(file)) {
      setProfile(file);
    } else {
      e.target.value = null;
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (userData) => {
      return makeRequest.put("/users", userData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
        toast.success("Profile updated successfully!");
        setOpenUpdate(false);
        setCover(null);
        setProfile(null);
        setOverallProgress(0);
      },
      onError: (error) => {
        console.error("Update error:", error);
        toast.error("Failed to update profile. Please try again.");
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();

    if (uploading) return; // Prevent double submission

    try {
      setUploading(true);
      setOverallProgress(0);

      let coverUrl = user.coverPic;
      let profileUrl = user.profilePic;

      // Upload cover picture if changed
      if (cover) {
        try {
          coverUrl = await upload(cover, "cover");
        } catch (error) {
          console.error("Cover upload error:", error);
          toast.error(error.message);
          setUploading(false);
          setOverallProgress(0);
          return;
        }
      }

      // Upload profile picture if changed
      if (profile) {
        try {
          profileUrl = await upload(profile, "profile");
        } catch (error) {
          console.error("Profile upload error:", error);
          toast.error(error.message);
          setUploading(false);
          setOverallProgress(0);
          return;
        }
      }

      // Update progress to 100% before saving
      setOverallProgress(100);

      // Update user data
      const updatedUserData = {
        ...texts,
        coverPic: coverUrl,
        profilePic: profileUrl,
      };

      // Update local storage
      const localStorageUser = JSON.parse(localStorage.getItem("user")) || {};
      const updatedLocalStorageUser = { ...localStorageUser, ...updatedUserData };
      localStorage.setItem("user", JSON.stringify(updatedLocalStorageUser));

      // Trigger mutation
      mutation.mutate(updatedUserData);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setUploading(false);
      setOverallProgress(0);
    }
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : user.coverPic || "https://via.placeholder.com/300x100?text=Cover+Picture"
                  }
                  alt="Cover"
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={handleCoverChange}
              accept="image/*"
              disabled={uploading}
            />
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : user.profilePic || "https://via.placeholder.com/100?text=Profile"
                  }
                  alt="Profile"
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={handleProfileChange}
              accept="image/*"
              disabled={uploading}
            />
          </div>
          <label>Email</label>
          <input
            type="email"
            value={texts.email}
            name="email"
            onChange={handleChange}
            disabled={uploading}
          />
          <label>Password</label>
          <input
            type="password"
            value={texts.password}
            name="password"
            onChange={handleChange}
            disabled={uploading}
            placeholder="Leave blank to keep current password"
          />
          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
            disabled={uploading}
          />
          <label>Country / City</label>
          <input
            type="text"
            name="city"
            value={texts.city}
            onChange={handleChange}
            disabled={uploading}
          />
          <label>Website</label>
          <input
            type="url"
            name="website"
            value={texts.website}
            onChange={handleChange}
            disabled={uploading}
          />
          <button 
            onClick={handleClick}
            disabled={uploading || mutation.isLoading}
            className={uploading || mutation.isLoading ? "updating" : ""}
          >
            {uploading || mutation.isLoading ? (
              <>
                <span className="spinner"></span>
                {overallProgress > 0 && overallProgress < 100 
                  ? `Uploading... ${overallProgress}%` 
                  : "Saving..."}
              </>
            ) : (
              "Update"
            )}
          </button>
        </form>
        <button
          className="close btn btn-danger"
          onClick={() => setOpenUpdate(false)}
          disabled={uploading || mutation.isLoading}
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default Update;
