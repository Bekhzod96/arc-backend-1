const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    body: {
      type: String,
    },
    topic: {
      type: String,
    },
    deviceId: {
      type: String,
    },
    updatedAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
