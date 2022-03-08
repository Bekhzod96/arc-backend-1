const Tag = require('../models/tag');
const Device = require('../models/device');

exports.createTag = async (req, res, next) => {
  const { name } = req.body;
  let tag = await Tag.findOne({ name });
  if (!tag) {
    tag = await Tag.create({ name });
  }

  res.status(200).json({
    status: "success",
    data: tag,
  });
};

exports.getAllTag = async (req, res, next) => {
  const tags = await Tag.find();

  res.status(200).json({
    status: "success",
    data: tags,
  });
};

exports.getDeviceTag = async (req, res, next) => {
  const { deviceId } = req.params;

  const device = await Device.findOne({ deviceId });

  res.status(200).json({
    status: "success",
    data: device.tags
  });
}

exports.createDeviceTag = async (req, res, next) => {
  const { deviceId } = req.params;
  const device = await Device.findOne({ deviceId });

  const { names } = req.body;
  for(let name of names){
    let tag = await Tag.findOne({ name });
    if (!tag) {
      tag = await Tag.create({ name });
    }
    device.tags = device.tags ? [tag.name,...device.tags] : [tag.name];
  }
  
  await device.save();

  res.status(200).json({
    status: "success"
  });
}
