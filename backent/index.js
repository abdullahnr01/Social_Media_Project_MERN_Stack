const express = require("express");
const app = express();
const { Server } = require("socket.io");
const cors = require("cors");
const PORT = 9090;
require("dotenv").config();
const { handleSendMessage } = require("./Socket/user_live_chat_socket");

//  Route path
const connectDB = require("./database/db");
const UserRoute = require("./Routes/user_route");
const UserFollow = require("./Routes/user_follow_route");
const UserPosts = require("./Routes/user_posts_route");
const UserPostsComment = require("./Routes/user_comment_route");
const UserInfo = require("./Routes/user_info_route");
const UserLiveChat = require("./Routes/user_live_chat_route");
// db
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
//
// app.use("/upload", express.static("Upload"));
// app.use("/UserProfiles", express.static("UserProfiles"));
app.use("/user", UserRoute);
app.use("/user_follow", UserFollow);
app.use("/user_post", UserPosts);
app.use("/user_comment", UserPostsComment);
app.use("/user_info", UserInfo);
app.use("/user_live", UserLiveChat);
// Server
const server = app.listen(PORT, () => {
  console.log("Server is listing on port no", PORT);
});

// io Socket connection

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  socket.on("joinUserRoom", (userId) => {
    socket.join(userId);
    console.log(`Joined user room ${userId}`);
  });

  socket.on("joinChatRoom", (conversationId) => {
    socket.join(conversationId);

    console.log(`Socket ${socket.id} joined room ${conversationId}`);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
