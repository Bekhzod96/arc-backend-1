const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    deviceId: {
      type: String,
    },
    status: {
      type: String,
    },
    updatedAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
    },
    allowInsecure: {
      type: Boolean,
    },
    user: {
      type:mongoose.Schema.ObjectId,
      ref:'User',
      default: null,
    },
    tags: {
      type:[String],
      default: [],
    },
    crt: {
      type: String,
    },
    key: {
      type: String,
    },
    updateHistory: {
      type: [String],
      default: [],
    },
    updateAvailable: {
      type: Boolean,
      default: false,
    },
    testKey: {
      type: String,
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

// deviceSchema.pre('save',function(next){
//   console.log(this);
//   client.publish("TEST", `you just sent this message: ${this.name} with the topic: ${this.status}`);
//   next();
// });

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;
