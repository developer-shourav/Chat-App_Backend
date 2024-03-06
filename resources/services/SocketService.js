const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { secret } = require("../../common/config");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const File = require("../models/File");
const Status = require('../models/Status');

module.exports = {
  SocketService: async (server) => {
    try {
      const io = new Server(server, {
        cors: {
          origin: "*",
          methods:  ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
          credentials: true,
          allowedHeaders: ["Content-Type", "Authorization"],
        },

        transports: ["websocket", "polling"],
        upgradeTimeout: 1000000000,
      });
     /*  console.log("this is SocketService"); */

      io.on("connection", (socket) => {
        try {
          let user;
         /*  console.log(`----------User connected ----------: ${socket.id}`); */

          const { jwtToken } = socket.handshake.query;
         /*  console.log("-------------this is jwt start");
          console.log(jwtToken); */
          user = jwt.verify(jwtToken, secret);

        /*   console.log("-------------this is jwt end"); */

          socket.on("joinRoom", (data) => {
            socket.join(data);
           /*  console.log("user join to room");
            console.log(data); */
            // console.log(socket.id)
          });

          socket.on("leftRoom", (data) => {
            socket.leave(data);
          /*   console.log("user leave chat "); */
            socket.leave(data);
            /* console.log(data); */
            socket.off("joinRoom", (data) => {
              socket.join(data);
              /* console.log("user join to room");
              console.log(data); */
              // console.log(socket.id)
            });
            socket.offAny("joinRoom", (data) => {
              socket.join(data);
              /* console.log("user join to room");
              console.log(data); */
              // console.log(socket.id)
            });
            // console.log(socket.id)
          });

          socket.on("sendMessage", async (data) => {
           /*  console.log("------------this is sendMessage-----------");
            console.log(data);
            console.log(user);
            console.log("New Add by Shourav",data.userRole); */
            let currDate = new Date();
            const messageObj = {};
            messageObj.chat = data.chatId;
            messageObj.user = user.id;
            messageObj.userName = user.username;
            messageObj.text = data.message;
            messageObj.userRole = data.userRole;
            messageObj.time = currDate;

          /*   console.log("This is Object with Role", messageObj); */
            const newMessage = new Message(messageObj);
           /*  console.log("------ this is new message --------"); */
           /*  console.log("This is Massage With Role", newMessage); */
            await newMessage.save();
            const currChat = await Chat.findById(data.chatId);
            currChat.messages.push(newMessage._id);
            await currChat.save();

            io.in(data.chatId).emit("receiveMessage", newMessage);
          });

          socket.on("sendFile", async (data) => {
          /*   console.log("------------this is sendFile-----------");
            console.log(data);
            console.log(user); */
            let currDate = new Date();
            const fileObj = {};
            fileObj.name = data.fileName;
            fileObj.chat = data.chatId;
            fileObj.user = user.id;
            fileObj.userName = user.username;
            fileObj.data = data.fileData;
            fileObj.time = currDate;
            fileObj.userRole = data.userRole;
            fileObj.size = data.fileSize;
            const newFile = new File(fileObj);
            await newFile.save();
           /*  console.log(newFile); */

            const messageObj = {};
            messageObj.chat = data.chatId;
            messageObj.user = user.id;
            messageObj.userName = user.username;
            messageObj.text = `${user.username} send file`;
            messageObj.time = currDate;
            messageObj.userRole = data.userRole;
            messageObj.file = newFile._id;

            const newMessage = new Message(messageObj);
            await newMessage.save();
            const newMessageWithFile = await Message.findById(
              newMessage._id
            ).populate({ path: "file", select: "-data" });
            console.log("------ this is new File --------");

            const currChat = await Chat.findById(data.chatId);
            currChat.messages.push(newMessage._id);
            await currChat.save();

            io.in(data.chatId).emit("receiveMessage", newMessageWithFile);
          });

          socket.on("disconnectThisSocket", (data) => {
           /*  console.log("disconnectThisSocket");
            console.log(data); */
            socket.disconnect();
          });
        } catch (e) {
          console.log(e);
        }
      });
    } catch (e) {
      console.log(e);
    }
  },
};
