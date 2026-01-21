const express = require("express");
const app = express();
const { Server } = require("socket.io");
const cors = require("cors");
const PORT = 9090;
require("dotenv").config();


//  path
const connectDB = require("./database/db");
const UserRoute = require("./Routes/user_route");

// db
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
//
app.use("/upload", express.static("Upload"));
app.use("/UserProfiles", express.static("UserProfiles"));
app.use("/user", UserRoute);



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
  // console.log("A user connected", socket.id);

  socket.on("disconnect", () => {
    // console.log("A user disconnected", socket.id);
  });
});
