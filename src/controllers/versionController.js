const Version = require('../models/version');
const Device = require('../models/device');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './wwwroot/versions');
  },
  filename: async (req, file, cb) => {
    const timestap = Date.now();
    const version = await Version.create({
      name: `${timestap}-${file.originalname}`,
      path: `./wwwroot/versions/${timestap}-${file.originalname}`,
      createdAt: new Date(),
    });
    req.versionId = version._id;
    cb(null, version.name);
  }
});

const upload = multer({
  storage: multerStorage,
});

exports.uploadVersion = upload.single('file');

exports.newVersion = async (req, res, next) => {
  const version = await Version.findById(req.versionId);
  res.status(200).json({
    message: "success",
    data: version
  });
};

exports.getVersions = async (req, res, next) => {
  const versions = await Version.find();
  res.status(200).json({
    message: "success",
    data: versions,
  });
};

exports.getVersionFile = async (req, res, next) => {
  const versionId = req.params.id;
  const { deviceId } = req.query;
  const version = await Version.findById(versionId);
  const device = await Device.findOne({ deviceId });
  const key = device.testKey;
  if (key) {
    const filePath = path.resolve(version.path);
    const keyPath = path.resolve('./wwwroot/key');
    const encryptedPath = path.resolve('./wwwroot/encryped');

    fs.createWriteStream(`${keyPath}/key.pem`).write(key.split("///").join("\n"), function (err) {
      if (err) throw err;
      console.log(`Key Saved to ${keyPath}/key.pem !`);
    });

    exec(`espsecure sign_data --keyfile ${keyPath}/key.pem --output ${encryptedPath}/encrypted_car_controller_firmware.bin ${filePath}`, (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        console.error(err)
      } else {
        res.sendFile(`${encryptedPath}/encrypted_car_controller_firmware.bin`);
      }
    });
  }
};

exports.getVersionFileUn = async (req, res, next) => {
  const versionId = req.params.id;
  const version = await Version.findById(versionId);
  const rel_path = path.resolve(version.path)
  res.sendFile(rel_path);
};
