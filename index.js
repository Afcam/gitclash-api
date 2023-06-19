const { httpServer } = require("./src/app");
require("dotenv").config();

// Globals
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "127.0.0.1";

// Start Listening...
const server = httpServer.listen(PORT, HOST, () => {
  const { address, port } = server.address();
  console.log(`Server listening on http://${address}:${port}`);
});
