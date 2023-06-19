const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();

//paths for the basic routes
const roomRoutes = require('./routes/rooms-routes');

// Create the http server
const httpServer = createServer(app);

// Configure Socket.IO
const io = new Server(httpServer);

// Normal express config defaults
app.use(cors());
app.use(express.json());

// Middleware
// app.use(authMiddleware);

// Routes
app.use('/api/rooms', roomRoutes);

module.exports = { httpServer, io };
