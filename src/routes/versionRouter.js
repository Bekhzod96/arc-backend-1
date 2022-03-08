const express = require("express");
const versionController = require("../controllers/versionController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route('/un/:id').get(versionController.getVersionFileUn);
router
  .route('/:id')
  .get(versionController.getVersionFile);
router.use(authController.protect, authController.restrictTo('admin'));
router.route('/')
  .post(
    versionController.uploadVersion,
    versionController.newVersion,
  )
  .get(versionController.getVersions);

module.exports = router;
