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
