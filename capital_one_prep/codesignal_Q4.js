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
 * Input: time = [30,20,150,100,40]
 * Output: 3
 * Explanation: Three pairs have a total duration divisible by 60:
 * (time[0] = 30, time[2] = 150): total duration 180
 * (time[1] = 20, time[3] = 100): total duration 120
 * (time[1] = 20, time[4] = 40): total duration 60
 * @param {number[]} time 
 * @returns {number}
 * O(n) time and O(n) space
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


/**
 * 4 sum II - leetcode 454
 * @param {number[]} nums1 
 * @param {number[]} nums2 
 * @param {number[]} nums3 
 * @param {number[]} nums4 
 * @returns {number}
 */
const fourSumCount = (nums1, nums2, nums3, nums4) => {}

/**
 * Longest palindrome by concatenating two letter words - leetcode 2131
 * Input: words = ["lc","cl","gg"]
 * Output: 6
 * Explanation: One longest palindrome is "lc" + "gg" + "cl" = "lcggcl", of length 6.
 * Note that "clgglc" is another longest palindrome that can be created.
 * @param {string[]} words 
 * @returns {number}
 * O(n) time and O(n) space
 */
const longestPalindrome = (words) => {
  const map = {}
  let count = 0

  for (const word of words) {
    const reversed = word[1] + word[0] // don't need a reverse function since they are just 2 char strings

    if (map[reversed]) {
      map[reversed]--
      count += 4 // found matching pair, both strings together = 4 chars
    } else map[word] = (map[word] || 0) + 1
  }

  // check for words that are palindromes themselves - 'aa', 'gg', since they don't need a reversed pair to match
  const hasMorePalindromes = Object.keys(map).filter(key => map[key] && (key[1] + key[0]) === key) // map[key] is checking for non zero property value (frequency)
  if (hasMorePalindromes.length) count += 2 // can always add one of these single word palindromes to total count
  return count
}

/**
 * Array of doubled pairs - leetcode 954
 * Better description of problem - Could we find a pair for each number in the array, so one element of the pair is twice bigger than other?
 * Input: arr = [4,-2,2,-4]
 * Output: true
 * Explanation: We can take two groups, [-2,-4] and [2,4] to form [-2,-4,2,4] or [2,4,-2,-4].
 * @param {number[]} arr 
 * @returns {boolean}
 * O(n logn) time and O(n) space
 */
const canReorderDoubled = (arr) => {
  arr.sort((a, b) => a - b)
  const map = {}

  // populate frequency map
  for (const num of arr) {
    map[num] = (map[num] || 0) + 1
  }

  for (const num of arr) {
    // need this bc we delete both num and pair props from map after finding pair
    if (!map[num]) continue

    // handle positive / negative nums differently
    const pair = num >= 0 ? num * 2 : num / 2

    // false case, if we find a num without a pair
    if (!map[pair]) return false

    for (const k of [num, pair]) {
      if (--map[k] === 0) delete map[k]
    }
  }

  return true
}

[-4, -2, 2, 4]

/**
 * 3 sum with multiplicity
 * @param {number[]} arr
 * @param {number} target 
 * @returns {number}
 */
const threeSumMulti = (arr, target) => {}

/**
 * Count number of nice subarrays - leetcode 1248
 * @param {number[]} nums 
 * @param {number} k 
 * @returns {number}
 */
const numberOfSubarrays = (nums, k) => {}

/**
 * K-diff pairs in an array - leetcode 532
 * @param {number[]} nums 
 * @param {number} k 
 * @returns {number}
 */
const findPairs = (nums, k) => {}
