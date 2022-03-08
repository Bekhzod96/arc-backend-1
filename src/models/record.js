const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
    file: {
      type: String,
    },
    deviceId: {
      type: String,
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


const Record = mongoose.model("Record", recordSchema);

module.exports = Record;
