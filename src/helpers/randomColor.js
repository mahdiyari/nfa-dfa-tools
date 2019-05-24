/** Return random color (range: #000000 ~ #999999) */
const randomColor = () => {
  return ('#' + Math.floor(Math.random() * 10066329).toString(16))
}
exports.randomColor = randomColor
