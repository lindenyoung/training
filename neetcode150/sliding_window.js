/**
 * Best time to buy and sell stock
 * O(n) | O(1) using sliding window
 * [7, 3, 5, 1, 6, 4] -> 5 (6 - 1) 
 * @param {*} prices 
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
 * @param {*} s 
 */
const lengthOfLongestSubstring = (s) => {
  if (s.length < 2) return s.length

  const charSet = new Set()
  let [left, max] = [0, 0]

  for (let right = 0; right < s.length; right++) {
    // if curr char is a repeat of curr set / window, delete left instance of char and increment left pointer
    while (charSet.has(s[right])) {
      charSet.delete(s[left])
      left++
    }

    // if curr char is not a repeat, add to set and reassign max
    charSet.add(s[right])
    max = Math.max(max, charSet.size)
  }

  return max
}
