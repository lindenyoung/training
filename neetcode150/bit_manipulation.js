/**
 * 191: Number of 1 Bits
 * @param {number} n 
 * @returns {number}
 */
const hammingWeight = (n) => {
  let count = 0

  while (n) {
    if (n & 1) count++ // bit comparison (and operation) - is rightmost bit of n set to 1
    n >>>= 1
  }

  return count
}
