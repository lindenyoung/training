/**
 * Inflight entertainment system
 * Return whether there are to numbers in movieLengths whose sum equals flightLength
 * Optimize for runtime over memory
 * @param {number} flightLength 
 * @param {number[]} movieLengths 
 * @returns {boolean}
 */
const canTwoMoviesFillFlight = (flightLength, movieLengths) => {
  const movieMap = {}

  for (const movie of movieLengths) {
    const difference = flightLength - movie

    // if map has this movie length, return true as it's a match to a prev movie
    if (movieMap[movie]) return true
    // add the difference that we are looking for to match this movie length
    else movieMap[difference] = movie
  }

  return false
}

/**
 * Permutation palindrome
 * @param {string} string 
 * @returns {boolean}
 * O(n) time and O(1) space (bc ASCII has just 128 diff chars possible, so can't be more than that)
 */
const hasPalindromePermutation = (string) => {
  const unpairedChars = new Set()

  for (const char of string) {
    // this char has now appeared an even # of times, so remove it
    if (unpairedChars.has(char)) unpairedChars.delete(char)
    // add curr char if it doesn't exist (currently appearing an odd # of times)
    else (unpairedChars.add(char))
  }

  return unpairedChars.size <= 1
}
