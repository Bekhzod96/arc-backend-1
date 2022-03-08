const mqtt = require('../mqtt');
const MicrowaveDevice = require('../models/microwaveDevice');

class MicrowaveMqttService {
    constructor(transport) {
        this.transport = transport;
        this.client = this.transport.client;
    }

    run() {
        console.log(`MicrowaveMqttService: Using: ${this.client.constructor.name}`);

        this.client.on('connect', (packet) => {
            console.debug(`MicrowaveMqttService: On: connect: ${JSON.stringify(packet)}`);
        });
        this.client.on('message', async (topic, payload, packet) => {
            console.debug(`MicrowaveMqttService: On: message: ${topic} - ${payload.toString()} - ${JSON.stringify(packet)}`);
            await this.handle_message(topic, payload.toString());
        });
        this.client.on('packetsend', (packet) => {
            console.debug(`MicrowaveMqttService: On: packetsend: ${JSON.stringify(packet)}`);
        });
        this.client.on('packetreceive', (packet) => {
            console.debug(`MicrowaveMqttService: On: packetreceive: ${JSON.stringify(packet)}`);
        });
        this.client.on('error', (err) => {
            console.warn(`MicrowaveMqttService: On: error: ${JSON.stringify(err)}`);
        });
    }

    async handle_message(topic, payload) {
        try {
            if (topic === '/microwave/device/online') {
                await this.handle_microwave_device_online_message(payload);
            }
        }
        catch(e) {
            console.error(`MicrowaveMqttService Error: ${e.message || e}`, e);
        }
    }

    async handle_microwave_device_online_message(payload) {
        const device = JSON.parse(payload);
        const found = await await MicrowaveDevice.findOne({ deviceUuid: device.deviceUuid });
        if (!found) {
            const created = await MicrowaveDevice.create(device);
            console.log(`MicrowaveMqttService: Device created: ${JSON.stringify(created)}`);
        }
        else {
            const updated = Object.assign(found, device);
            const saved = await found.updateOne(updated);
            console.log(`MicrowaveMqttService: Device updated: ${JSON.stringify(saved)}`);
        }
    }
}

module.exports = { MicrowaveMqttService };