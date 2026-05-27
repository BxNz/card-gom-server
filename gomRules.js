const VALUE_RANK = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  10: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
};
function getComboType(cards) {
  const values = cards.map((c) => c.value);

  const unique = [...new Set(values)];

  // 🔥 Pair
  if (cards.length === 2 && unique.length === 1) {
    return { type: "PAIR", rank: 2 };
  }

  // 🔥 Three of a kind
  if (cards.length === 3 && unique.length === 1) {
    return { type: "TRIPLE", rank: 3 };
  }

  // 🔥 Straight
  if (isStraight(cards)) {
    return { type: "STRAIGHT", rank: 4 };
  }

  // 🔥 Single
  if (cards.length === 1) {
    return { type: "SINGLE", rank: 1 };
  }

  return { type: "INVALID", rank: 0 };
}
function isStraight(cards) {
  const sorted = cards.map((c) => VALUE_RANK[c.value]).sort((a, b) => a - b);

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1] + 1) {
      return false;
    }
  }

  return true;
}
function compareHands(aCards, bCards) {
  const a = getComboType(aCards);
  const b = getComboType(bCards);

  // 🔥 คนละประเภท → ตัวใหญ่ชนะ
  if (a.rank !== b.rank) {
    return a.rank > b.rank ? "A" : "B";
  }

  // 🔥 ถ้า type เท่ากัน → เทียบแต้ม
  const aScore = getMaxValue(aCards);
  const bScore = getMaxValue(bCards);

  return aScore > bScore ? "A" : "B";
}
function getMaxValue(cards) {
  return Math.max(...cards.map((c) => VALUE_RANK[c.value]));
}
module.exports = {
  getComboType,
  compareHands,
};
