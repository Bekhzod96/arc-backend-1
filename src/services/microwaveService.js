const { MicrowaveMqttService } = require('./microwaveMqttService');
const { MicrowaveWsService } = require('./microwaveWsService');
const MicrowaveDevice = require('../models/microwaveDevice');

class MicrowaveService {
    constructor(mqttTransport, wsTransport) {
        this.mqttService = new MicrowaveMqttService(mqttTransport);
        this.wsService = new MicrowaveWsService(wsTransport);
    }

    run() {
        console.log(`MicrowaveService: Using: [${this.mqttService.constructor.name}, ${this.wsService.constructor.name}], starting...`);

        MicrowaveDevice.schema.post('save', (doc, next) => {
            console.log(`MicrowaveService: MicrowaveDevice Entity Event: 'save' for: ${JSON.stringify(doc)}`);
            this.notifyWsDevicesUpdated({});
            next();
        });
        MicrowaveDevice.schema.post('updateOne', (doc, next) => {
            console.log(`MicrowaveService: MicrowaveDevice Entity Event: 'updateOne' for: ${JSON.stringify(doc)}`);
            this.notifyWsDevicesUpdated({});
            next();
        });
        MicrowaveDevice.schema.post('update', (doc, next) => {
            console.log(`MicrowaveService: MicrowaveDevice Entity Event: 'update' for: ${JSON.stringify(doc)}`);
            this.notifyWsDevicesUpdated({});
            next();
        });

        this.mqttService.run();
        this.wsService.run();
    }

    notifyWsDevicesUpdated(payload) {
        this.wsService.emit('microwave-devices-update', payload);
    }

    async onDBConnected(conn) {
        console.debug(`MicrowaveService: DB connected...`);

        const testDevice1 = {
            deviceUuid: '79625925-92de-4271-af9d-2bc9d89ee906',
            deviceHardwareIdentifier: '79625925-92de-4271-af9d-2bc9d89ee906',
            deviceHardwareModel: 'Mock Device',
            deviceHardwareVersion: '0.0.1',
            deviceInternalIP: '10.10.10.2',
            deviceExternalIP: '1.1.1.1',
            deviceHwConfig: '0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0',
            name: 'Mock Device 1',
            description: 'Added for the testing purposes',
            tags: ['mock', 'test'],
            active: true,
            connected: false,
            lastSeenAt: new Date(),
            updatedAt: new Date(),
            createdAt: new Date(),
        };

        const testDevice2 = {
            deviceUuid: 'fd838bf8-6d6d-41ce-ac1f-19b45b273e33',
            deviceHardwareIdentifier: 'fd838bf8-6d6d-41ce-ac1f-19b45b273e33',
            deviceHardwareModel: 'Mock Device',
            deviceHardwareVersion: '0.0.1',
            deviceInternalIP: '10.10.10.2',
            deviceExternalIP: '2.2.2.2',
            deviceHwConfig: '0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0',
            name: 'Mock Device 2',
            description: 'Added for the testing purposes',
            tags: ['mock', 'test'],
            active: true,
            connected: false,
            lastSeenAt: new Date(),
            updatedAt: new Date(),
            createdAt: new Date(),
        };

        const testDevice1Found = await MicrowaveDevice.findOne({ deviceUuid: testDevice1.deviceUuid });
        const testDevice2Found = await MicrowaveDevice.findOne({ deviceUuid: testDevice2.deviceUuid });

        if (!testDevice1Found) {
            console.debug(`MicrowaveService: Creating device: ${testDevice1.deviceUuid}`);
            const created1 = await MicrowaveDevice.create(testDevice1);
            console.debug(`MicrowaveService: Created device: ${JSON.stringify(created1)}`);
        }
        else {
            console.debug(`MicrowaveService: device: ${testDevice1.deviceUuid} found.`);
            const updated = Object.assign(testDevice1Found, testDevice1);
            const saved = await testDevice1Found.updateOne(updated);
        }

        if (!testDevice2Found) {
            console.debug(`MicrowaveService: Creating device: ${ testDevice2.deviceUuid}`);
            const created = await MicrowaveDevice.create(testDevice2);
            console.debug(`MicrowaveService: Created device: ${JSON.stringify(created)}`);
        }
        else {
            console.debug(`MicrowaveService: device: ${ testDevice2.deviceUuid} found.`);
            const updated = Object.assign(testDevice2Found, testDevice2);
            const saved = await testDevice2Found.updateOne(updated);
        }
    }
}

module.exports = { MicrowaveService };