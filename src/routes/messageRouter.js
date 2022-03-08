const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.get("/:id", messageController.getDeviceMessages);

module.exports = router;
