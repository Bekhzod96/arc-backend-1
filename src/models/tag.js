const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    name: {
      type: String,
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
