const express = require("express");
const deviceController = require("../controllers/deviceController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.route('/:id').delete(deviceController.deleteDevice).get(deviceController.getDevice);
router.route('/:id/enable').post(deviceController.enableDevice);
router.route('/:id/disable').post(deviceController.disableDevice);
router
  .route('/')
  .put(deviceController.updateDeviceVersion)
  .get(deviceController.getDevices)
  .post(
    authController.restrictTo('admin'),
    deviceController.createDevice);

module.exports = router;
