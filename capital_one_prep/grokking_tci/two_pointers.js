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
  const result = new Array(nums.length).fill(0)

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

/**
 * Search triplets (3 sum), Leetcode 15
 * @param {number[]} nums 
 * @returns {number[]}
 * O(n^2) time and O(n) space
 */
const threeSum = (nums) => {
  const result = []
  if (nums.length < 3) return result

  nums.sort((a, b) => a - b)

  for (let i = 0; i < nums.length - 2; i++) {
    // early exit condition, first num is > 0 so impossible to sum 3 nums to 0
    if (nums[i] > 0) break

    // skip duplicates
    if (i > 0 && nums[i] === nums[i - 1]) continue

    // 2 sum search logic
    let left = i + 1,
        right = nums.length - 1

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right]

      if (sum === 0) {
        // push valid triplet and move two pointers
        result.push([nums[i], nums[left], nums[right]])

        // skip duplicates for left and right pointers
        while (nums[left] === nums[left + 1]) left++
        while (nums[right] === nums[right - 1]) right--
        
        // increment pointers
        left++
        right--
      } else if (sum < 0) left++
        else right--
    }
  }

  return result
}

/**
 * Triplet sum close to target, Leetcode 16
 * Input: nums = [-1, 2, 1, -4], target = 1 
 * Output: 2 (returning the sum of the triplet, -1 + 2 + 1)
 * @param {number[]} nums 
 * @param {number} target 
 * @returns {number}
 */
const tripletSumCloseToTarget = (nums, target) => {
  nums.sort((a, b) => a - b)
  
  let closest = Infinity

  for (let i = 0; i < nums.length - 2; i++) {
    let left = i + 1,
        right = nums.length - 1
    
    while (left < right) {
      const currSum = nums[i] + nums[left] + nums[right]
      const currDiff = target - currSum
      // found an exact match, return the sum / target
      if (currDiff === 0) return target

      if (Math.abs(currDiff) < Math.abs(target - closest)) closest = currSum

      if (currSum < target) left++ // need a bigger sum
      else right-- // need a smaller sum
    }
  }

  return closest
}
