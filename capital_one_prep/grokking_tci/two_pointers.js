/**
 * two sum with sorted array of nums
 * @param {number} target 
 * @param {number[]} nums 
 * @returns {number[]} // indices of pair of numbers
 * O(n) time and O(1) space
 */
const targetSum = (target, nums) => {
  let left = 0,
      right = nums.length - 1

  while (left < right) {
    const sum = nums[left] + nums[right]
    if (sum === target) return [left, right]
    else if (sum > target) right--
    else if (sum < target) left++
  }

  return [-1, -1]
}

/**
 * Find non-duplicate number instances
 * Input: [2, 3, 3, 3, 6, 9, 9]
 * Output: 4 ([2, 3, 6, 9, 6, 9, 9])
 * @param {number[]} nums 
 * @returns {number}
 * O(n) time and O(1) space
 */
const moveUniqueNums = (nums) => {
  // start this at index 1 since first num will be non-duplicate
  // this tracks where the next non-duplicate num will be placed
  let next = 1

  for (let i = 0; i < nums.length; i++) {
    if (nums[next - 1] !== nums[i]) {
      nums[next] = nums[i]
      next++
    }
  }

  return next
}

// Input: [3, 2, 3, 6, 3, 10, 9, 3], Key=3
// Output: 4
// Explanation: The first four elements after removing every 'Key' will be [2, 6, 10, 9].
const removeKeyInstances = (nums, key) => { 
  let next = 0

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === key) continue
    nums[next] = nums[i]
    next++
  }

  return next
}

/**
 * Squaring and resorting a sorted array
 * Input: [-2, -1, 0, 2, 3]
 * Output: [0, 1, 4, 4, 9]
 * @param {number[]} nums 
 * @returns {number[]}
 * O(n) time and space
 */
const squareAndSort = (nums) => {
  const result = Array(nums.length).fill(0)

  let next = nums.length - 1,
      left = 0,
      right = nums.length - 1

  // don't want to skip any nums, so we use <=
  while (left <= right) {
    const leftSquare = nums[left] * nums[left]
    const rightSquare = nums[right] * nums[right]

    // we are filling the result array in reverse order, from right to left
    if (leftSquare > rightSquare) {
      result[next] = leftSquare
      left++
    } else {
      result[next] = rightSquare
      right--
    }

    // decrement our next pointer each iteration
    next--
  }

  return result
}
