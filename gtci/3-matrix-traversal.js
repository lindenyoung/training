// number of islands

// C: O(m * n) time (m is num of rows, n is num of columns) and O(m * n) space

// DFS - I like this better than BFS
function countIslandsDFS(matrix) {
  const rows = matrix.length;
  const columns = matrix[0].length;
  let totalIslands = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (matrix[i][j] === 1) { // if we found land, increment islands
        totalIslands++;
        visitIslandDFS(matrix, i, j); // invoke traversal helper function
      }
    }
  }
  return totalIslands;
}

function visitIslandDFS(matrix, x, y) {
  // return case - if not a valid cell (edge)
  if (x < 0 || x >= matrix.length || y < 0 || y >= matrix[0].length) return;
  // return case - if water cell
  if (matrix[x][y] === 0) return;

  matrix[x][y] = 0; // mark the cell visited by making it a water cell

  // recursively visit all neighboring cells (horizontally and vertically)
  visitIslandDFS(matrix, x + 1, y); // lower cell
  visitIslandDFS(matrix, x - 1, y); // upper cell
  visitIslandDFS(matrix, x, y + 1); // right cell
  visitIslandDFS(matrix, x, y - 1); // left cell
}

// console.log(countIslandsDFS([
//   [1, 1, 1, 0, 0],
//   [0, 1, 0, 0, 1],
//   [0, 0, 1, 1, 0],
//   [0, 0, 1, 0, 0],
//   [0, 0, 1, 0, 0]
// ])); // -> 3

// BFS
function countIslandsBFS(matrix) {
  const rows = matrix.length;
  const columns = matrix[0].length;
  let totalIslands = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (matrix[i][j] === 1) { // if we found land, increment islands
        totalIslands++;
        visitIslandBFS(matrix, i, j); // invoke traversal helper function
      }
    }
  }
  return totalIslands;
}

function visitIslandBFS(matrix, x, y) {
  const neighborsQueue = [[x, y]];
  while (neighborsQueue.length > 0) {
    const cell = neighborsQueue.shift();
    const row = cell[0];
    const column = cell[1];

    // continue cases
    if (row < 0 || row >= matrix.length || column < 0 || column >= matrix[0].length) continue;
    if (matrix[row][column] === 0) continue;

    matrix[row][column] = 0; // mark cell visited by making it a water cell

    // insert all neighboring cells into queue for BFS
    neighborsQueue.push([row + 1, column]); // lower cell
    neighborsQueue.push([row - 1, column]); // upper cell
    neighborsQueue.push([row, column + 1]); // right cell
    neighborsQueue.push([row, column - 1]); // left cell
  }
}

// console.log(countIslandsBFS([
//   [1, 1, 1, 0, 0],
//   [0, 1, 0, 0, 1],
//   [0, 0, 1, 1, 0],
//   [0, 0, 1, 0, 0],
//   [0, 0, 1, 0, 0]
// ])); // -> 3

/* - - - - - - - - - - - - - - - - - - - - */

// biggest island

// O(m * n) time and space complexity

function biggestIsland(matrix) {
  const rows = matrix.length;
  const columns = matrix[0].length;
  let biggestIsland = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (matrix[i][j] === 1) {
        biggestIsland = Math.max(biggestIsland, traverseIsland(matrix, i, j));
      }
    }
  }
  return biggestIsland;
}

function traverseIsland(matrix, x, y) {
  if (x < 0 || x >= matrix.length || y < 0 || y >= matrix[0].length) return 0; // return 0 if invalid cell
  if (matrix[x][y] === 0) return 0; // return 0 if water cell

  matrix[x][y] = 0; // mark cell as visited by changing to water

  let area = 1; // initialize area var to 1 to count for current cell
  // recursively visit all neighbors, adding to area
  area += traverseIsland(matrix, x + 1, y); // lower
  area += traverseIsland(matrix, x - 1, y); // upper
  area += traverseIsland(matrix, x, y + 1); // right
  area += traverseIsland(matrix, x, y - 1); // left

  return area;
}

// console.log(biggestIsland([
//   [1, 1, 1, 0, 0],
//   [0, 1, 0, 0, 1],
//   [0, 0, 1, 1, 0],
//   [0, 1, 1, 0, 0],
//   [0, 0, 1, 0, 0]
// ])); // -> 5

/* - - - - - - - - - - - - - - - - - - - - */

// flood fill

// O(m * n) time and space complexity

function floodFill(matrix, x, y, newColor) {
  if (matrix[x][y] !== newColor) {
    changeColor(matrix, x, y, matrix[x][y], newColor);
  }
  return matrix;
}

function changeColor(matrix, x, y, oldColor, newColor) {
  if (x < 0 || x >= matrix.length || y < 0 || y >= matrix[0].length) return; // return if invalid cell
  if (matrix[x][y] !== oldColor) return; // return if not the required color

  matrix[x][y] = newColor;

  changeColor(matrix, x + 1, y, oldColor, newColor); // down
  changeColor(matrix, x - 1, y, oldColor, newColor); // up
  changeColor(matrix, x, y + 1, oldColor, newColor); // right
  changeColor(matrix, x, y - 1, oldColor, newColor); // left
}

