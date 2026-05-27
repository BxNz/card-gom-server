const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { createGame, playCard, start } = require("./gameEngine");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

let rooms = {};

io.on("connection", (socket) => {
  console.log("connect:", socket.id);

  socket.on("join_room", ({ roomId, name }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = createGame();
    }

    rooms[roomId].players.push({
      id: socket.id,
      name,
      hand: [],
      score: 0,
    });

    io.to(roomId).emit("room_update", rooms[roomId]);
  });

 socket.on("start_game", (roomId) => {
   const game = rooms[roomId];

   start(game);

   io.to(roomId).emit("game_started", game);
 });

  socket.on("play_card", ({ roomId, cardIndex }) => {
    const game = rooms[roomId];

    const result = playCard(game, socket.id, cardIndex);

    io.to(roomId).emit("game_update", result);
  });
});

server.listen(3001, () => {
  console.log("server running 3001");
});
