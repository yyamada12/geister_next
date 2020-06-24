import { v4 as uuidv4 } from "uuid";
import express from "express";
import http from "http";
import socketio from "socket.io";

const app = express();
const server = http.createServer(app);

const port = 8080;

server.listen(port, function () {
  console.log(`server is running on http://localhost:${port}`);
});

const io = socketio.listen(server);

let waitingPlayerId: string;
let players: {
  [id: string]: { name: string; socketid: string; opposite?: string };
} = {};

io.on("connection", (socket) => {
  console.log("Acces to User:", socket.id);

  socket.on("playerPrepareDone", () => {
    socket.broadcast.emit("oppositePrepareDone");
  });

  socket.on("enter", (userName) => {
    const id = uuidv4();
    socket.emit("uuid", id);
    players[id] = { name: userName, socketid: socket.id };

    if (waitingPlayerId && waitingPlayerId !== id) {
      players[id].opposite = waitingPlayerId;

      let waitingPlayer = players[waitingPlayerId];
      socket.to(waitingPlayer.socketid).emit("opposite", userName);
      socket.emit("opposite", waitingPlayer.name);

      waitingPlayerId = undefined;
      console.log("matched!", userName, waitingPlayer.name);
    } else {
      waitingPlayerId = id;
    }
  });

  socket.on("disconnect", (_) => {
    console.log("Disconnect: ", socket.id);
    if (waitingPlayerId && waitingPlayerId === socket.id) {
      waitingPlayerId = undefined;
    }
  });
});
