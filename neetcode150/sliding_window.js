/**
 * Best time to buy and sell stock
 * O(n) | O(1) using sliding window
 * [7, 3, 5, 1, 6, 4] -> 5 (6 - 1) 
 * @param {number[]} prices
 * @return {number}
 */

const maxProfit1 = (prices) => {
  let [left, right, max] = [0, 1, 0];

  while (right < prices.length) {
    // reassign left pointer (curr min index) to right pointer if left price is higher than right price
    if (prices[left] > prices[right]) left = right;
    const currProfit = prices[right] - prices[left];
    max = Math.max(currProfit, max);
    right++;
  }

  return max;
}

// runtime on leetcode is a bit slower for this solution
const maxProfit2 = (prices) => {
  let max = 0;
  let minSoFar = prices[0];

  for (let i = 1; i < prices.length; i++) {
    minSoFar = Math.min(prices[i], minSoFar);
    max = Math.max(prices[i] - minSoFar, max);
  }

  return max;
}

/**
 * Longest substring without repeating characters
 * O(n) | O(n)
 * "abcabcbb" -> 3 ("abc")
 * @param {string} s 
 * @return {number}
 */

const lengthOfLongestSubstring = (s) => {
  if (s.length < 2) return s.length

  const charSet = new Set()
  let left = 0,
      right = 0,
      maxLength = 0

  while(right < s.length) {
    // if curr char is a repeat of curr set / window, delete left instance of char and increment left window pointer
    if (charSet.has(s[right])) {
      charSet.delete(s[left])
      left++
    }
    
    // add curr char to set, reassign max, and increment right window pointer
    charSet.add(s[right])
    maxLength = Math.max(maxLength, charSet.size)
    right++
  }

  return maxLength
}

/**
 * Longest repeating character replacement
 * s = "AABABBA", k = 1 -> 4 ("BBBB")
 * @param {string} s 
 * @param {number} k
 * @return {number}
 */

const characterReplacement = (s, k) => {
  if (s.length <= k) return s.length // edge case

  const charMap = {}
  let left = 0,
      right,
      maxCount = 0

  for (right = 0; right < s.length; right++) {
    // update map
    charMap[s[right]] = (charMap[s[right]] || 0) + 1

    // reassign maxCount
    maxCount = Math.max(maxCount, charMap[s[right]])

    const windowSize = right - left + 1 // curr window size
    const tooManySwaps = (windowSize - maxCount) > k // windowSize - maxCount = # of swaps in curr window
    if (tooManySwaps) {
      charMap[s[left]]--
      left++
    }
  }

  return right - left; // returns correct window size, not necessarily the correct window indexes though
}

/**
 * Permutation in string (does s2 contain a permutation of s1)
 * s1 = "ab", s2 = "eidbaooo" -> true ("ba" is permutation of s1)
 * s1 = "ab", s2 = "eidboaoo" -> false("ba" is not permutation of s1)
 * @param {string} s1 
 * @param {string} s2 
 * @return {boolean}
 */

const checkInclusion = (s1, s2) => {
  if (s1.length > s2.length || s1.length === 0 || s2.length === 0) return false // edge cases

  const neededCharMap = {} // frequency map of required chars

  // fill map of required chars from s1
  for (let i = 0; i < s1.length; i++) {
    neededCharMap[s1[i]] = (neededCharMap[s1[i]] || 0) + 1
  }

  let left = 0,
      right = 0,
      requiredLength = s1.length

  while (right < s2.length) {
    // if curr right char is a neededChar, decrement req length
    if (neededCharMap[s2[right]] > 0) requiredLength--
    neededCharMap[s2[right]]-- // decrement char frequency in map
    right++ // move right window

    if (requiredLength === 0) return true // true condition

  
    // if window is correct size, adjust window
    if (right - left === s1.length) {
      if (neededCharMap[s2[left]] >= 0) requiredLength++ // increment req length if left char was req char
      neededCharMap[s2[left]]++ // increment count since removed from curr window
      left++ // move left window
    }  
  }

  return false
}

/**
 * Minimum window substring
 * s = "ADOBECODEBANC", t = "ABC" -> "BANC"
 * s = "a", t = "aa" -> ""
 * @param {string} s 
 * @param {string} t 
 * @return {string}
 */

const minWindow = (s, t) => {
  // edge cases
  if (!s.length || !t.length || t.length > s.length) return ''

  // t frequency map
  const neededCharMap = {}
  for (let char of t) {
    neededCharMap[char] = (neededCharMap[char] || 0) + 1
  }

  let left = 0,
      right = 0,
      neededLength = Object.keys(neededCharMap).length
      substring = ''

      // move right window through s
      while (right < s.length) {
        const rightChar = s[right]
        neededCharMap[rightChar]--
        if (neededCharMap[rightChar] === 0) neededLength--

        // shorten window from the left to get curr min window
        while (neededLength === 0) {
          // currWindowSize = right - left + 1
          if (!substring || substring.length > (right - left + 1)) {
            substring = s.slice(left, right + 1)
          }

          const leftChar = s[left]
          if (neededCharMap[leftChar] === 0) neededLength++
          neededCharMap[leftChar]++
          left++
        }

        right++
      }

    return substring
}
