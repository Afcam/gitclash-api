const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const { verifyToken } = require('./middleware/httpAuth');
// const httpAuth = require('./middleware/httpAuth');

const app = express();
const httpServer = createServer(app);

// Normal express config defaults
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/rooms', require('./routes/rooms-routes'));
app.use('/api/player', verifyToken, require('./routes/player-routes'));
// app.use('/api/game', httpAuth.verifyToken, require('./routes/game-routes'));

module.exports = { httpServer };
