const { Schema, model } = require("mongoose");

const File = new Schema({
    name: { type: String },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat'},
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    userName: { type: String },
    data: { type: String },
    time: { type: String },
    size: { type: String }
});

module.exports = model("File", File);
