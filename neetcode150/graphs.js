/**
 * 200: Number of Islands
 * @param {string[][]} grid 
 * @returns {number}
 */
const numIslands = (grid) => {
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  let result = 0

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === '1') {
        result++
        traverse(row, col)
      }
    }
  }

  return result

  function traverse(row, col) {
    // return case - cell is out of bounds or water
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length || grid[row][col] === '0') return

    grid[row][col] = '0'

    // recursive traversal in each direction
    for (const [x, y] of directions) {
      traverse(row + x, col + y)
    }
  }
}

/**
 * 695: Max Area of Island
 * @param {number[][]} grid 
 * @return {number}
 */
const maxAreaOfIsland = (grid) => {
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  let result = 0
  
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === 1) result = Math.max(result, traverse(row, col))
    }
  }

  return result

  function traverse(row, col) {
    // return case - cell is out of bounds or is a water cell
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length || grid[row][col] === 0) return 0

    grid[row][col] = 0
    let count = 1

    for (const [x, y] of directions) {
      count += traverse(row + x, col + y)
    }

    return count
  }
}
