const { createDeck, shuffle } = require("./deck");
const { compareHands } = require("./gomRules");
function createGame() {
  let deck = createDeck();
  shuffle(deck);

  return {
    players: [],
    deck,
    table: [],
    turn: 0,
    started: false,
  };
}

function start(game) {
  game.players.forEach((p) => {
    p.hand = game.deck.splice(0, 5);
  });

  game.started = true;
}

function playCard(game, playerId, cardIndexes) {
  const player = game.players.find((p) => p.id === playerId);

  const playedCards = cardIndexes.map((i) => player.hand[i]);

  // ลบไพ่ที่ใช้
  player.hand = player.hand.filter((_, i) => !cardIndexes.includes(i));

  game.table.push({
    playerId,
    card: playedCards.length === 1 ? playedCards[0] : playedCards,
  });

  if (game.table.length === game.players.length) {
    return resolveRound(game);
  }

  return game;
}

function resolveRound(game) {
  let winner = game.table[0];

  for (let i = 1; i < game.table.length; i++) {
    const result = compareHands([game.table[i].card], [winner.card]);

    if (result === "A") {
      winner = game.table[i];
    }
  }

  const player = game.players.find((p) => p.id === winner.playerId);
  player.score = (player.score || 0) + 1;

  game.table = [];

  return {
    winner: player.id,
    score: player.score,
  };
}

module.exports = {
  createGame,
  playCard,
  start,
};
