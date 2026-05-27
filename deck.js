function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = [
    { v: "A", p: 14 },
    { v: "K", p: 13 },
    { v: "Q", p: 12 },
    { v: "J", p: 11 },
    { v: "10", p: 10 },
    { v: "9", p: 9 },
    { v: "8", p: 8 },
    { v: "7", p: 7 },
    { v: "6", p: 6 },
    { v: "5", p: 5 },
    { v: "4", p: 4 },
    { v: "3", p: 3 },
    { v: "2", p: 2 },
  ];

  let deck = [];

  for (let s of suits) {
    for (let v of values) {
      deck.push({
        suit: s,
        value: v.v,
        point: v.p,
      });
    }
  }

  return deck;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

module.exports = { createDeck, shuffle };
