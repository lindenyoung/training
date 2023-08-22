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
