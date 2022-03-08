const axios = require('axios');
const Device = require('../models/device');
const Version = require('../models/version');
const Tag = require('../models/tag');
const mqtt = require('../mqtt');

exports.getDevices = async (req, res, next) => {
  const currentUser = req.user;
  const resp = await axios.get('https://api.scaleway.com/iot/v1beta1/regions/fr-par/devices', {
    headers: {
      "X-Auth-Token": "20df380b-3647-46b4-8b22-719513692ba0"
    }
  });
  const devicesList = resp.data.devices;

  if (currentUser.role === 'admin') {
    res.status(200).json({
      status: "success",
      data: devicesList,
    });
  } else {
    const userDevices = await Device.find({ user: currentUser._id });
    const userDevicesList = devicesList.filter(item => userDevices.findIndex(el => el.deviceId === item.id) !== -1);

    res.status(200).json({
      status: "success",
      data: userDevicesList,
    });
  }
};

exports.getDevice = async (req, res, next) => {
  const resp = await axios.get(`https://api.scaleway.com/iot/v1beta1/regions/fr-par/devices/${req.params.id}`, {
    headers: {
      "X-Auth-Token": "20df380b-3647-46b4-8b22-719513692ba0"
    }
  });
  const deviceDatabase = await Device.find({ deviceId: resp.data.id }).populate('user');
  const userDevice = deviceDatabase[0] ? deviceDatabase[0].user : null;

  if (req.user.role === 'admin') {
    res.status(200).json({
      status: "success",
      data: {
        ...resp.data,
        user: userDevice,
      },
    });
  } else if (userDevice && userDevice._id.toString() === req.user._id.toString()) {
    res.status(200).json({
      status: "success",
      data: {
        ...resp.data,
        user: userDevice,
      },
    });
  } else {
    res.status(401).json({
      status: "Unauthorized",
    });
  }
};

exports.deleteDevice = async (req, res, next) => {
  const resp = await axios.delete(`https://api.scaleway.com/iot/v1beta1/regions/fr-par/devices/${req.params.id}`, {
    headers: {
      "X-Auth-Token": "20df380b-3647-46b4-8b22-719513692ba0"
    }
  }).catch(err => console.log(err));

  res.status(204).json({
    status: "success",
  });
};

exports.disableDevice = async (req, res, next) => {
  console.log(req.params.id);
  const resp = await axios.post(`https://api.scaleway.com/iot/v1beta1/regions/fr-par/devices/${req.params.id}/disable`, {}, {
    headers: {
      "X-Auth-Token": "20df380b-3647-46b4-8b22-719513692ba0"
    }
  });

  res.status(200).json({
    status: "success",
  });
};

exports.enableDevice = async (req, res, next) => {
  const resp = await axios.post(`https://api.scaleway.com/iot/v1beta1/regions/fr-par/devices/${req.params.id}/enable`, {}, {
    headers: {
      "X-Auth-Token": "20df380b-3647-46b4-8b22-719513692ba0"
    }
  });

  res.status(200).json({
    status: "success",
  });
};

exports.createDevice = async (req, res, next) => {
  const resp = await axios.post(`https://api.scaleway.com/iot/v1beta1/regions/fr-par/devices`, {
    name: req.body.name,
    hub_id: '8f32b65d-15e0-4f98-bd7c-6db04d832af4',
    allow_insecure: req.body.allowInsecure
  }, {
    headers: {
      "X-Auth-Token": "20df380b-3647-46b4-8b22-719513692ba0"
    }
  });
  const { device, crt, key } = resp.data;
  await Device.create({
    name: device.name,
    deviceId: device.id,
    status: device.status,
    allowInsecure: device.allow_insecure,
    updatedAt: new Date(),
    createdAt: new Date(),
    crt,
    key,
    tags: req.body.tags,
  });

  res.status(200).json({
    status: "success",
    data: device
  });
};

exports.updateDeviceVersion = async (req, res, next) => {
  const { versionId, deviceListIds, tags } = req.body;
  const version = await Version.findById(versionId);

  if (!version) {
    return next(new Error('Version does not exit on the server'));
  }

  deviceListIds.forEach(async id => {
    const device = await Device.findOne({ deviceId: id });
    if (device) {
      device.updateAvailable = true;
      const history = device.updateHistory;
      history.push(versionId);
      device.updateHistory = history;
      await device.save();
      mqtt.client.publish(`/${id}/update`, `http://dev3.arc.lv/versions/${versionId}?deviceId=${id}`);
    }
  });

  tags.forEach(async tag => {
    const devices = await Device.find({ tags: { "$in": [tag] } });
    for (let device of devices) {
      device.updateAvailable = true;
      const history = device.updateHistory;
      history.push(versionId);
      device.updateHistory = history;
      await device.save();
      mqtt.client.publish(`/${device.deviceId}/update`, `http://dev3.arc.lv/versions/${versionId}?deviceId=${device.deviceId}`);
    }
  });

  res.status(200).json({
    status: "success",
  });
}
