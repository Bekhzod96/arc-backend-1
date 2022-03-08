const Record = require('../models/record');

exports.getRecords = async (req, res, next) => {
  const { deviceId } = req.query;

  const records = await Record.find({ deviceId }).select('-file');

  res.status(200).json({
    status: "success",
    data: records
  });
}

exports.getRecord = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.params);
  console.log(id);

  const record = await Record.findById(id);

  res.status(200).json({
    status: "success",
    data: record
  });
}