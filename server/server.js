const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { setupCanvasHandlers } = require("./room");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 8000;

app.use(express.static(__dirname + "/../client"));

io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);
  setupCanvasHandlers(io, socket);
});

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});






