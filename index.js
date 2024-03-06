const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
var cors = require("cors");
const { pathDb } = require("./common/config.js");
// app.use(cors());
const { createServer } = require("http");
// The http.createServer() method turns your computer into an HTTP server.
const { Server } = require("socket.io");
// socket.io methods of creating
const app = express();
const { SocketService } = require("./resources/services/SocketService.js");

const { authRouter, userRouter, chatRouter } = require("./resources/routers");
const { ObjectID, MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectId } = require("mongodb");

app.use(
  cors({
    origin: "*",
    methods:  ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/chats", chatRouter);

const server = createServer(app);
// http.createServer(requestListener);
// requestListener	Optional. Specifies a function to be executed every time the server gets a request.
SocketService(server);

const start = () => {
  try {
    mongoose
      .connect(pathDb)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
      });
    server.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
