const express = require("express");
const app = express();
const server = require("http").createServer(app);

const port = 8080;

server.listen(port, function () {
  console.log(`server is running on http://localhost:${port}`);
});

const socketio = require("socket.io");
const io = socketio.listen(server);

io.on("connection", (socket) => {
  console.log("Acces to User:", socket.client.id);
  socket.on("playerPrepareDone", () => {
    socket.broadcast.emit("oppositePrepareDone");
  });
});
