// 1 - COURSE SCHEDULE

// 2 - IMPLEMENT TRIE (PREFIX TREE)

// 3 - COIN CHANGE

// 4 - PRODUCT OF ARRAY EXCEPT SELF

// 5 - MIN STACK

// 6 - VALIDATE BST

// 7 - NUM ISLANDS
const numIslands = (grid) => {
  const rows = grid.length;
  const columns = grid[0].length;
  let totalIslands = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (grid[i][j] === "1") { // found island condition
        totalIslands++;
        visitIsland(grid, i, j); // invoke helper function to traverse island
      }
    }
  }

  return totalIslands;
};

// recursive helper function
const visitIsland = (matrix, x, y) => {
  // return case - if not a valid cell (edge)
  if (x < 0 || x >= matrix.length || y < 0 || y >= matrix[0].length) return;
  // return case - if water cell
  if (matrix[x][y] === "0") return;

  matrix[x][y] = "0"; // change cell to water

  visitIsland(matrix, x + 1, y); // down
  visitIsland(matrix, x - 1, y); // up
  visitIsland(matrix, x, y + 1); // right
  visitIsland(matrix, x, y - 1); // left
};

// 8 - ROTTING ORANGES