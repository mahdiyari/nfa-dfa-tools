const { NFA } = require('./helpers/NFA')
const { getNextAlphabet } = require('./helpers/getNextAlphabet')
const { findDests } = require('./helpers/findDests')
const { isFinal } = require('./helpers/isFinal')

let movesDFA = {}
let finalsDFA = []
/**
 * Minimize given DFA
 * @param {NFA} dfa
 */
const minimizeDFA = dfa => {
  movesDFA = {}
  finalsDFA = []
  const equivalents = {}
  const nonFinals = []
  for (let state of dfa.states) {
    if (dfa.finals.indexOf(state) < 0) {
      nonFinals.push(state)
    }
  }
  const startState = getNextAlphabet(true)
  equivalents[startState] = nonFinals
  equivalents[getNextAlphabet()] = dfa.finals
  const reservedSymbol = getNextAlphabet()
  checkEquivalents(dfa, equivalents, reservedSymbol) // dfa, [nonF, F], 'C'
  movesDFA = getMoves(dfa, equivalents)
  const newDFA = new NFA(startState, finalsDFA, movesDFA, dfa.alphabet)
  return newDFA
}

/**
 * Check equivalents of each state
 * @param {NFA} dfa
 * @param {Object} equivalents
 */
const checkEquivalents = (dfa, equivalents, reservedSymbol) => {
  let isDone = true
  for (let key in equivalents) { // B
    if (key === reservedSymbol) {
      reservedSymbol = getNextAlphabet()
    }
    const states = equivalents[key] // [F]
    if (states.length > 1) {
      // if we have both nonfinal and final states in new group
      // then create another group for final states
      if (isFinal(states[0], dfa.finals)) {
        if (equivalents.hasOwnProperty(reservedSymbol)) {
          if (!isFinal(equivalents[reservedSymbol][0], dfa.finals)) {
            reservedSymbol = getNextAlphabet()
          }
        }
      }
      for (let input of dfa.alphabet) {
        // it's DFA so there should be one destination state
        const [firstDest] = findDests(dfa.moves, [states[0]], input)
        for (let i = 1; i < states.length; i++) {
          // skip deleted state
          if (states[i] === undefined) continue
          const [dest] = findDests(dfa.moves, [states[i]], input)
          if (findStatePosition(equivalents, dest) !== findStatePosition(equivalents, firstDest)) {
            isDone = false
            if (!equivalents.hasOwnProperty(reservedSymbol)) {
              equivalents[reservedSymbol] = [states[i]]
            } else {
              const arr = equivalents[reservedSymbol]
              arr.push(states[i])
              equivalents[reservedSymbol] = arr
            }
            delete equivalents[key][i]
          }
        }
      }
    }
  }
  if (!isDone) {
    for (let key in equivalents) {
      if (equivalents[key].length > 1) {
        checkEquivalents(dfa, equivalents, reservedSymbol)
      }
    }
  }
  return equivalents
}

/** Return assigned symbol of group of states */
const findStatePosition = (equivalents, state) => {
  for (let key in equivalents) {
    if (equivalents[key].indexOf(state) > -1) {
      return key
    }
  }
}

/**
 * Get moves of minimized DFA based on original DFA
 * @param {NFA} dfa
 * @param {Object} equivalents
 */
const getMoves = (dfa, equivalents) => {
  const moves = {}
  for (let key in equivalents) { // A
    const states = equivalents[key] // [A, B]
    if (isFinal(states[0], dfa.finals)) finalsDFA.push(key)
    for (let input of dfa.alphabet) { // a
      // Finding destination of first state is enough
      let [dest] = findDests(dfa.moves, [states[0]], input)
      // skip if there is no move from state by given input
      if (dest === undefined) continue
      // get assigned name of group of destination
      dest = findStatePosition(equivalents, dest)
      if (!moves.hasOwnProperty(key)) {
        moves[key] = {}
        moves[key][input] = dest
      } else {
        moves[key][input] = dest
      }
    }
  }
  // remove useless states (unreachable) and return
  return removeUseless(dfa, moves)
}

let seenStates = []
let usedStates = []
/** Find unreachable states and remove them */
const removeUseless = (dfa, moves) => {
  seenStates = []
  usedStates = []
  const startState = Object.keys(moves)[0]
  seenStates.push(startState)
  // find reachable states
  findNextState(dfa, moves, startState)

  // remove states that are not in the array of reachable states
  for (let state in moves) {
    if (seenStates.indexOf(state) < 0) {
      delete moves[state]
    }
  }
  return moves
}

/** Find all reachable states */
const findNextState = (dfa, moves, state) => {
  let isSeen = 0
  if (usedStates.indexOf(state) < 0) {
    for (let input of dfa.alphabet) {
      const [dest] = findDests(moves, [state], input)
      if (seenStates.indexOf(dest) < 0) {
        seenStates.push(dest)
        isSeen = 1
      }
    }
    usedStates.push(state)
  }
  if (isSeen) {
    for (let nextState of seenStates) {
      if (usedStates.indexOf(nextState) < 0) {
        findNextState(dfa, moves, nextState)
      }
    }
  }
}

exports.minimizeDFA = minimizeDFA
