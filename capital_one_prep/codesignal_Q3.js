/**
 * spiral matrix - leetcode 54
 * Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
 * Output: [1,2,3,6,9,8,7,4,5]
 * @param {number[][]} matrix 
 * @returns {number[]}
 * I do not like this problem, it also has a lot of LC down votes
 * O(h * w) time and space
 * 
 */
const spiralOrder = (matrix) => {
  const height = matrix.length,
        width = matrix[0].length,
        result = []
  
  let x = 0,
      y = 0,
      count = 0,
      area = height * width

  while (count < area) {
    for (let i = x; i < width - x; i++) {
      result.push(matrix[y][i])
      count++
    }

    y++ // move down a row

    for (let i = y; i < height - y + 1; i++) {
      result.push(matrix[i][width - 1 - x])
      count++
    }

    x++

    for (let i = width - 1 - x; count < area && i >= x - 1; i--) {
      result.push(matrix[(height - 1) - (y - 1)][i])
      count++
    }

    for (let i = height - 1 - y; count < area && i >= y; i--) {
      result.push(matrix[i][x - 1])
      count++
    }
  }

  return result
}

/**
 * Spiral matrix II - leetcode 59
 * Given a positive integer n, generate an n x n matrix filled with elements from 1 to n^2 in spiral order
 * Input: n = 3
 * Output: [[1,2,3],[8,9,4],[7,6,5]]
 * @param {number} n 
 * @returns {number[][]}
 * O(n * m) time and space
 */
const generateMatrix = (n) => {
  // initialize result matrix to correct size number[][]
  const result = new Array(n).fill(0).map(() => new Array(n).fill(0))

  let count = 0,
      area = n * n,
      left = 0,
      right = n - 1,
      top = 0,
      bottom = n - 1

  while (count < area) {
    // going right
    for (let i = left; i <= right; i++) {
      count++
      result[top][i] = count
    }

    top++

    // going down
    for (let i = top; i <= bottom; i++) {
      count++
      result[i][right] = count
    }

    right--

    // going left
    for (let i = right; i >= left; i--) {
      count++
      result[bottom][i] = count
    }

    bottom--

    // going up
    for (let i = bottom; i >= top; i--) {
      count++
      result[i][left] = count
    }

    left++
  }

  return result
}

// rotate image

// diagonal traverse

// reshape the matrix

// toeplitz matrix

// image overlap

// transpose matrix

// text justification (hard)
