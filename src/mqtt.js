const mqtt = require('mqtt');
const dotenv = require('dotenv');
const { Subject } = require('rxjs');
const Message = require('./models/message');
const Version = require('./models/version');
const Device = require('./models/device');

// Environment Setup
dotenv.config({ path: './config.env' });

console.log(`MQTT: ${process.env.MQTT_ENDPOINT}: ${process.env.MQTT_HOST}:${process.env.MQTT_PORT} - ${process.env.MQTT_CLIENTID}`);

const client = mqtt.connect(process.env.MQTT_ENDPOINT, {
	host: process.env.MQTT_HOST,
	port: process.env.MQTT_PORT,
	clientId: process.env.MQTT_CLIENTID
});

const subjectMqttToWs = new Subject();

client.on('connect', () => {
	console.log('mqtt connected');
	client.subscribe('+/#');
	client.on('message', async (topic, msg, packet) => {
		if (topic.split('/')[1]) {
			const deviceId = topic.split('/')[1];
			Message.create({
				body: msg.toString(),
				topic,
				deviceId,
				updatedAt: new Date(),
				createdAt: new Date(),
			});

			const device = await Device.findOne({ deviceId: deviceId });

			if (
				device &&
				device.updateAvailable &&
				topic.split('/')[2] === 'connected'
			) {
				const versionID = device.updateHistory[device.updateHistory.length - 1];
				client.publish(
					`/${deviceId}/update`,
					`http://dev3.arc.lv/versions/${versionID}?deviceId=${deviceId}`
				);
			}

			if (device && topic.split('/')[2] === 'upload-success') {
				device.updateAvailable = false;
				await device.save();
			}
		}
		subjectMqttToWs.next({
			topic,
			message: msg.toString(),
			createdAt: new Date(),
		});
	});
});

module.exports = { client, subjectMqttToWs };
