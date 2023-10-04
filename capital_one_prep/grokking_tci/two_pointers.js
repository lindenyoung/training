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
    if (nums[i] !== nums[next - 1]) {
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
 * Search triplets (3 sum) - Leetcode 15
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
 * Triplet sum close to target - Leetcode 16
 * Input: nums = [-1, 2, 1, -4], target = 1 
 * Output: 2 (returning the sum of the triplet, -1 + 2 + 1)
 * @param {number[]} nums 
 * @param {number} target 
 * @returns {number}
 * O(n^2) time and O(n) space
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

/**
 * Triplets with smaller sum (i, j, k are all diff indices) - Leetcode 259
 * Input: nums = [-1, 0, 2, 3], target = 3 
 * Output: 2
 * Explanation: There are two triplets whose sum is less than the target: [-1, 0, 3], [-1, 0, 2]
 * @param {number[]} nums 
 * @param {number} target 
 * @returns {number} return the count of valid triplets
 * O(n^2) time and O(n) space
 */
const tripletsWithSmallerSum = (nums, target) => {
  nums.sort((a, b) => a - b)

  let result = 0 // count of valid triplets

  for (let i = 0; i < nums.length - 2; i++) {
    let left = i + 1,
        right = nums.length - 1
    
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right]
      
      // valid triplet condition
      if (sum < target) {
        // since array is sorted, all nums left of right pointer will also make a valid triplet
        result += right - left
        left++
      }
      else right-- // need a smaller sum so decrement right pointer
    }
  }

  return result
}

/**
 * Subarray product less than k - Leetcode 713
 * Input: nums = [2, 5, 3, 10], target = 30 
 * Output: 6
 * Explanation: There are six contiguous subarrays whose product is less than the target
 * [2], [5], [2, 5], [3], [5, 3], [10]
 * @param {number[]} nums 
 * @param {number} target 
 * @returns {number[]}
 * O(n^2) time and O(1) space
 */
const subarraysWithSmallerProduct = (nums, target) => {
  // edge cases
  if (!nums || !nums.length || target <= 1) return 0

  let left = 0,
      product = 1,
      count = 0 // change to subarrays if different output wanted

  for (let right = 0; right < nums.length; right++) {
    product *= nums[right]

    // increment left pointer if product is not smaller than target
    while (product >= target && left <= right) {
      product /= nums[left++]
    }

    // if output is count of valid subarrays:
    count += right - left + 1

    // if output is list of valid subarrays:
    // subarrays.push(nums.slice(left, right + 1));
  }

  return count
}

/**
 * Sort colors - Leetcode 75
 * 0 = red, 1 = white, 2 = blue
 * Input: [1, 0, 2, 1, 0]
 * Output: [0, 0, 1, 1, 2]
 * @param {number[]} nums
 * O(n) time and O(1) space
 */
const dutchNationalFlag = (nums) => {
  let left = 0, // inner edge of 0's
      right = nums.length - 1, // inner edge of 1's
      i = 0 // current el, tracking our iteration

  while (i <= right) {
    if (nums[i] === 0) {
      [nums[left], nums[i]] = [nums[i], nums[left]]
      i++
      left++
    } else if (nums[i] === 2) {
      [nums[i], nums[right]] = [nums[right], nums[i]]
      right-- // only decrement right pointer, since after swap, the ith el is now unknown
    } else {
      i++
    }
  }
}

/**
 * 4 sum - Leetcode 18
 * Return array of all the unique quadruplets that sum to target
 * @param {number[]} nums 
 * @param {number} target 
 * @returns {number[]}
 * O(n^3) time and O(n) space
 */
const quadrupletSumtoTarget = (nums, target) => {
  nums.sort((a, b) => a - b)
  const result = []

  for (let i = 0; i < nums.length - 3; i++) {
    for (let j = i + 1; j < nums.length - 2; j++) {
      // search for pairs logic
      let left = j + 1,
          right = nums.length - 1

      while (left < right) {
        const sum = nums[i] + nums[j] + nums[left] + nums[right]

        if (sum === target) {
          result.push([nums[i], nums[j], nums[left], nums[right]])
  
          while (nums[left] === nums[left + 1]) left++
          while (nums[right] === nums[right + 1]) right--
          
          left++
          right--
        } else if (sum < target) {
          left++
        } else {
          right--
        }
      }
      while (nums[j] === nums[j + 1]) j++ // skip duplicates
    }
    while (nums[i] === nums[i + 1]) i++ // skip duplicates
  }

  return result
}
