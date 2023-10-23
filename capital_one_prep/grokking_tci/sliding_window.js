/**
 * Find average of each subarray of 'k' contiguous elements
 * @param {number[]} nums 
 * @param {number} k 
 * @returns {number[]}
 * O(n) time and O(n) space
 */
const averagesOfSubarrays = (nums, k) => {
  const result = []

  let sum = 0,
      start = 0

  for (let end = 0; end < nums.length; end++) {
    sum += nums[end]

    // slide window - if we've hit the right size window to start sliding
    if (end >= k - 1) {
      result.push(sum / k)

      sum -= nums[start]
      start++
    }
  }

  return result
}

/**
 * Max subarray
 * Input: nums = [2, 1, 5, 1, 3, 2], k = 3 
 * Output: 9
 * Explanation: Subarray with maximum sum is [5, 1, 3].
 * @param {number[]} nums 
 * @param {number} k 
 * @returns {number}
 * O(n) time and O(1) space
 */
const maxSubarray = (nums, k) => {
  let maxSum = 0,
      sum = 0,
      start = 0
      
  for (let end = 0; end < nums.length; end++) {
    sum += nums[end]

    // slide window - if we've hit the right size window
    if (end >= k - 1) {
      maxSum = Math.max(maxSum, sum)
      sum -= nums[start]
      start++
    }
  }
  
  return maxSum
}

/**
 * Smallest subarray with a sum >= than s
 * Input: nums = [2, 1, 5, 2, 3, 2], s = 7
 * Output: 2
 * Explanation: The smallest subarray's length with a sum greater than or equal to '7' is [5, 2].
 * @param {number[]} nums 
 * @param {number} s 
 * @returns {number}
 * O(n) time and O(1) space
 */
const findSmallestSubarray = (nums, s) => {
  let minLength = Infinity,
      sum = 0,
      start = 0

  for (let end = 0; end < nums.length; end++) {
    sum += nums[end]

    // shrink window as small as we can until sum is smaller than s
    while (sum >= s) {
      minLength = Math.min(minLength, end - start + 1)
      sum -= nums[start]
      start++
    }
  }

  return minLength !== Infinity ? minLength : 0
}

/**
 * Longest substring with k distinct characters - leetcode 340
 * Input: str = "araaci", k = 2  
 * Output: 4  
 * Explanation: The longest substring with no more than '2' distinct characters is "araa".
 * @param {string} str 
 * @param {number} k
 * O(n) time and O(k) space (storing maximum of k + 1 chars in the hash map)
 */
const longestSubstring = (str, k) => {
  const charMap = {}
  let maxLength = 0,
      start = 0

  for (let end = 0; end < str.length; end++) {
    const rightChar = str[end]
    charMap[rightChar] = (charMap[rightChar] || 0) + 1

    // shrink window until we have k distinct chars
    while (Object.keys(charMap).length > k) {
      const leftChar = str[start]
      if (--charMap[leftChar] === 0) delete charMap[leftChar]
      start++
    }

    maxLength = Math.max(maxLength, end - start + 1)
  }

  return maxLength
}

/**
 * Fruits into baskets - leetcode 904
  * Each basket can have only one type of fruit. There is no limit to how many fruit a basket can hold.
  * You can start with any tree, but you can’t skip a tree once you have started.
  * You will pick exactly one fruit from every tree until you cannot, i.e., you will stop when you have to pick from a third fruit type.
 * Input: fruits = ['A', 'B', 'C', 'A', 'C'] 
 * Output: 3  
 * Explanation: We can put 2 'C' in one basket and one 'A' in the other from the subarray ['C', 'A', 'C']
 * @param {string[]} fruits 
 * @returns {number}
 * O(n) time and O(1) space
 */
const fruitsIntoBaskets = (fruits) => {
  const fruitMap = {} // store fruit frequencies
  let maxLength = 0,
      start = 0

  for (let end = 0; end < fruits.length; end++) {
    const rightFruit = fruits[end]
    fruitMap[rightFruit] = (fruitMap[rightFruit] || 0) + 1 // increment curr fruit count

    // shrink window until we only have 2 fruits
    while (Object.keys(fruitMap).length > 2) {
      const leftFruit = fruits[start]
      if (--fruitMap[leftFruit] === 0) delete fruitMap[leftFruit]
      start++
    }

    maxLength = Math.max(maxLength, end - start + 1)
  }

  return maxLength
}

/**
 * Longest substring after char replacement - leetcode 424
 * Input: str = "AABABBA", k = 1
 * Output: 4
 * Explanation: Replace the one 'A' in the middle with 'B' and form "AABBBBA".
 * @param {string} str 
 * @param {number} k 
 * @returns {number}
 * O(n) time and O(1) space (hash map will at most have 26 properties)
 */
const characterReplacement = (str, k) => {
  const charMap = {}
  let maxCount = 0, // max # of swaps (the count of the max repeating letter in any window)
      start = 0,
      end

  for (end = 0; end < str.length; end++) {
    const rightChar = str[end]
    charMap[rightChar] = (charMap[rightChar] || 0) + 1
    maxCount = Math.max(maxCount, charMap[rightChar])

    // shrink window if window length - # of swaps is > k
    if (end - start + 1 - maxCount > k) {
      const leftChar = str[start]
      charMap[leftChar]--
      start++
    }
  }

  return end - start // why not + 1 here?
}

/**
 * Longest subarray with ones after replacement
 * @param {number[]} nums 
 * @param {number} k 
 * @returns {number}
 */
const longest1sReplacement = (nums, k) => {
  let maxLength = 0,
      start = 0,
      maxOnesCount = 0

  for (let end = 0; end < nums.length; end++) {
    if (nums[end] === 1) maxOnesCount++

    // shrink window condition
    if (end - start + 1 - maxOnesCount > k) { // this equals the # of 0's replaced in curr window
      if (nums[start] === 1) maxOnesCount--
      start++
    }

    maxLength = Math.max(maxLength, end - start + 1)
  }

  return maxLength
}

/**
 * Permutation in string - leetcode 567
 * Return true if str contains any permutation of pattern
 * Input: str = "oidbcaf", pattern = "abc"   
 * Output: true   
 * Explanation: The string contains "bca" which is a permutation of the given pattern.
 * @param {string} str 
 * @param {string} pattern 
 * @returns {boolean}
 * O(n+m) time and O(m) space
 */
const permutationInString = (str, pattern) => {
  const charMap = {}
  let matched = 0,
      start = 0

  // create map of pattern char frequencies
  for (let i = 0; i < pattern.length; i++) {
    charMap[pattern[i]] = (charMap[pattern[i]] || 0) + 1
  }

  for (let end = 0; end < str.length; end++) {
    const rightChar = str[end]
    
    // decrement freq of matched char
    if (rightChar in charMap) {
      charMap[rightChar]--
      if (charMap[rightChar] === 0) matched++
    }

    // true condition - # of matched chars is equal to # of unique chars in pattern
    if (matched === Object.keys(charMap).length) return true

    // shrink window if too large
    if (end >= pattern.length - 1) { // >= bc end is an index value
      const leftChar = str[start]
      start++

      if (leftChar in charMap) {
        if (charMap[leftChar] === 0) matched--
        charMap[leftChar]++
      }
    }
  }

  return false
}

/**
 * Find all anagrams in a string - leetcode 438
 * @param {string} str 
 * @param {string} pattern 
 * @returns {number[]}
 */
const stringAnagrams = (str, pattern) => {

}
