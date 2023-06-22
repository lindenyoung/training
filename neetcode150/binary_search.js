
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
  let [left, right] = [0, rows * cols - 1] // tread the matrix as a 1D array

  while (left <= right) {
    const mid = Math.floor((left + right) / 2) // (left + right) >> 1 is the bitwise shift version of this
    const [row, col] = [Math.floor(mid / cols), mid % cols] // get 2D coordinates / indexes
    const guess = matrix[row][col]

    if (guess === target) return true
    if (guess < target) left = mid + 1
    if (guess > target) right = mid - 1
  }
  
  return false
}
