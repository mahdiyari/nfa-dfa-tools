// keep eclosures in one object
let eClosures = {}
/**
 * Get epsilon-closure of an array of states in NFA
 * @param {NFA} nfa
 * @param {array} states
 * @param {boolean} reset optional
 */
const eClosure = (nfa, states, reset) => {
  if (reset) eClosures = {}
  if (eClosures.hasOwnProperty(states)) {
    return eClosures[states]
  }
  const result = states
  for (let state of states) {
    for (let input in nfa.moves[state]) {
      if (input === '') {
        for (const dest of nfa.moves[state][input]) {
          result.push(dest)
        }
      }
    }
  }
  // inorder to detect equal arrays we should sort them
  eClosures[states] = result.sort()
  return eClosures[states]
}
exports.eClosure = eClosure
