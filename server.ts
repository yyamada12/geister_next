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
  [id: string]: { name?: string; socketid: string; opponent?: string };
} = {};

io.on("connection", (socket) => {
  console.log("Acces to User:", socket.id);

  socket.on("uuid", (id) => {
    if (!id) {
      // if the client does not have uuid, create and emit a new uuid
      const newId = uuidv4();
      socket.emit("assignId", newId);
      players[newId] = { socketid: socket.id };
    } else {
      players[id].socketid = socket.id;
    }
  });

  socket.on("enter", (userName, id) => {
    if (!players[id]) {
      console.log("invalid id: ", id);
      return;
    }
    players[id] = { name: userName, socketid: socket.id };

    lock.acquire("waitingPlayer", () => {
      if (waitingPlayerId && waitingPlayerId !== id) {
        players[id].opponent = waitingPlayerId;
        players[waitingPlayerId].opponent = id;

        let waitingPlayer = players[waitingPlayerId];
        socket.to(waitingPlayer.socketid).emit("opponent", userName);
        socket.emit("opponent", waitingPlayer.name);

        waitingPlayerId = undefined;
        console.log("matched!", userName, waitingPlayer.name);
      } else {
        waitingPlayerId = id;
      }
    });
  });

  socket.on("move", (from, to, id) => {
    console.log("move");
    const opponentId = players[id].opponent;
    console.log(opponentId);
    console.log(players[opponentId].socketid);
    socket.to(players[opponentId].socketid).emit("move", from, to);
  });

  socket.on("playerPrepareDone", (id) => {
    socket
      .to(players[players[id].opponent].socketid)
      .emit("opponentPrepareDone");
  });

  socket.on("disconnect", (_) => {
    console.log("Disconnect: ", socket.id);
    if (waitingPlayerId && players[waitingPlayerId].socketid === socket.id) {
      waitingPlayerId = undefined;
    }
  });
});
