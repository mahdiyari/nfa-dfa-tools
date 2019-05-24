const { randomColor } = require('./randomColor')

/** Draw arrow from (sx, sy) to (ex, ey) and print input on the path */
const drawArrow = (ctx, sx, sy, ex, ey, input, type) => {
  let mx = ((sx + ex) / 2)
  let my = ((sy + ey) / 2)
  ctx.beginPath()
  const randColor = randomColor()
  let cx1 = sx
  let cy1 = sy
  let cx2 = ex
  let cy2 = ey
  // Draw curved arrows
  if (type === 'line') {
    ctx.moveTo(sx, sy)
    ctx.strokeStyle = randColor
    const curve = 20
    if (sx === ex && sy < ey) {
      cx1 = sx - curve
      cx2 = ex - curve
    } else if (sx === ex && sy > ey) {
      cx1 = sx + curve
      cx2 = ex + curve
    } else if (sx < 200) {
      cy1 = sy + curve
      cy2 = ey + curve
    } else {
      cy1 = sy - curve
      cy2 = ey - curve
    }
    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, ex, ey)
    ctx.stroke()
  } else {
    // state === dest
    // circle path
    ctx.moveTo(ex, ey)
    ctx.strokeStyle = randColor
    ctx.arc(ex, ey - 10, 10, 0.3 * Math.PI, 3.3 * Math.PI)
    ctx.stroke()
  }
  // find angle and draw arrow heads
  // ctx.fillStyle = 'rgba(55, 217, 56,1)'
  ctx.fillStyle = randColor
  var ang = findAngle(cx2, cy2, ex, ey)
  ctx.fillRect(ex, ey, 2, 2)
  drawArrowhead(ctx, ex, ey, ang, 8, 8)
  // print input on the path
  ctx.globalCompositeOperation = 'source-over'
  ctx.font = '15px Arial'
  ctx.fillStyle = randColor
  if (type === 'line') {
    if (sx === ex && sy < ey) {
      mx = mx - 14
      my = my + 5
    } else if (sx === ex && sy > ey) {
      mx = mx + 4
      my = my + 15
    } else if (sx > 200) {
      mx = mx + 25
      my = my - 12
    } else {
      mx = mx - 25
      my = my + 15
    }
    ctx.fillText(input, mx, my, 50)
  } else {
    ctx.fillText(input, ex - 4, ey - 7, 50)
  }
}

/** Print head of arrows */
const drawArrowhead = (ctx, locx, locy, angle, sizex, sizey) => {
  const hx = sizex / 2
  const hy = sizey / 2
  ctx.translate((locx), (locy))
  ctx.rotate(angle)
  ctx.translate(-hx, -hy)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(0, 1 * sizey)
  ctx.lineTo(1 * sizex, 1 * hy)
  ctx.closePath()
  ctx.fill()
  ctx.translate(hx, hy)
  ctx.rotate(-angle)
  ctx.translate(-locx, -locy)
}

// returns radians
const findAngle = (sx, sy, ex, ey) => {
  // make sx and sy at the zero point
  return Math.atan2((ey - sy), (ex - sx))
}

exports.drawArrow = drawArrow
