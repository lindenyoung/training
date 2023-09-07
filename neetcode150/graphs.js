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

  // dfs helper to change all land cells in curr island to water
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

  // dfs helper to return number of land cells in curr island
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

/**
 * 994: Rotting Oranges
 * T = O(M * N)
 * S = O(M * N)
 * @param {number[][]} grid 
 * @return {number}
 */
const orangesRotting = (grid) => {
  const queue = [],
        directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  
  let fresh = 0,
      time = 0

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === 1) fresh++
      else if (grid[row][col] === 2) queue.push([row, col, 0])
    }
  }

  const result = traverse()
  return result

  // bfs helper
  function traverse() {
    while (queue.length && fresh) {
      const [row, col, minutes] = queue.shift()

      if (grid[row][col] === 1) {
        grid[row][col] = 2
        fresh--
        time = minutes
      }

      for (const [x, y] of directions) {
        const [newRow, newCol] = [row + x, col + y]

        if (newRow < 0 || newRow >= grid.length || newCol < 0 || newCol >= grid[0].length) continue
        if (grid[newRow][newCol] === 1) {
          queue.push([newRow, newCol, minutes + 1])
        }
      }
    }

    return fresh === 0 ? time : -1
  }
}

/**
 * 207: Course Schedule
 * @param {number} numCourses 
 * @param {number[][]} prereqs 
 * @return {boolean}
 */
const courseSchedule = (numCourses, prereqs) => {
  const graph = new Map(),
        visiting = new Set(),
        visited = new Set()

  for (const [a, b] of prereqs) {
    if (graph.has(a)) {
      const edges = graph.get(a)
      edges.push(b)
      graph.set(a, edges)
    } else {
      graph.set(a, [b])
    }
  }

  for (const [x, y] of graph) {
    if (traverse(x)) return false
  }

  return true

  // dfs helper
  function traverse(course) {
    visiting.add(course)
    const edges = graph.get(course)

    if (edges) {
      for (const e of edges) {
        if (visited.has(e)) continue
        if (visiting.has(e)) return true
        if (traverse(e)) return true
      }
    }

    visiting.delete(course)
    visited.add(course)
    return false
  }
}
