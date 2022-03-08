class MicrowaveWsService {
    constructor(transport) {
        this.transport = transport;
    }

    run() {
        console.log(`MicrowaveWsService: Using: ${this.transport.constructor.name}`);
    }

    emit(message, payload) {
        this.transport.emit(message, payload);
    }
}

module.exports = { MicrowaveWsService };