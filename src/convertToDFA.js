const { NFA } = require('./helpers/NFA')
const { getNextAlphabet } = require('./helpers/getNextAlphabet')
const { eClosure } = require('./helpers/epsilonClosure')
const { findDests } = require('./helpers/findDests')
const { isFinal } = require('./helpers/isFinal')

// Keep moves and states of converted DFA in object
let movesDFA = {}
let statesDFA = {}
let finalsDFA = []

/**
 * Convert NFA to DFA by epsilon-closure
 * @param {NFA} nfa
 */
const convertToDFA = nfa => {
  movesDFA = {}
  statesDFA = {}
  finalsDFA = []
  const startState = nfa.start
  // get epsilon-closure of first state
  const eClosureStart = eClosure(nfa, [startState], true)
  // asign a name (A, B, C, ...) to array of states
  const symbol = getNextAlphabet(true) // A
  statesDFA[eClosureStart] = symbol
  // get states of converted DFA
  getStatesDFA(nfa, eClosureStart, symbol)
  // create a DFA with converted states and moves
  const dfa = new NFA(symbol, finalsDFA, movesDFA, nfa.alphabet)
  return dfa
}

/**
 * Get states of converted DFA based on epsilon-closures of first state
 * Then get rest of states with recursion
 * @param {NFA} nfa
 * @param {array} states
 * @param {string} symbol
*/
const getStatesDFA = (nfa, states, symbol) => {
  // if array of states includes a final state
  // then mark the array of states as final state
  if (isFinal(states, nfa.finals)) {
    finalsDFA.push(symbol)
  }
  for (let input of nfa.alphabet) {
    const dests = findDests(nfa.moves, states, input)
    const destsClosure = eClosure(nfa, dests)

    // This line removes trap or useless state
    if (!destsClosure.length) continue

    if (!statesDFA.hasOwnProperty(destsClosure)) {
      // get new alphabet
      const destSymbol = getNextAlphabet()
      if (!movesDFA[symbol]) {
        movesDFA[symbol] = {}
      }
      movesDFA[symbol][input] = destSymbol
      statesDFA[destsClosure] = destSymbol
      getStatesDFA(nfa, destsClosure, destSymbol)
    } else {
      const destSymbol = statesDFA[destsClosure]
      if (!movesDFA[symbol]) {
        movesDFA[symbol] = {}
      }
      movesDFA[symbol][input] = destSymbol
    }
  }
}

exports.convertToDFA = convertToDFA
