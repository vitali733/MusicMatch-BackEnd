const express = require('express')
const Router = require('./routes/routes.js')
const errorHandler = require('./middlewares/errorHandler.js')
const connectDB = require('./db/connectDB.js')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")
const app = express()
const port = process.env.PORT || 4000


connectDB()

//generell middleware
app.use(express.json());
app.use(cors({
  origin: [process.env.FRONTEND_DEV, process.env.FRONTEND_DEPLOYED,
    /https:\/\/music-match1\.netlify\.app/],
  credentials: true
  //optionSuccessStatus:200
}))
app.use(cookieParser())


//Routes
app.use('/', Router);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//Error handling
app.use(errorHandler)

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
