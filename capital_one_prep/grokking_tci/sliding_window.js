/**
 * Find average of each subarray of 'k' contiguous elements
 * @param {number[]} nums 
 * @param {number} k 
 * @returns {number[]}
 * O(n) time and O(n) space
 */
const averagesOfSubarrays = (nums, k) => {
  const result = []

  let sum = 0,
      start = 0

  for (let end = 0; end < nums.length; end++) {
    sum += nums[end]

    // slide window - if we've hit the right size window to start sliding
    if (end >= k - 1) {
      result.push(sum / k)

      sum -= nums[start]
      start++
    }
  }

  return result
}

/**
 * Max subarray
 * @param {number[]} nums 
 * @param {number} k 
 * @returns {number}
 * O(n) time and O(1) space
 */
const maxSubarray = (nums, k) => {
  let maxSum = 0,
      sum = 0,
      start = 0
      
  for (let end = 0; end < nums.length; end++) {
    sum += nums[end]

    // slide window - if we've hit the right size window
    if (end >= k - 1) {
      maxSum = Math.max(maxSum, sum)
      sum -= nums[start]
      start++
    }
  }
  
  return maxSum
}

/**
 * Smallest subarray with a >= sum than s
 * @param {number[]} nums 
 * @param {number} s 
 * @returns {number}
 */
const findSmallestSubarray = (nums, s) => {
  let minLength = Infinity,
      sum = 0,
      start = 0

  for (let end = 0; end < nums.length; end++) {
    sum += nums[end]

    // shrink window as small as we can until sum is smaller than s
    while (sum >= s) {
      minLength = Math.min(minLength, end - start + 1)
      sum -= nums[start]
      start++
    }
  }

  return minLength !== Infinity ? minLength : 0
}
