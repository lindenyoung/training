
/**
 * 704: Binary Search
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

/**
 * 74: Search a 2D Matrix
 * matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3 -> true
 * @param {number[][]} matrix 
 * @param {number} target 
 * @return {boolean}
 */
const searchMatrix = (matrix, target) => {
  const [rows, cols] = [matrix.length, matrix[0].length]
  let [left, right] = [0, rows * cols - 1] // treat the matrix as a 1D array

  while (left <= right) {
    const mid = Math.floor((left + right) / 2) // (left + right) >> 1 is the bitwise shift version of this
    const [row, col] = [Math.floor(mid / cols), mid % cols] // get 2D coordinates - mid row and column indexes
    const guess = matrix[row][col]

    if (guess === target) return true
    if (guess < target) left = mid + 1
    if (guess > target) right = mid - 1
  }
  
  return false
}

/**
 * 875: Koko Eating Bananas
 * piles = [3, 6, 7, 11], hrs = 8, returns 4 
 * @param {number[]} piles 
 * @param {number} hrs
 * @return {number}
 */
const minEatingSpeed = (piles, hrs) => {
  let left = 1,
      right = Math.max(...piles) // max pile
      // best = right

  // binary search through speeds 1 - max speed
  while (left < right) {
    // get midpoint speed
    const mid = Math.floor((left + right) / 2)
    // reduce helper to calculate total hrs to eat piles given curr speed (mid point)
    const timeSpent = piles.reduce((sum, pile) => sum + Math.ceil(pile / mid), 0)

    if (timeSpent <= hrs) right = mid
    else left = mid + 1
  }

  return right
}

/**
 * 153: Find Minimum in Rotated Sorted Array
 * must run in O(log n) time
 * nums = [3, 4, 5, 1, 2], returns 1 since original array was [1, 2, 3, 4, 5]
 * @param {number[]} nums 
 * @return {number}
 */
const findMin = (nums) => {
  let left = 0,
      right = nums.length - 1

  while (left < right) {
    const mid = Math.floor((left + right) / 2) // ~~((left + right) / 2)

    if (nums[mid] > nums[right]) left = mid + 1
    else right = mid
  }

  return nums[left]
}
