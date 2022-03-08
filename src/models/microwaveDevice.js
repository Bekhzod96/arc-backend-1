const mongoose = require("mongoose");
const uuid = require('node-uuid');

const microwaveDeviceSchema = new mongoose.Schema({
    // The 'natural' device id key in DB, generated at DB side.
    deviceId: {
        type: String,
        index: true,
        unique: true,
        default: () => uuid.v4()
    },
    // Unique device UUID, that represents unique device, generated at HW side.
    deviceUuid: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    // Unique hardware identifier, that represents unique device, burned to a device.
    deviceHardwareIdentifier: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    // Device HW model
    deviceHardwareModel: {
        type: String
    },
    // Device HW version
    deviceHardwareVersion: {
        type: String
    },
    // Device's current internal IP
    deviceInternalIP: {
        type: String
    },
    // Device's current external IP
    deviceExternalIP: {
        type: String
    },
    // Device's current HW config encoded to a blob
    deviceHwConfig: {
        type: String
    },
    // Human-readable device name.
    name: {
      type: String
    },
    // Human-readable device description.
    description: {
        type: String
    },
    // Device tags: location, personality, etc.
    tags: {
        type: [String]
    },
    // Device is operational and active in the System, data flow is trusted, e.g not stolen etc.
    active: {
        type: Boolean
    },
    // Device is connected now.
    connected: {
        type: Boolean
    },
    // Device's last connection date and time.
    lastSeenAt: {
        type: Date
    },
    // Device's last update in the DB.
    updatedAt: {
        type: Date
    },
    // Device's created in the DB.
    createdAt: {
        type: Date
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: true,
  }
);

const MicrowaveDevice = mongoose.model("MicrowaveDevice", microwaveDeviceSchema);

module.exports = MicrowaveDevice;
