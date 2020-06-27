import { v4 as uuidv4 } from "uuid";
import express from "express";
import http from "http";
import socketio from "socket.io";
import AsyncLock from "async-lock";

const app = express();
const server = http.createServer(app);

const port = 8080;

server.listen(port, function () {
  console.log(`server is running on http://localhost:${port}`);
});

const io = socketio.listen(server);

let waitingPlayerId: string;
const lock = new AsyncLock();
let players: {
  [id: string]: { name: string; socketid: string; opponent?: string };
} = {};

io.on("connection", (socket) => {
  console.log("Acces to User:", socket.id);

  socket.on("playerPrepareDone", () => {
    socket.broadcast.emit("opponentPrepareDone");
  });

  socket.on("enter", (userName, id) => {
    // if the client does not have uuid, create and emit a new uuid
    const uuid = id || uuidv4();
    if (!id) {
      socket.emit("uuid", uuid);
    }

    players[uuid] = { name: userName, socketid: socket.id };

    lock.acquire("waitingPlayer", () => {
      if (waitingPlayerId && waitingPlayerId !== uuid) {
        players[uuid].opponent = waitingPlayerId;

        let waitingPlayer = players[waitingPlayerId];
        socket.to(waitingPlayer.socketid).emit("opponent", userName);
        socket.emit("opponent", waitingPlayer.name);

        waitingPlayerId = undefined;
        console.log("matched!", userName, waitingPlayer.name);
      } else {
        waitingPlayerId = uuid;
      }
    });
  });

  socket.on("disconnect", (_) => {
    console.log("Disconnect: ", socket.id);
    if (waitingPlayerId && waitingPlayerId === socket.id) {
      waitingPlayerId = undefined;
    }
  });
});
