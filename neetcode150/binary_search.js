
/**
 * Binary Search 704
 * nums = [-1, 0, 3, 5, 9, 12], target = 9 -> 4
 * solution must be O(log n) runtime complexity
 * @param {number[]} nums 
 * @param {number} target 
 * @return {number} // index of target val in nums
 */
const search = (nums, target) => {
  let left = 0,
      right = nums.length - 1

  while (left <= right) {
    const midIndex = Math.floor((right + left) / 2)
    const midNum = nums[midIndex]
    
    // if mid num is target, return its index
    if (midNum === target) return midIndex
    
    // if mid num is too small, set left to the index after mid index
    // otherwise mid num is too large, set right to index before mid index
    midNum < target ? left = midIndex + 1 : right = midIndex - 1
  }

  return -1
}
