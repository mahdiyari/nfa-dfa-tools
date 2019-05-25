const { NFA } = require('./helpers/NFA')
const { convertToDFA } = require('./convertToDFA')
const { smoothScroll } = require('./helpers/smoothScroll')
const { minimizeDFA } = require('./minimizeDFA')
const { testDFA } = require('./helpers/testDFA')
const { readFileSync, writeFileSync } = require('fs')
const { dialog, getCurrentWindow } = require('electron').remote

/** Get user inputs and convert NFA to DFA */
const convert = () => {
  document.getElementById('nfa-canvas-div').style.display = 'block'
  document.getElementById('dfa-conv-canvas-div').style.display = 'block'
  clearCanvas('nfa')
  const { start, finals, moves, alphabet } = getUserInput('nfa')
  const nfa = new NFA(start, finals, moves, alphabet)
  nfa.draw('canvas-nfa')
  const dfa = convertToDFA(nfa)
  dfa.draw('canvas-conv-dfa')
  printOutput(dfa, 'conv-dfa')
  smoothScroll('output-conv-dfa')
  saveOut(0, 'dfa', dfa)
}

/** Draw input NFA/DFA without converting */
const drawNFA = id => {
  document.getElementById(id + '-canvas-div').style.display = 'block'
  clearCanvas('nfa')
  const { start, finals, moves, alphabet } = getUserInput(id)
  const nfa = new NFA(start, finals, moves, alphabet)
  nfa.draw('canvas-' + id)
  smoothScroll('canvas-' + id)
}

/** Minimize DFA and draw */
const minimize = () => {
  document.getElementById('dfa-canvas-div').style.display = 'block'
  document.getElementById('dfa-min-canvas-div').style.display = 'block'
  clearCanvas('dfa')
  const { start, finals, moves, alphabet } = getUserInput('dfa')
  const dfa = new NFA(start, finals, moves, alphabet)
  dfa.draw('canvas-dfa')
  const minDFA = minimizeDFA(dfa)
  minDFA.draw('canvas-min-dfa')
  printOutput(minDFA, 'min-dfa')
  smoothScroll('output-min-dfa')
  saveOut(0, 'dfa-min', dfa)
}

/** Test DFA with input string */
const checkDFA = () => {
  document.getElementById('dfa-check-canvas-div').style.display = 'block'
  document.getElementById('output-dfa-check-div').style.display = 'block'
  clearCanvas('dfa-check')
  const { start, finals, moves, alphabet } = getUserInput('dfa-check')
  const dfa = new NFA(start, finals, moves, alphabet)
  const string = document.getElementById('input-dfa-check-string').value
  dfa.draw('canvas-dfa-check')
  smoothScroll('canvas-dfa-check')
  const result = testDFA(dfa, string)
  document.getElementById('out-dfa-check-string').innerHTML = string
  document.getElementById('out-dfa-check-result').innerHTML = result ? 'ACCEPTED' : 'REJECTED'
}

/** Save input NFA/DFA as json file */
const save = id => {
  const start = document.getElementById('start-' + id + '-state').value
  const finals = document.getElementById('final-' + id + '-states').value
  const alphabet = document.getElementById('alphabet-' + id).value
  const moves = document.getElementById('moves-' + id).value
  const data = { start, finals, alphabet, moves }
  const savePath = dialog.showSaveDialog(getCurrentWindow(), {
    defaultPath: 'input-' + id + '.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  })
  if (!savePath) return
  writeFileSync(savePath, JSON.stringify(data, undefined, 2))
}

/** Load input NFA/DFA from json file */
const load = id => {
  const loadPath = dialog.showOpenDialog(getCurrentWindow(), {
    defaultPath: 'input-' + id + '.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  })
  if (!loadPath) return
  const { start, finals, alphabet, moves } = JSON.parse(readFileSync(loadPath[0]))
  document.getElementById('start-' + id + '-state').value = start
  document.getElementById('final-' + id + '-states').value = finals
  document.getElementById('alphabet-' + id).value = alphabet
  document.getElementById('moves-' + id).value = moves
}

const helpSaveOut = {}
/** Save output DFA as json file which can be loaded */
const saveOut = (save, id, dfa) => {
  if (!save) {
    helpSaveOut[id] = { dfa }
    return
  }
  dfa = helpSaveOut[id].dfa
  const start = dfa.start
  const finals = dfa.finals.join()
  const alphabet = dfa.alphabet.join()
  let moves = JSON.stringify(dfa.moves)
  moves = moves.replace(/"/g, '')
  moves = moves.slice(1, moves.length - 1)
  const data = { start, finals, alphabet, moves }
  const savePath = dialog.showSaveDialog(getCurrentWindow(), {
    defaultPath: 'output-' + id + '.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  })
  if (!savePath) return
  writeFileSync(savePath, JSON.stringify(data, undefined, 2))
}

/** print output of converted or minimized dfa */
const printOutput = (dfa, id) => {
  document.getElementById('output-' + id).style.display = 'block'
  document.getElementById('first-' + id).innerHTML = '<code>' + dfa.start + '</code>'
  document.getElementById('finals-' + id).innerHTML = '<code>' + dfa.finals + '</code>'
  document.getElementById('moves-' + id).innerHTML = '<code>' + JSON.stringify(dfa.moves, undefined, 2) + '</code>'
}

/** Clear drawings */
const clearCanvas = id => {
  if (id === 'nfa') {
    clearCanvas('conv-dfa')
  } else if (id === 'dfa') {
    clearCanvas('min-dfa')
  }
  const ctx1 = document.getElementById('canvas-' + id).getContext('2d')
  ctx1.clearRect(0, 0, ctx1.canvas.width, ctx1.canvas.height)
}

/** Get user NFA input from app form */
const getUserInput = (id) => {
  const start = document.getElementById('start-' + id + '-state').value
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

exports = { addMove, convert, drawNFA, minimize, checkDFA, save, load, saveOut }
