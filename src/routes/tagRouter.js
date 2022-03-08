const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

router.route('/').get(tagController.getAllTag).post(tagController.createTag);
router.route('/:deviceId').get(tagController.getDeviceTag).post(tagController.createDeviceTag);

module.exports = router;
