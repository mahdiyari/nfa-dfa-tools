const { findDests } = require('./findDests')
const { isFinal } = require('./isFinal')

/**
 * Return true if given string is accepted by input dfa
 * @param {NFA} dfa
 * @param {string} string - input
 */
const testDFA = (dfa, string) => {
  let startState = dfa.start
  for (let i = 0; i < string.length; i++) {
    const [dest] = findDests(dfa.moves, [startState], string[i])
    if (!dest) return false
    if (i === string.length - 1) {
      if (isFinal([dest], dfa.finals)) {
        return true
      }
    }
    startState = dest
  }
  return false
}

exports.testDFA = testDFA
