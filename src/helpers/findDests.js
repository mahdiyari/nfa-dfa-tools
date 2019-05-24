/**
 * Find destinations for states by given input
 * @param {Object} moves
 * @param {array} states
 * @param {string} input
*/
const findDests = (moves, states, input) => {
  const result = []
  for (let state of states) {
    for (let input1 in moves[state]) {
      if (input1 === input) {
        for (const dest of moves[state][input]) {
          result.push(dest)
        }
      }
    }
  }
  return result
}
exports.findDests = findDests
