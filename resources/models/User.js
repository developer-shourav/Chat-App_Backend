const { Schema, model } = require("mongoose");

const User = new Schema({
    username: { type: String, unique: true, required: true },
    authKey: { type: String, required: true },
    role: { type: String, ref: "Role", required: true, default: "USER" }
});

module.exports = model("User", User);
