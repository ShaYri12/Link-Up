import { Box } from "@chakra-ui/layout";
import Chatbox from "../../components/Chatbox";
import MyChats from "../../components/MyChats";
import SideDrawer from "../../components/miscellaneous/SideDrawer";
import { ChatState } from "../../context/ChatProvider";
import Navbar from "../../components/navbar/Navbar";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import "./chat.scss";

const Chatpage = () => {
  const { user } = ChatState();
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={`theme-${darkMode ? "dark" : "light"} w-100 vh-100 bg-slate-300`} style={{ width: "100%" }}>
      <Navbar />
      {user && (
        <SideDrawer
          className="side-drawer w-100"
          style={{ height: "10px !important" }}
        />
      )}

      <Box className="d-flex chatter-box" style={{ height: "550px" }}>
        {user && <MyChats className="my-chat shadow" user={user} />}
        {user && <Chatbox className="chat-box" />}
      </Box>
    </div>
  );
};

export default Chatpage;
