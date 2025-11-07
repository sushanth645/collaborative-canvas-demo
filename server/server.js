const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { setupCanvasHandlers } = require("./room");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 8000;

// serve client
app.use(express.static(__dirname + "/../client"));

// handle sockets
io.on("connection", (socket) => {
  console.log("🟢 New socket connected:", socket.id);
  setupCanvasHandlers(io, socket);
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});






