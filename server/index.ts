import { v4 as uuidv4 } from "uuid";
import express from "express";
import http from "http";
import socketio from "socket.io";
import AsyncLock from "async-lock";

import next from "next";

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const port = 8080;

nextApp.prepare().then(() => {
  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, function () {
    console.log(`server is running on http://localhost:${port}`);
  });
});

let waitingPlayerId: string | undefined;
const lock = new AsyncLock();
let players: {
  [id: string]: { name?: string; socketid: string; opponent?: string };
} = {};

const getOpponentSocketid = (id: string) => {
  return players[players[id].opponent].socketid;
};

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

        const turn = Math.floor(Math.random() * 2) === 1;
        const waitingPlayer = players[waitingPlayerId];
        socket.to(waitingPlayer.socketid).emit("opponent", userName, turn);
        socket.emit("opponent", waitingPlayer.name, !turn);

        waitingPlayerId = undefined;
        console.log("matched!", userName, waitingPlayer.name);
      } else {
        waitingPlayerId = id;
      }
    });
  });

  socket.on("move", (from, to, id) => {
    socket.to(getOpponentSocketid(id)).emit("move", from, to);
  });

  socket.on("playerPrepareDone", (id) => {
    socket.to(getOpponentSocketid(id)).emit("opponentPrepareDone");
  });

  socket.on("playerTurnEnd", (id) => {
    console.log("player", id, "turn end");
    socket.to(getOpponentSocketid(id)).emit("opponentTurnEnd");
  });

  socket.on("disconnect", (_) => {
    console.log("Disconnect: ", socket.id);
    if (waitingPlayerId && players[waitingPlayerId].socketid === socket.id) {
      waitingPlayerId = undefined;
    }
  });
});
