/* --- past 30 days = 5 problems, in order of frequency --- */

// 1648. Sell Diminishing-Valued Colored Balls (15 tags in last 3 months!)

// 42. Trapping Rain Water (12 tags in last 3 months)
// two pointers O(n) time and O(1) space. Brute force is to find left and right max at each index, O(n^2) time. Only the min of left and right max matters
function trap (height) {
  let left = 0,
      right = height.length - 1,
      leftMax = 0,
      rightMax = 0,
      water = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
      right--;
    }
  }

  return water;
};

// 387. First Unique Character in a String
// O(n) time and O(k) space (worst space complexity is O(26) so it's more like O(1) space)
function firstUniqChar(s) {
  // first loop - frequency map
  const freqMap = {}; // new Map();

  for (const char of s) {
    freqMap[char] = (freqMap[char] || 0) + 1;
    // freqMap.set(char, (freqMap.get(char) || 0) + 1);
  }

  // second loop - return index of first char with frequency of one
  for (let i = 0; i < s.length; i++) {
    if (freqMap[s[i]] === 1) return i;
  }

  return -1;
};

// 994. Rotting Oranges
// O(n * m) time and space (rows x cols)
function orangesRotting(grid) {
  let freshCount = 0,
      minutes = 0;
  const queue = [],
        rows = grid.length,
        cols = grid[0].length;

  // find rotten oranges and track fresh count
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) {
        queue.push([r, c]);
      } else if (grid[r][c] === 1) {
        freshCount++;
      }
    }
  }

  // edge case: no fresh oranges
  if (freshCount === 0) return 0;

  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  // BFS traversal, each level = state of grid at that time
  while (queue.length > 0 && freshCount > 0) {
    const size = queue.length;

    for (let i = 0; i < size; i++) { // traverse all the rotten oranges that exist rn
      const [r, c] = queue.shift();

      for (const [x, y] of directions) {
        const newR = r + x;
        const newC = c + y;

        // skip out of bounds and non-fresh cells
        if (newR < 0 || newR >= rows || newC < 0 || newC >= cols || grid[newR][newC] !== 1) continue;
        grid[newR][newC] = 2;
        queue.push([newR, newC]);
        freshCount--;
      }
    }

    minutes++; // increment time after each queue level traversal
  }

  return freshCount === 0 ? minutes : -1;
};

// 2948. Make Lexicographically Smallest Array by Swapping Elements
function lexicographicallySmallestArray (nums, limit) {
  // O(n log(n)) time and O(n) space
  const n = nums.length;

  // sort by value, include original indexes
  const indexed = nums.map((num, index) => [num, index]);
  indexed.sort((a, b) => a[0] - b[0]); // ascending

  const result = new Array(n);

  // walk through sorted values, group into components by the gap (|arr[i] - arr[j]| <= limit)
  let i = 0;
  while (i < n) {
    let j = i;
    // extend curr component/window
    while (j + 1 < n && indexed[j + 1][0] - indexed[j][0] <= limit) {
      j++;
    }

    // collect original indexes in this group, sort asc
    const groupIndexes = [];
    for (let k = i; k <= j; k++) {
      groupIndexes.push(indexed[k][1]);
    }

    groupIndexes.sort((a, b) => a - b);

    // assign sorted values to sorted indexes
    for (let k = 0; k < groupIndexes.length; k++) {
      result[groupIndexes[k]] = indexed[i + k][0];
    }

    i = j + 1;
  }

  return result;
};

/* --- past 3 months = 20 problems, top 5 below in order of frequency --- */