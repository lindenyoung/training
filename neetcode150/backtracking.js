/**
 * 78: Subsets
 * Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.
 * @param {number[]} nums 
 * @return {number[][]}
 */
const subsets = (nums) => {
  const subsets = [],
        set = []
  
  dfs(0)
  return subsets

  function dfs(startIndex) {
    // add copy of curr set to result
    subsets.push(set.slice())

    // early return case
    if (startIndex >= nums.length) return

    // standard backtracking logic
    for (let i = startIndex; i < nums.length; i++) {
      set.push(nums[i]) // add
      dfs(i + 1) // traverse
      set.pop() // undo
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
