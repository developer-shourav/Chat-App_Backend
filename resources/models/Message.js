const { Schema, model } = require("mongoose");

const Message = new Schema({
  chat: { type: Schema.Types.ObjectId, ref: "Chat" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  userName: { type: String },
  text: { type: String },
  time: { type: String },
  userRole: { type: String },
  file: { type: Schema.Types.ObjectId, ref: "File", default: undefined },
});

module.exports = model("Message", Message);
