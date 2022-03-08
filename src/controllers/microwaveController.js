const MicrowaveDevice = require('../models/microwaveDevice');

exports.getAllMicrowaveDevices = async (req, res, next) => {
    const devicesList = await MicrowaveDevice.find();
    res.status(200).json(devicesList);
};

exports.getMicrowaveDevice = async (req, res, next) => {
    const deviceId = req.params.deviceId;
    const found = await MicrowaveDevice.findOne({ deviceId });
    res.status(200).json(found);
};

exports.createMicrowaveDevice = async (req, res, next) => {
    const device = req.body;
    const created = await MicrowaveDevice.create(device);
    res.status(200).json(created);
};

exports.updateMicrowaveDevice = async (req, res, next) => {
    const update = req.body;
    const deviceId = req.params.deviceId;
    const found = await MicrowaveDevice.findOne({ deviceId });
    const updated = Object.assign(found, update);
    const saved = await found.updateOne(updated);
    res.status(200).json(created);
};

exports.deleteMicrowaveDevice = async (req, res, next) => {
    const deviceId = req.params.deviceId;
    const found = await MicrowaveDevice.findOne({ deviceId });
    const deleted = await found.deleteOne();
    res.status(200).json(deleted);
};

exports.getMicrowaveDevicePublicLink = async (req, res, next) => {
    const deviceId = req.params.deviceId;
    const publicLinkInfo = {
        url: `${req.protocol}://${req.get('host')}/microwave/public/${deviceId}`
    };
    res.status(200).json(publicLinkInfo);
}

exports.getMicrowaveDeviceSessionInfo = async (req, res, next) => {
    const deviceId = req.params.deviceId;
    const session = {
        connected: false
    };
    res.status(200).json(session);
}

exports.updateMicrowaveDeviceSessionInfo = async (req, res, next) => {
    const deviceId = req.params.deviceId;
    const update = req.body;
    const session = {
        connected: false
    };
    res.status(200).json(session);
}
