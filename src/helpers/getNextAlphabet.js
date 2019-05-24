let alphabetIndex = 0

/** Returns alphabet in a row
 * first A, then B, then... and so on until Z
 * @param {boolean} reset
 */
const getNextAlphabet = (reset) => {
  if (reset) alphabetIndex = 0
  if (alphabetIndex > 26) {
    throw Error('max number of allowed states is 26')
  }
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  return alphabet[alphabetIndex++]
}

exports.getNextAlphabet = getNextAlphabet
