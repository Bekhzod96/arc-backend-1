const express = require("express");
const recordController = require("../controllers/recordController");

const router = express.Router();

router.route('/:id').get(recordController.getRecord);
router.route('/').get(recordController.getRecords);

module.exports = router;
