/**
 * Return true if one final state is in the array of given states
 * @param {array} states
 * @param {array} finals
 */
const isFinal = (states, finals) => {
  for (const final of finals) {
    if (states.indexOf(final) > -1) {
      return true
    }
  }
  return false
}
exports.isFinal = isFinal
