const { Schema, model } = require("mongoose");

const Status = new Schema({
    status: { type: String, unique: true, default: "offline" },
});

module.exports = model("Status", Status);


