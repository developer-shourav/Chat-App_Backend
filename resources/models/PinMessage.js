const { Schema, model } = require("mongoose");

const PinMessage = new Schema({
  chat: { type: Schema.Types.ObjectId, ref: "Chat" },
  //   pinned: { type: Schema.Types.Mixed }, // Allow any data type
  text: { type: String },
  idd: { type: String },
});

module.exports = model("PinMessage", PinMessage);
