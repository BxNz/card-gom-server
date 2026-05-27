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
    if (!roomId) return;

    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = createGame();
    }

    const existingPlayer = rooms[roomId].players.find((p) => p.id === socket.id);
    if (!existingPlayer) {
      rooms[roomId].players.push({
        id: socket.id,
        name: name || "Player",
        hand: [],
        score: 0,
      });
    }

    io.to(roomId).emit("room_update", rooms[roomId]);
  });

  socket.on("get_room_state", (roomId) => {
    if (!roomId || !rooms[roomId]) return;
    io.to(socket.id).emit("room_update", rooms[roomId]);
  });

  socket.on("start_game", (roomId) => {
    const game = rooms[roomId];
    if (!game) return;
    if (game.started) {
      io.to(roomId).emit("game_started", game);
      return;
    }

    if (game.players.length < 2) {
      io.to(socket.id).emit("error_message", "Need at least 2 players to start");
      return;
    }

    start(game);

    io.to(roomId).emit("game_started", game);
  });

  socket.on("play_card", ({ roomId, cardIndex, cardIndexes }) => {
    const game = rooms[roomId];
    if (!game) return;

    const indexes = Array.isArray(cardIndexes) ? cardIndexes : [cardIndex];

    const result = playCard(game, socket.id, indexes);

    io.to(roomId).emit("game_update", result);
  });

  socket.on("disconnect", () => {
    Object.entries(rooms).forEach(([roomId, game]) => {
      const before = game.players.length;
      game.players = game.players.filter((p) => p.id !== socket.id);

      if (game.players.length !== before) {
        io.to(roomId).emit("room_update", game);
      }

      if (game.players.length === 0) {
        delete rooms[roomId];
      }
    });
  });
});

server.listen(3001, () => {
  console.log("server running 3001");
});
