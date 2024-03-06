const { validationResult } = require("express-validator");

const User = require("../models/User");
const Role = require("../models/Role");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const File = require("../models/File");
const mongoose = require("mongoose");
const PinMessage = require("../models/PinMessage");

module.exports = {
  getAllChats: async (req, res) => {
    try {
      /* console.log(req.user); */
      let chats;
      if (req.user.role === "ADMIN") {
        chats = await Chat.find().populate({
          path: "users",
          select: "-authKey",
        });
      }
      if (req.user.role === "USER") {
       /*  console.log("this is condition that user role is user user"); */
        allChats = await Chat.find().populate({
          path: "users",
          select: "-authKey",
        });
       /*  console.log("this is allChats");
        console.log(allChats); */
        // chats = allChats.filter(chat=> chat.users.includes(req.user.id))
        chats = allChats.filter((chat) =>
          chat.users.some((user) => user._id == req.user.id)
        );
       /*  console.log; */
      }
      res.json(chats);
    } catch (e) {
      console.log(e);
    }
  },

  getChat: async (req, res) => {
    try {
     /*  console.log("getChat"); */

      const { chatId } = req.params;
      // if (!mongoose.Types.ObjectId.isValid(chatId)) {
      //   return res.status(400).json({ message: "Chat format is incorrect" });
      // }
      /* console.log(req.user); */
      let chat;
      if (req.user.role === "ADMIN") {
       /*  console.log("user role is Admin"); */
        chat = await Chat.findById(chatId).populate([
          { path: "users", select: "-authKey" },
          { path: "messages", populate: { path: "file", select: "-data" } },
        ]);
        /* console.log(chat); */
        if (!chat) {
         /*  console.log("this is noChat"); */
          return res.status(400).json({ message: "Chat is not exist" });
        }
        return res.json(chat);
      }
      if (req.user.role === "USER") {
       /*  console.log("user role is User"); */
        chat = await Chat.findById(chatId);
        const ifAllowUserToChat = chat.users.includes(req.user.id);
        if (ifAllowUserToChat) {
         /*  console.log("user allowed"); */
          chat = await Chat.findById(chatId).populate([
            { path: "users", select: "-authKey" },
            { path: "messages", populate: { path: "file", select: "-data" } },
          ]);
          if (!chat) {
            return res.status(400).json({ message: "Chat is not exist" });
          }
          return res.json(chat);
        } else {
         /*  console.log("user is not allowed"); */
          return res
            .status(400)
            .json({ message: "User is not allowed to this chat" });
        }
      }
      return res.status(400).json({ message: "some error" });
    } catch (e) {
      console.log(e);
    }
  },

  sendMessage: async (req, res) => {
    try {
      /* console.log("sendMessage");
      console.log(req.params);
      console.log("This is Request Body", req.body); */
      const { chatId } = req.params;
      /* console.log(req.user); */
      let currDate = new Date();
      const newMessage = new Message({
        chat: chatId,
        user: req.user.id,
        userName: req.user.username,
        text: req.body.text,
        time: currDate,
        userRole: req.body.userRole
      });
      console.log(newMessage);
      await newMessage.save();
      const currChat = await Chat.findById(chatId);
      currChat.messages.push(newMessage._id);
      await currChat.save();
      return res.json(newMessage);
      // let chat
      // if (req.user.role==='ADMIN') {
      //     console.log('user role is Admin')
      //     chat = await Chat.findById(chatId).populate('users');
      //     return res.json(chat);
      // }
      // if (req.user.role==='USER') {
      //     console.log('user role is User')
      //     chat = await Chat.findById(chatId);
      //     const ifAllowUserToChat = chat.users.includes(req.user.id)
      //     if (ifAllowUserToChat) {
      //         console.log('user allowed')
      //         chat = await Chat.findById(chatId).populate('users');
      //         return res.json(chat);
      //     } else {
      //         console.log('user is not allowed')
      //         return res
      //         .status(400)
      //         .json({ message: "User is not allowed to this chat" });
      //     }
      // }
      // return res
      //         .status(400)
      //         .json({ message: "some error" });
    } catch (e) {
      console.log(e);
    }
  },
  sendPinMessage: async (req, res) => {
    try {
      /* console.log("sendMessage"); */
      // console.log(req.params);
     /*  console.log(req.body, "Pin"); */
      const { chatId } = req.params;
      const { pinned, id } = req.body;
      /* console.log(pinned); */
      const newMessage = new PinMessage({
        chat: chatId,
        text: pinned,
        idd: id,
      });
     /*  console.log(newMessage); */
      await newMessage.save();
      const currChat = await Chat.findById(chatId);
      currChat.messages.push(newMessage._id);
      await currChat.save();
      return res.json(newMessage);
    } catch (e) {
      console.log(e);
    }
  },
  getPinMessage: async (req, res) => {
    try {
     /*  console.log("getPinMessage"); */
      let { chatId } = req.params;
      const result = await PinMessage.findOne({ chat: chatId });
      return res.json(result);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  // Define the route for deleting pinned messages by chatId

  // Implement the deletePinMessage controller function
  deletePinMessage: async (req, res) => {
    /* console.log("Delete Pin"); */
    try {
      const { chatId } = req.params;

      const deletedPinMessage = await PinMessage.findOneAndDelete({
        chat: chatId,
      });

      if (!deletedPinMessage) {
        return res.status(404).json({ error: "Pinned message not found" });
      }

      return res.json(deletedPinMessage);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },



  updatePinMessage: async (req, res) => {
   /*  console.log("Update Pin"); */
    try {
      let { chatId } = req.params;
      let { pinned, ids } = req.body;
      // const existingChat = PinMessage.findOne({ _id: id });
      const updatePinMessage = await PinMessage.findOneAndUpdate(
        {
          chat: chatId,
        },
        { text: pinned },
        { id: ids }
      );
      if (!updatePinMessage) {
        return res.status(404).json({ error: "Pinned message not found" });
      }

      return res.json(updatePinMessage);
    } catch (e) {
      console.log(e);
      // return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getFile: async (req, res) => {
    try {
     /*  console.log("getFile");
      console.log(req.params);
      console.log(req.body); */
      const { fileId } = req.body;

      const currFile = await File.findById(fileId);
      if (!currFile) {
        return res
          .status(400)
          .json({ message: "File with this fileId doesn't exist" });
      }
      return res.json(currFile);
    } catch (e) {
      console.log(e);
    }
  },

  createNewChat: async (req, res) => {
    try {
     /*  console.log("createNewChat"); */

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: `validation error:`, ...errors });
      }
      const { chatName } = req.body;
      const candidate = await Chat.findOne({ chatName });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Chat with this chatName already exist" });
      }

      const chat = new Chat({
        chatName,
      });
      await chat.save();
      const chats = await Chat.find();
      return res.json({
        message: "New chat create successfully",
        chatsList: chats,
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Chat create error" });
    }
  },

  deleteChat: async (req, res) => {
    try {
      /* console.log("deleteChat"); */

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: `validation error:`, ...errors });
      }
      const { chatId } = req.body;
      const candidate = await Chat.findById(chatId);
      if (!candidate) {
        return res
          .status(400)
          .json({ message: "Chat with this chatId doesn't exist" });
      }
      await Chat.findByIdAndDelete(chatId);
      await Message.deleteMany({ chat: chatId });
      await File.deleteMany({ chat: chatId });
      // await Character.deleteMany({ name: /Stark/, age: { $gte: 18 } });

      const chats = await Chat.find();
      return res.json({
        message: "Chat deleted successfully",
        chatsList: chats,
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Chat delete error" });
    }
  },


  /* --------------------Delete Message -------------- */
  deleteMessage: async (req, res) => {
    /* console.log("Delete Pin"); */
    try {
      const { id } = req.body;

      const deleteMessage = await Message.findOneAndDelete({
        _id: id,
      });

      if (!deleteMessage) {
        return res.status(404).json({ error: "Message not found" });
      }

      return res.json(deleteMessage);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  addUserToChat: async (req, res) => {
    try {
     /*  console.log("addUserToChat"); */

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: `validation error:`, ...errors });
      }
      const { chatId, userId } = req.body;
      const neededChat = await Chat.findOne({ _id: chatId });
      if (!neededChat) {
        return res
          .status(400)
          .json({ message: "Chat with this chatId doesn't exist" });
      }
      const neededUser = await User.findOne({ _id: userId });
      if (!neededUser) {
        return res
          .status(400)
          .json({ message: "User with this userId doesn't exist" });
      }
      if (neededChat.users.includes(userId)) {
        return res.status(400).json({
          message: "User with this userId already exist in this chat",
        });
      }
      neededChat.users.push(neededUser._id);
      await neededChat.save();
      const neededChatUpdated = await Chat.findOne({ _id: chatId }).populate(
        "users"
      );
      return res.json({
        message: "New user to chat added successfully",
        chat: neededChatUpdated,
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Chat create error" });
    }
  },

  deleteUserFromChat: async (req, res) => {
    try {
     /*  console.log("deleteUserFromChat"); */

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: `validation error:`, ...errors });
      }
      const { chatId, userId } = req.body;
      const neededChat = await Chat.findOne({ _id: chatId });
      if (!neededChat) {
        return res
          .status(400)
          .json({ message: "Chat with this chatId doesn't exist" });
      }
      const neededUser = await User.findOne({ _id: userId });
      if (!neededUser) {
        return res
          .status(400)
          .json({ message: "User with this userId doesn't exist" });
      }
      if (!neededChat.users.includes(userId)) {
        return res.status(400).json({
          message: "User with this userId does not exist in this chat",
        });
      }

      neededChat.users.pull(neededUser._id);
      await neededChat.save();
      const neededChatUpdated = await Chat.findOne({ _id: chatId }).populate(
        "users"
      );
      return res.json({
        message: "User deleted from chat successfully",
        chat: neededChatUpdated,
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Chat create error" });
    }
  },

  addUsersArrToChat: async (req, res) => {
    try {
     /*  console.log("addUsersArrToChat"); */

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: `validation error:`, ...errors });
      }
     /*  console.log(req.body); */
      const { chatId, usersId } = req.body;
      const neededChat = await Chat.findOne({ _id: chatId });
      if (!neededChat) {
        return res
          .status(400)
          .json({ message: "Chat with this chatId doesn't exist" });
      }
     /*  console.log("1");
      console.log(usersId);
      console.log("2"); */
      neededChat.users = usersId;
      await neededChat.save();
      /* console.log(neededChat); */
      const neededChatUpdated = await Chat.findOne({ _id: chatId }).populate(
        "users"
      );
      return res.json({
        message: "New users to chat added successfully",
        chat: neededChatUpdated,
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Chat create error" });
    }
  },
};
