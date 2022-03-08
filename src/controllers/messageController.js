const Message = require('../models/message');

exports.getDeviceMessages = async (req, res, next) => {
  const deviceId = req.params.id;

  const messages = await Message.find({ deviceId });
  res.status(200).json({
    status: "success",
    data: messages,
  });
};
