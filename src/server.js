const fs = require('fs');
const { exec } = require('child_process');
const dotenv = require('dotenv');
const path = require('path');
const ss = require('socket.io-stream');
const mqtt = require('./mqtt');
const mongoose = require('mongoose');
const Version = require('./models/version');
const Device = require('./models/device');
const { httpsServer, httpServer, io } = require('./app');
const { MicrowaveService } = require('./services/microwaveService');

// Environment Setup
dotenv.config({ path: './config.env' });

// Micriwave service setup
const microwaveService = new MicrowaveService(mqtt, io);
microwaveService.run();

// Socket IO Setup
io.use(async (socket, next) => {
  const deviceId = socket.handshake.query.id;
  const device = await Device.findOne({ deviceId: deviceId });
  if (device && device.updateAvailable) {
    const versionID = device.updateHistory[device.updateHistory.length - 1];
    mqtt.client.publish(`/${deviceId}/update`, versionID);
  }
  next();
});

io.on('connection', (socket) => {
  console.log('New Web Socket connection');

  mqtt.subjectMqttToWs.subscribe(async (body) => {
    socket.emit('message', body);
  });

  socket.on('command', (data) => {
    mqtt.client.publish(data.topic, data.message);
  });

  socket.on('update', async (data) => {
    const { deviceId } = data;
    const device = await Device.find({ deviceId: deviceId });

    const versionID = device[0].updateHistory[device[0].updateHistory.length - 1];
    const version = await Version.findById(versionID);
    const key = device[0].testKey;
    if (key) {
      const filePath = path.resolve(version.path);
      const keyPath = path.resolve('./wwwroot/key');
      const encryptedPath = path.resolve('./wwwroot/encryped');

      fs.createWriteStream(`${keyPath}/key.pem`).write(
        key.split('///').join('\n'),
        function (err) {
          if (err) throw err;
          console.log(`Key Saved to ${keyPath}/key.pem !`);
        }
      );

      exec(
        `espsecure sign_data --keyfile ${keyPath}/key.pem --output ${encryptedPath}/encrypted_car_controller_firmware.bin ${filePath}`,
        (err, stdout, stderr) => {
          if (err) {
            //some err occurred
            console.error(err);
          } else {
            const stream = ss.createStream();
            ss(socket).emit(`/${deviceId}/update`, stream, {
              name: 'encrypted_car_controller_firmware.bin',
            });
            fs.createReadStream(
              `${encryptedPath}/encrypted_car_controller_firmware.bin`
            ).pipe(stream);
          }
        }
      );
    }
  });

  socket.on('upload-success', async (data) => {
    const { deviceId } = data;
    const device = await Device.findOne({ deviceId: deviceId });
    if (device) {
      device.updateAvailable = false;
      await device.save();
    }
  });

});

// MongoDB Setup
mongoose
  .connect(
    'mongodb+srv://root:Root2015@@cluster0-glvfn.mongodb.net/iot?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  .then((conn) => {
    console.log('MongoDB connected');
    microwaveService.onDBConnected(conn);
  })
  .catch((err) => {
    console.log('connection to db failed');
    console.log(err.name, err.message);
  });

// HTTP Setup
const HTTP_PORT = process.env.HTTP_PORT || 80;
const httpServerLis = httpServer.listen(HTTP_PORT, () =>
  console.log(`HTTP server running on port ${HTTP_PORT}`)
);

// Https Setup
const HTTPS_PORT = process.env.HTTPS_PORT || 443;
const httpsServerLis = httpsServer.listen(HTTPS_PORT, () => {
  console.log(`HTTPS Server running on port ${HTTPS_PORT}`);
});

// Global Promise Unhandled Rejection handling
process.on('unhandledRejection', (err) => {
  console.log(err);
  httpServerLis.close(() => process.exit(1));
  httpsServerLis.close(() => process.exit(1));
});

// Global Unhandled Exception handling
process.on('uncaughtException', (err) => {
  console.log(err);
  process.exit(1);
});