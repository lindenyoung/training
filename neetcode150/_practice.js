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

// tokens = ["2", "1", "+", "3", "*"] -> 9 ((2 + 1) * 3)
const reversePolishNotation = (tokens) => {
  const operatorsMap = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => ~~(a/b), // basically Math.floor or Math.trunc
  }

  // iterate over tokens
  for (const token of tokens) {
    // if curr token is an operator, perform logic
    if (token in operatorsMap) {
      const [right, left] = [stack.pop(), stack.pop()]
      const operation = operatorsMap[token]
      stack.push(operation(left, right))
    }
    // otherwise, push curr token to stack as a number
    stack.push(Number(token))
  }

  return stack.pop() // will only be one element in stack
}

const dailyTemps = (temps) => {
  const stack = []
  const result = Array(temps.length).fill(0)

  for (let i = 0; i < temps.length; i++) {
    // update result whenever curr temp is higher than a prev temp
    while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {
      const topStackIndex = stack.pop()
      result[topStackIndex] = i - topStackIndex
    }
    // push the curr index to stack
    stack.push(i)
  }

  return result
}

const twoDMatrix = (matrix, target) => {
  const [rows, cols] = [matrix.length, matrix[0].length]
  let [left, right] = [0, rows * cols - 1]

  while (left <= right) {
    const mid = Math.floor((left + right) / 2) // midpoint
    const row = Math.floor(mid / cols) // mid row index
    const col = mid % cols // mid column index

    const guess = matrix[row][col]

    if (guess === target) return true
    if (guess < target) left = mid + 1
    if (guess > target) right = mid - 1
  }

  return false
}

const bananas = (piles, hours) => {
  let left = 0,
      right = Math.max(...piles)

  while (left < right) {
    const midSpeed = Math.floor((left + right) / 2)
    const timeSpentEating = piles.reduce((sum, pile) => sum + Math.ceil(pile / midSpeed), 0)

    if (timeSpentEating <= hours) right = midSpeed
    else left = midSpeed + 1
  }

  return right
}

const minInRotated = (nums) => {
  let left = 0,
      right = nums.length - 1

  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    // if mid num is > right num, can move our left pointer to right window
    if (nums[mid] > nums[right]) left = mid + 1
    else right = mid
  }

  return nums[left]
}

const removeNthNodeFromEndOfLL = (head, n) => {
  let slow = head,
      fast = head

  // move fast n ahead of slow
  for (let i = 0; i < n; i++) {
    fast = fast.next
  }
  
  // check edge case of n being head node
  if (!fast) return head.next
  
  // iterate - need nth node's prev node
  while (fast.next) {
    slow = slow.next
    fast = fast.next
  }

  // skip nth node
  slow.next = slow.next.next
  return head
}

// 7/19/23 review sesh
// Topic = Arrays & Hashing
const anagramTest = (s, t) => {
  if (s.length !== t.length) return false // edge case

  const sMap = {} // initialize s freq map

  // fill s freq map
  for (const char of s) {
    sMap[char] = (sMap[char] || 0) + 1
  }

  for (const char of t) {
    // check against s freq map
    // false conditions:
      // if char doesn't exist in map
      // if map freq for char is 0
    if (!sMap[char] || sMap[char] < 1) return false
    sMap[char]--
  }

  return true
}

const topKFreqElements = (nums, k) => {
  // initialize freqMap and result arr
  const freqMap = {},
        result = []
  
  // fill freqMap
  for (const num of nums) {
    freqMap[num] = (freqMap[num] || 0) + 1
  }

  // sort freqMap by highest freq { '1': 3, '2': 2', '3': 1 }
  const sortedNums = Object.entries(freqMap)
    .map(([num, freq]) => [Number(num), freq])
    .sort((a, b) => b[1] - a[1])

  // push highest k freq nums to result
  for (let i = 0; i < k; i++) {
    result.push(sortedNums[i][0])
  }

  return result
}

const countGoodNodes = (root) => {
  // keep track of # of "good" nodes (no nodes above have a higher num value)
  let total

  traverse(root, root.val) // starting max is the root val
  return total

  // dfs traverse the tree, updating total and max along the way
  function traverse(node, max) {
    if (!node) return // null node case
    if (node.val >= max) total++ // valid good node case (max is not bigger than curr node val)
    max = Math.max(max, node.val)
    traverse(node.left, max)
    traverse(node.right, max)
  }
}

const kthSmallestNumInBST = (root, k) => {
  const nums = []

  dfs(root)
  return nums[k - 1]

  function dfs(node) {
    if (nums.length === k) return // early return pattern
    if (node.left) dfs(node.left)
    nums.push(node.val)
    if (node.right) dfs(node.right)
  }
}
