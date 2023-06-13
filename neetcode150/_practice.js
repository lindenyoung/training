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

// "abcabcbb" -> 3 'abc'
const substring = (s) => {
  if (s.length < 2) return s.length

  const charSet = new Set()
  let [left, right, maxLength] = [0, 0, 0]

  while(right < s.length) {
    if (charSet.has(s[right])) {
      charSet.delete(s[left])
      left++
    }

    charSet.add(s[right])
    maxLength = Math.max(maxLength, charSet.size)
    right++
  }

  return maxLength
}

const parensss = (s) => {
  // want to use a stack, time and space comp will be linear

  const stack = [] // could also make this a default param
  const closeOpenMap = {
    ')': '(',
    '}': '{',
    ']': '[',
  }

  for (const char of s) {
    // if curr char is opening paren, push to stack
    if (!(char in closeOpenMap)) {
      stack.push(char)
      continue
    }

    // curr char is closing paren, so check for match
    if (stack.length && stack[stack.length - 1] === closeOpenMap[char]) {
      stack.pop()
      continue
    }

    return false
  }

  return stack.length === 0
}
