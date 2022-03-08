const express = require("express");
const fileController = require("../controllers/fileController");

const router = express.Router();

router
	.route('/:format')
	.get(fileController.getUpdateFile);

module.exports = router;