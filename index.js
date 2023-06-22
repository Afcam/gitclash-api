const { httpServer } = require('./src/app');
const { initSocket } = require('./src/socket');
require('dotenv').config();

// Globals
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '127.0.0.1';

initSocket(httpServer);

// Start Listening...
const server = httpServer.listen(PORT, HOST, () => {
  const { address, port } = server.address();
  console.log(`Server listening on http://${address}:${port}`);
});
