const { NFA } = require('./helpers/NFA')
const { convertToDFA } = require('./convertToDFA')
const { smoothScroll } = require('./helpers/smoothScroll')
const { minimizeDFA } = require('./minimizeDFA')

/** Get user inputs and convert NFA to DFA */
const convert = () => {
  document.getElementById('nfa-canvas-div').style.display = 'block'
  document.getElementById('dfa-conv-canvas-div').style.display = 'block'
  clearCanvas()
  const { start, finals, moves, alphabet } = getUserInput('nfa')
  const nfa = new NFA(start, finals, moves, alphabet)
  nfa.draw('canvas-nfa')
  const dfa = convertToDFA(nfa)
  dfa.draw('canvas-conv-dfa')
  printOutput(dfa, 'conv-dfa')
  smoothScroll('output-conv-dfa')
}

/** Draw input NFA/DFA without converting */
const drawNFA = id => {
  document.getElementById(id + '-canvas-div').style.display = 'block'
  clearCanvas()
  const { start, finals, moves, alphabet } = getUserInput(id)
  const nfa = new NFA(start, finals, moves, alphabet)
  nfa.draw('canvas-' + id)
  smoothScroll('canvas-' + id)
}

/** Minimize DFA and draw */
const minimize = () => {
  document.getElementById('dfa-canvas-div').style.display = 'block'
  document.getElementById('dfa-min-canvas-div').style.display = 'block'
  clearCanvas()
  const { start, finals, moves, alphabet } = getUserInput('dfa')
  const dfa = new NFA(start, finals, moves, alphabet)
  dfa.draw('canvas-dfa')
  const minDFA = minimizeDFA(dfa)
  minDFA.draw('canvas-min-dfa')
  printOutput(minDFA, 'min-dfa')
  smoothScroll('output-min-dfa')
}

/** print output of converted or minimized dfa */
const printOutput = (dfa, id) => {
  document.getElementById('output-' + id).style.display = 'block'
  document.getElementById('first-' + id).innerHTML = '<code>' + dfa.start + '</code>'
  document.getElementById('finals-' + id).innerHTML = '<code>' + dfa.finals + '</code>'
  document.getElementById('moves-' + id).innerHTML = '<code>' + JSON.stringify(dfa.moves, undefined, 2) + '</code>'
}

/** Clear drawings */
const clearCanvas = () => {
  const ctx1 = document.getElementById('canvas-nfa').getContext('2d')
  const ctx2 = document.getElementById('canvas-conv-dfa').getContext('2d')
  const ctx3 = document.getElementById('canvas-dfa').getContext('2d')
  const ctx4 = document.getElementById('canvas-min-dfa').getContext('2d')
  ctx1.clearRect(0, 0, ctx1.canvas.width, ctx1.canvas.height)
  ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height)
  ctx3.clearRect(0, 0, ctx3.canvas.width, ctx3.canvas.height)
  ctx4.clearRect(0, 0, ctx4.canvas.width, ctx4.canvas.height)
}

/** Get user NFA input from app form */
const getUserInput = (id) => {
  const start = document.getElementById('start-' + id + '-state').value.split(/[ ,]+/)
  const finals = document.getElementById('final-' + id + '-states').value.split(/[ ,]+/)
  const alphabet = document.getElementById('alphabet-' + id).value.split(/[ ,]+/)
  const moves = readMoves('{' + document.getElementById('moves-' + id).value + '}')
  return { start, finals, alphabet, moves }
}

/** Parse moves from user input as JSON */
const readMoves = moves => {
  let ext = 0
  let org = moves.split('')
  let res = []
  // escape characters
  for (let i = 0; i < moves.length; i++) {
    let p = ext + i
    if (org[i] === "'") org[i] = '"'
    if (org[i].match(/\w/)) {
      if (org[i - 1] !== '"') {
        if (!org[i - 1].match(/\w/)) {
          res[p++] = '"'
          res[p++] = org[i]
          ext += 1
        } else {
          res[p++] = org[i]
        }
        if (!org[i + 1].match(/\w/)) {
          res[p++] = '"'
          ext += 1
        }
      } else {
        res[p++] = moves[i]
      }
    } else if (org[i] === ' ') {
      ext -= 1
      continue
    } else {
      res[p++] = moves[i]
    }
  }
  return JSON.parse(res.join(''))
}

/** Add example move */
const addMove = id => {
  const moves = document.getElementById('moves-' + id)
  const newMove = ',\nState1: { input1: [State2], input2: [State3] }'
  moves.value += newMove
}

exports = { addMove, convert, drawNFA, minimize }
