const path = require('path');

exports.getUpdateFile = async (req, res, next) => {
	const format = req.params.format;
	const rel_path = path.resolve(`./wwwroot/devices/CarContV2.${format}`)
	res.status(200).sendFile(rel_path)
}