// console.log(floodFill([
//   [1, 1, 0, 0, 0],
//   [0, 1, 0, 0, 0],
//   [0, 0, 1, 1, 0],
//   [0, 1, 1, 0, 0],
//   [0, 0, 0, 0, 0]
// ], 2, 3, 2));

/* - - - - - - - - - - - - - - - - - - - - */

// number of closed islands

function closedIslands(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const visited = Array(rows).fill(false).map(() => Array(cols).fill(false));
  let closedIslandsCount = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] === 1 && !visited[i][j]) {
        if (isClosedDFS(matrix, visited, i, j)) closedIslandsCount++;
      }
    }
  }
  return closedIslandsCount;
}

function isClosedDFS(matrix, visited, x, y) {
  if (x < 0 || x >= matrix.length || y < 0 || y >= matrix[0].length) return false; // return false as island is touching edge
  if (matrix[x][y] === 0 || visited[x][y]) return true; // return true as island is surrounded by water

  visited[x][y] = true; // mark cell as visited

  let isClosed = true; // counting current cell

  isClosed &= isClosedDFS(matrix, visited, x + 1, y);
  isClosed &= isClosedDFS(matrix, visited, x - 1, y);
  isClosed &= isClosedDFS(matrix, visited, x, y + 1);
  isClosed &= isClosedDFS(matrix, visited, x, y - 1);

  return isClosed;
}

console.log(closedIslands([
  [1, 1, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0]
])); // -> 1

console.log(closedIslands([
  [0, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 0]
])); // -> 2

/* - - - - - - - - - - - - - - - - - - - - */

// island perimeter

function islandPerimeter(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  // need a visited matrix so we can return 0 for cells already visited (lines 240 - 242)
  const visited = Array(rows).fill(false).map(() => Array(cols).fill(false));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] === 1 && !visited[i][j]) return countPerimeterDFS(matrix, visited, i, j); // helper func to count sides
    }
  }
  return 0; // if no island is found, return 0
}

function countPerimeterDFS(matrix, visited, x, y) {
  if (x < 0 || x >= matrix.length || y < 0 || y >= matrix[0].length) return 1; // boundary cell is edge so return 1
  if (matrix[x][y] === 0) return 1; // boundary cell is water so return 1
  if (visited[x][y]) return 0;

  visited[x][y] = true; // mark cell as visited

  let edgeCount = 0;

  edgeCount += countPerimeterDFS(matrix, visited, x + 1, y); // down
  edgeCount += countPerimeterDFS(matrix, visited, x - 1, y); // up
  edgeCount += countPerimeterDFS(matrix, visited, x, y + 1); // right
  edgeCount += countPerimeterDFS(matrix, visited, x, y - 1); // left

  return edgeCount;
}

// console.log(islandPerimeter([
//   [1, 1, 0, 0, 0],
//   [0, 1, 0, 0, 0],
//   [0, 1, 0, 0, 0],
//   [0, 1, 1, 0, 0],
//   [0, 0, 0, 0, 0]
// ])); // -> 14

/* - - - - - - - - - - - - - - - - - - - - */

// number of distinct islands

function findDistinctIslands(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  let islandSet = new Set();

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] === 1) {
        let traversal = traverseIslandsDFS(matrix, i, j, "O");
        islandSet.add(traversal);
      }
    }
  }
  return islandSet.size;
}

function traverseIslandsDFS(matrix, x, y, direction) {
  if (x < 0 || x >= matrix.length || y < 0 || y >= matrix[0].length) return ""; // if cell is edge return empty string
  if (matrix[x][y] === 0) return ""; // if cell is water (or already visited) return empty string

  matrix[x][y] = 0; // mark cell as visited

  let path = direction; // start path string with origin "O"

  path += traverseIslandsDFS(matrix, x + 1, y, "D"); // down
  path += traverseIslandsDFS(matrix, x - 1, y, "U"); // up
  path += traverseIslandsDFS(matrix, x, y + 1, "R"); // right
  path += traverseIslandsDFS(matrix, x, y - 1, "L"); // left

  path += "E"; // end of path

  return path;
}

// console.log(findDistinctIslands([
//   [1, 1, 0, 1, 1],
//   [1, 1, 0, 1, 1],
//   [0, 0, 0, 0, 0],
//   [0, 1, 1, 0, 1],
//   [0, 1, 1, 0, 1]
// ])); // -> 2

// console.log(findDistinctIslands([
//   [1, 1, 0, 1],
//   [0, 1, 1, 0],
//   [0, 0, 0, 0],
//   [1, 1, 0, 0],
//   [0, 1, 1, 0]
// ])); // -> 2