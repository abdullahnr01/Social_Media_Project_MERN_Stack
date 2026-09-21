import { useContext, useEffect } from "react";
import { UserContext } from "../../Context/context";
import socket from "../Socket/socket_io"

function SocketHandler() {
  const { UserInfo } = useContext(UserContext);

  useEffect(() => {
    if (UserInfo && UserInfo._id) {
      socket.emit("joinUserRoom", UserInfo._id);
      // console.log("Joined room:", UserInfo._id);
    }
  }, [UserInfo]);

  return null; // koi UI nahi
}

export default SocketHandler;
