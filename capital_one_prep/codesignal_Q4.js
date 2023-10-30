/**
 * Longest consecutive sequence - leetcode 128
 * Constraint = solution must run in linear time
 * Input: nums = [100,4,200,1,3,2]
 * Output: 4
 * Explanation: The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.
 * @param {number[]} nums 
 * @returns {number}
 * O(n) time and O(n) space
 */
const longestConsecutive = (nums) => {
  if (!nums || nums.length === 0) return 0

  const set = new Set(nums) // remove duplicates
  let result = 0

  for (const num of set) {
    // skip nums we will later count
    // want to start counting from smallest num in sequence
    if (set.has(num - 1)) continue

    let currNum = num,
        count = 1 // initialize to 1

    while (set.has(currNum + 1)) {
      count++
      currNum++
    }

    result = Math.max(result, count)
  }

  return result
}

/**
 * Pairs of songs with total durations divisible by 60 - leetcode 1010
 * @param {number[]} time 
 * @returns {number}
 */
const numPairsDivisibleBy60 = (times) => {
  const map = {}
  let result = 0

  for (const time of times) {
    const remainder = time % 60
    const left = (60 - remainder) % 60
    result += map[left] || 0
    map[remainder] = (map[remainder] || 0) + 1
  }
  
  return result
}
