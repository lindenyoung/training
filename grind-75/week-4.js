// 1 - COURSE SCHEDULE

// 2 - IMPLEMENT TRIE (PREFIX TREE)

// 3 - COIN CHANGE - dynamic programming
// return the fewest number of coins you need to make up the given amount
// coins = [1, 2, 5] / amount = 11 / output = 3 (5 + 5 + 1)
const coinChange = (coins, amount) => {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i < dp.length; i++) {
    for (let coin of coins) {
      if (i - coin >= 0) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
};

// 4 - PRODUCT OF ARRAY EXCEPT SELF
// must run in O(n) time and without using the division operator
// [1, 2, 3, 4] -> [24, 12, 8, 6]
// output: [24, 12, 4, 1] after backwards loop
// output: [24, 12, 8, 6] then after forward loop
const productExceptSelf = (nums) => {
  // we want the product of all left elements * product of all right elements
  // use both forward and backwards pass

  const result = [];
  let leftMult = 1; // prefix
  let rightMult = 1; // suffix

  for (let i = nums.length - 1; i >= 0; i--) {
    result[i] = rightMult;
    rightMult *= nums[i];
  }

  for (let j = 0; j < nums.length; j++) {
    result[j] *= leftMult;
    leftMult *= nums[j];
  }

  return result;
};

// 5 - MIN STACK
// implement stack with push / pop / top / getMin methods
const MinStack = function() {
  this.stack = [];
};

MinStack.prototype.push = (x) => {
  this.stack.push({
    value: x,
    min: this.stack.length === 0 ? x : Math.min(x, this.getMin()) // keeps track of min at each element to handle pop method
  });
};

MinStack.prototype.pop = () => {
  this.stack.pop();
};

MinStack.prototype.top = () => {
  return this.stack[this.stack.length - 1].value;
};

MinStack.prototype.getMin = () => {
  return this.stack[this.stack.length - 1].min;
};

// 6 - VALIDATE BST
const isValidBST = (root, lowerBound = -Infinity, upperBound = Infinity) => {
  if (root === null) return true;
  // false conditions: left node val is <= parent node val or right node val is >= parent node val
  if (root.val <= lowerBound.val || root.val >= upperBound.val) return false;
  // move left and right
  return isValidBST(root.left, lowerBound, root) && isValidBST(root.right, root, upperBound);
};

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