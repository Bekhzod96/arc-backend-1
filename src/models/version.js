const mongoose = require("mongoose");

const versionSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    path: {
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

const Version = mongoose.model("Version", versionSchema);

module.exports = Version;
