/**
 * 78: Subsets
 * Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.
 * @param {number[]} nums 
 * @return {number[][]}
 */
const subsets = (nums) => {
  nums.sort((a, b) => a - b) // this improves runtime somehow
  const result = []
  
  dfs(0, [])
  return result

  function dfs(startIndex, set) {
    // add copy of curr set to result
    result.push(set.slice())

    // standard backtracking logic
    for (let i = startIndex; i < nums.length; i++) {
      set.push(nums[i]) // add curr element
      dfs(i + 1, set) // recursive call with next index
      set.pop() // remove last element to backtrack
    }
  }
}

/**
 * 39: Combination Sum
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[]}
 */
const combinationSum = (candidates, target) => {
  const result = [],
        tempComb = []

  backtrack(0, target, tempComb)
  return result
  
  function backtrack(index, target, tempComb) {
    // early return case
    if (target < 0) return
    
    // found unique combination case
    if (target === 0) {
      result.push(tempComb.slice()) // [...temp]
      return
    }

    // standard backtracking logic (push, invoke / traverse, pop)
    for (let i = index; i < candidates.length; i++) {
      tempComb.push(candidates[i])
      backtrack(i, target - candidates[i], tempComb)
      tempComb.pop()
    }
  }
}

/**
 * 45: Permutations
 * Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.
 * All the integers of nums will be unique
 * See 78 for difference between permutations and subsets
 * @param {number[]} nums 
 * @return {number}
 */
const permute = (nums) => {
  const result = []
  
  backtrack(nums, [])
  return result
  
  function backtrack(nums, temp) {
    if (nums.length === 0) {
      result.push(temp)
      return
    }

    for (let i = 0; i < nums.length; i++) {
      // nums = new array of all nums besides curr num
      // temp = new array adding curr num to temp
      // no need to push / pop since we are using slice and [...]
      backtrack([...nums.slice(0, i), ...nums.slice(i + 1)], [...temp, nums[i]])
    }
  }
}

/**
 * 90: Subsets II
 * integer array nums may contain duplicates, return all possible subsets
 * input = [1, 2, 2]
 * output =  [[],[1],[1,2],[1,2,2],[2],[2,2]]
 * @param {number[]} nums 
 * @return {number[]}
 */
const subsetsWithDup = (nums) => {
  const result = []
  nums.sort((a, b) => a - b)
  
  backtrack(nums, [])
  return result

  function backtrack(remainingNums, currSet) {
    result.push([...currSet]) // shallow copy, same as currSet.slice()

    for (let i = 0; i < remainingNums.length; i++) {
      // check for non-duplicate
      if (i === 0 || remainingNums[i] !== remainingNums[i - 1]) {
        // standard backtracking logic
        currSet.push(remainingNums[i])
        backtrack(remainingNums.slice(i + 1), currSet)
        currSet.pop()
      }
    }
  }
}

const combinationSum2 = (candidates, target) => {
  const result = []
  candidates.sort((a, b) => a - b)

  backtrack(0, 0, [])
  return result

  function backtrack(index, sum, temp) {
    // if curr combination is a match, push to result 
    if (sum === target) {
      result.push([...temp])
      return
    }

    for (let i = index; i < candidates.length; i++) {
      if (i !== index && candidates[i] === candidates[i - 1]) continue // if duplicate num, continue to next element
      if (sum > target) return // if we've passed the target, return to break out of this recursive call
      
      // standard backtracking logic
      // same as this one-liner: backtrack(i + 1, sum + candidates[i], [...temp, candidates[i]])
      temp.push(candidates[i])
      backtrack(i + 1, sum + candidates[i], temp)
      temp.pop()
    }
  }
}

/**
 * 79: Word Search
 * @param {string[][]} board 
 * @param {string} word 
 * @returns {boolean}
 */
const wordSearch = (board, word) => {
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]

  // iterate over board spaces and return true if we find the word
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      if (dfs(row, col, 0)) return true
    }
  }
  
  // return false if we're done iterating
  return false

  // -- end of main logic --

  // helper func to recursively traverse the board
  function dfs(row, col, index) {
    if (index === word.length) return true
    if (isOutOfBounds(row, col) || board[row][col] !== word[index]) return false

    // backtracking
    const temp = board[row][col]
    board[row][col] = '*' // reassign curr space
    // traverse recursively
    for (const [x, y] of directions) {
      if (dfs(row + x, col + y, index + 1)) return true
    }
    // reset curr space
    board[row][col] = temp
    return false
  }

  // helper func to check if space is out of bounds
  function isOutOfBounds(row, col) {
    return row < 0 || row > board.length - 1 || col < 0 || col > board[0].length - 1
  }
}

/**
 * 131: Palindrome Partitioning
 * input: 'aab'
 * output: [['a', 'a', 'b'], ['aa', 'b']]
 * @param {string} s 
 * @returns {string[][]}
 */
const partition = (s) => {
  const result = []
  const memo = new Map()
  
  dfs(0, [])
  return result

  function dfs(start, currPartition) {
    if (start === s.length) {
      result.push([...currPartition])
      return
    }

    for (let i = start; i <= s.length; i++) {
      const prefix = s.substring(start, i + 1)

      if (isPalindrome(prefix)) {
        currPartition.push(prefix)
        dfs(i + 1, currPartition)
        currPartition.pop()
      }
    }
  }

  function isPalindrome(substring) {
    if (memo.has(substring)) return memo.get(substring)

    let left = 0,
        right = substring.length - 1
    
    while (left < right) {
      if (substring[left] !== substring[right]) {
        memo.set(substring, false)
        return false
      }
      left++
      right--
    }

    memo.set(substring, true)
    return true
  }
}
