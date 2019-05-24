const { drawArrow } = require('./drawArrow')
const { getDrawingPoints } = require('./getDrawingPoints')
/**
 * Creating NFA and DFA
 */
class NFA {
  constructor (start, finals, moves, alphabet) {
    this.start = start
    this.finals = finals
    this.alphabet = alphabet
    this.moves = moves
    this.lambda = 'λ'
    this.states = []
    this.paths = {}
    this.init()
    this.setPaths()
  }
  init () {
    // Find all states
    for (const i in this.moves) {
      if (this.states.indexOf(i) < 0) {
        this.states.push(i)
      }
      for (const j in this.moves[i]) {
        for (const k in this.moves[i][j]) {
          if (this.states.indexOf(this.moves[i][j][k]) < 0) {
            this.states.push(this.moves[i][j][k])
          }
        }
      }
    }
  }
  setPaths () {
    // Find all paths
    for (const state of this.states) { // state = A
      for (let input in this.moves[state]) { // input = a
        for (const dest of this.moves[state][input]) { // dest = D
          let input1 = []
          if (input === '') {
            input1.push(this.lambda)
          } else {
            input1.push(input)
          }
          if (this.paths.hasOwnProperty(state)) {
            if (this.paths[state].hasOwnProperty(dest)) {
              input1.push(this.paths[state][dest]['input'][0])
            }
          }
          let type = 'line'
          if (state === dest) {
            type = 'circle'
          }
          if (!this.paths[state]) {
            this.paths[state] = {}
          }
          this.paths[state][dest] = { input: input1, type }
        }
      }
    }
  }
  /** Printing NFA */
  draw (id) {
    const ctx = document.getElementById(id).getContext('2d')
    // number of total states
    const n = this.states.length
    // get position (x,y) of each state
    const points = getDrawingPoints(n)
    // draw each state with paths
    for (let i = 0; i < n; i++) {
      const state = this.states[i]
      const path = this.paths[state]
      let final = false
      if (this.finals.indexOf(state) > -1) {
        final = true
      }
      // Input shown on the arrows
      let input = ''
      for (let dest in path) {
        let inputLenth = path[dest].input.length
        if (inputLenth > 1) {
          for (let j = 0; j < inputLenth; j++) {
            input += path[dest].input[j]
            if (j !== inputLenth - 1) {
              input += ','
            }
          }
        } else {
          input = path[dest].input[0]
        }
        // type of arrow
        const type = path[dest].type
        // Drawing arrows to destination
        const destIndex = this.states.indexOf(dest)
        drawArrow(ctx, points[i][0], points[i][1] + 0, points[destIndex][0], points[destIndex][1] - 15, input, type)
      }
      // drawing states
      ctx.beginPath()
      // print circles behind anything
      ctx.globalCompositeOperation = 'destination-over'
      ctx.strokeStyle = 'black'
      ctx.arc(points[i][0], points[i][1], 15, 0, 2 * Math.PI)
      ctx.stroke()
      // Two arc for final states
      if (final) {
        ctx.arc(points[i][0], points[i][1], 12, 0, 2 * Math.PI)
        ctx.stroke()
      }
      ctx.font = '15px Arial'
      ctx.fillStyle = 'black'
      // print text over anything
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillText(this.states[i], points[i][0] - 5, points[i][1] + 5, 50)
      ctx.closePath()
    }
  }
}

exports.NFA = NFA
