const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const socketio = require('socket.io');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const path = require('path');
const indexRouter = require('./routes/indexRouter');
const deviceRouter = require('./routes/deviceRouter');
const userRouter = require('./routes/userRouter');
const versionRouter = require('./routes/versionRouter');
const messageRouter = require('./routes/messageRouter');
const tagRouter = require('./routes/tagRouter');
const recordRouter = require('./routes/recordRouter');
const fileRouter = require('./routes/fileRouter');
const microwaveRouter = require('./routes/microwaveRouter');

//
// Define Swagger params
//
const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Car-Controller-backend',
			version: '1.0.0',
			description: 'Car-Controller-backend Express API with Swagger',
		},
		servers: [ {url: 'http://localhost:8080/',} ],
	},
	apis: ["./src/routes/microwaveRouter.js"]
};
  
const swaggerSpecs = swaggerJsdoc(swaggerOptions);

//
// Define Express routes
//

const apiPrefix = '/api';
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json({limit: '1mb'}));
app.use(express.static(path.join(__dirname, '/wwwroot')));
// Disabled this ./ static serving
// app.use(express.static(__dirname, { dotfiles: 'allow' }));
app.use(`${apiPrefix}`, indexRouter);
app.use(`${apiPrefix}/users`, userRouter);
app.use(`${apiPrefix}/devices`, deviceRouter);
app.use(`${apiPrefix}/versions`, versionRouter);
app.use(`${apiPrefix}/messages`, messageRouter);
app.use(`${apiPrefix}/tags`, tagRouter);
app.use(`${apiPrefix}/records`, recordRouter);
app.use(`${apiPrefix}/file`, fileRouter);
app.use(`${apiPrefix}/microwave`, microwaveRouter);
app.use(`${apiPrefix}/get-status`, (req, res) => {
	res.status(200).send({'status': true})
});
app.use(
	'/api-doc',
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpecs)
);

const privateKey = fs.readFileSync('./letsencrypt/privkey.pem', 'utf8');
const certificate = fs.readFileSync('./letsencrypt/cert.pem', 'utf8');
const ca = fs.readFileSync('./letsencrypt/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

const httpsServer = https.createServer(credentials, app);
const httpServer = http.createServer(app);
const io = socketio(httpServer);
// const wss = new WebSocket.Server({ server: httpsServer, path: '/ws' });

module.exports = { httpsServer, httpServer, io };
