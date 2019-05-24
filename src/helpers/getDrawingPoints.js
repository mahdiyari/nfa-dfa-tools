/**
 * Get position (x,y) of n states to draw
 * @param {number} n
 */
const getDrawingPoints = n => {
  const startX = 150
  const startY = 50
  const xSpace = 100
  const ySpace = 70
  const maxX = 400
  const items = []
  items[0] = [startX, startY]
  // one item
  if (n < 2) {
    return [items[0]]
  }
  items[1] = [startX + xSpace, startY]
  // two items
  if (n === 2) {
    return [items[0], items[1]]
  }
  const lastY = n * startY
  items[n - 1] = [n % 2 === 0 ? startX + xSpace : startX, lastY]
  // 3 or 4 items
  if (n <= 4) {
    return [items[0], items[1], [startX, startY + ySpace], [startX + xSpace, startY + ySpace]]
  }
  // 5 or more items
  // split rows
  const rows = Math.ceil(n / 2)
  const split = Math.ceil(rows / 2)
  let index = 0
  for (let i = 0; i < split; i++) {
    const x = startX - (xSpace / 2) * i
    const y = startY + ySpace * i
    items[index] = [x, y]
    items[index + 1] = [maxX - x, y]
    index += 2
  }
  for (let i = split; i < rows; i++) {
    const x = startX - (xSpace / 2) * (rows - i - 1)
    const y = startY + ySpace * i
    items[index] = [x, y]
    items[index + 1] = [maxX - x, y]
    index += 2
  }
  const result = []
  for (let i = 0; i < n; i++) {
    result[i] = items[i]
  }
  return result
}

exports.getDrawingPoints = getDrawingPoints
