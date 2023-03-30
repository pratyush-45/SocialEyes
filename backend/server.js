const dotenv = require("dotenv");
const express = require("express");
const chats = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

dotenv.config();

const app = express();
// Telling our backend to accept json data from frontend
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(cors());

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is Running Successfully!");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// -----------------------Deployment-----------------------//

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is Running Successfully!");
//   });
// }

// -----------------------Deployment-----------------------//

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4142;
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`.yellow.bold);
});

const io = require("socket.io")(server, {
  pingTimeOut: 60000,
  cors: {
    // origin: "http://localhost:3000",
    origin: "https://socialeyes-69cw.onrender.com",
  },
});

io.on("connection", (socket) => {
  // console.log("connected to socket.io");

  // We define our different sockets below -

  // Creating an exclusive room for that particular user
  socket.on("setup", (userData) => {
    // console.log(userData._id);
    socket.join(userData._id);
    socket.emit("connected");
  });

  // User Joins a chat(room containing both user and other person(s))
  socket.on("join chat", (room) => {
    socket.join(room);
    // console.log("User joined Room : " + room);
  });

  // Sockets for typing and stop typing
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // To recieve the new message and manage them(send them into different rooms)
  // Sending message to a particular room id (i.e user id)
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id !== newMessageRecieved.sender._id) {
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      }
    });
  });

  // Clean up our socket coz if its left open, its going to consume a lot of bandwidth
  // socket.off("setup", () => {
  //   console.log("User Disconnected");
  //   socket.leave(userData._id);
  // });
  socket.on("disconnect", function () {
    // console.log("user disconnected");
  });
});
