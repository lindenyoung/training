// day after redo

// best time to buy and sell stock
// [5, 8, 4, 2, 3, 7, 9, 6] -> 7 (9 - 2)
// sliding window approach
const stocksss = (prices) => {
  let [left, right, maxProfit] = [0, 1, 0]

  while (right < prices.length) {
    if (prices[left] > prices[right]) left = right

    maxProfit = Math.max(maxProfit, prices[right] - prices[left])
    right++
  }

  return maxProfit
}


// length of longest non-repeating substring
const longestSubstring = (s) => {
  if (s.length < 2) return s.length

  const set = new Set()
  let l = 0,
      max = 0

  for (let r = 0; r < s.length; r++) {
    if (set.has(s[r])) {
      set.delete(s[l])
      l++
    }

    set.add(s[r])
    max = Math.max(max, set.size)
  }

  return max
}
