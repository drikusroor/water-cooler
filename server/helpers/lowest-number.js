function lowestUnusedNumber(sequence, startingFrom) {
  const arr = sequence.slice(0);
  arr.sort((a, b) => a - b);

  return arr.reduce((lowest, num, i) => {
    const seqIndex = i + startingFrom;
    return num !== seqIndex && seqIndex < lowest ? seqIndex : lowest;
  }, arr.length + startingFrom);
}

module.exports = lowestUnusedNumber;
