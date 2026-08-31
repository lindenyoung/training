/* --- past 30 days = 5 problems, in order of frequency --- */

// 1648. Sell Diminishing-Valued Colored Balls (15 tags in last 3 months!)
// the final set of balls you sell is always "all balls with value greater than some threshold V, plus possibly some balls valued exactly V." Our job is to find that threshold
// needs greedy reasoning + binary search on the answer, as values up to 1e9 and 1e5 colors makes brute force impossible / too slow
// 5n = BigInt type number
// ([2,5], 4) -> 14
function maxProfit(inventory, orders) {
  const MOD = 1_000_000_007n;

  // count of balls with value >= v, across all piles
  const countAtLeast = (v) => {
    let total = 0n;
    for (const a of inventory) {
        if (a >= v) total += BigInt(a - v + 1);
    }
    return total;
  };

  // find the largest v such that countAtLeast(v) >= orders
  let lo = 1,
      hi = Math.max(...inventory);
  while (lo < hi) {
      const mid = Math.ceil((lo + hi + 1) / 2);
      if (countAtLeast(mid) >= orders) {
          lo = mid;
      } else {
          hi = mid - 1;
      }
  }
  const V = lo;

  // sell everything above V in full
  let ordersLeft = BigInt(orders);
  let total = 0n;

  for (const a of inventory) {
      if (a > V) {
          const top = BigInt(a);
          const bottom = BigInt(V) + 1n;
          const count = top - bottom + 1n; // 5 - 3 + 1 = 3
          const sum = (top + bottom) * count / 2n; // 5 + 4 + 3 = (8 * 3) / 2 = 12 (sum of consecutive numbers formula)
          total = (total + sum) % MOD;
          ordersLeft -= count;
      }
  }

  // then fill remainder of orders at price V
  total = (total + ordersLeft * BigInt(V)) % MOD;
  return Number(total);
};

// 42. Trapping Rain Water (12 tags in last 3 months)
// two pointers O(n) time and O(1) space
// Brute force is to find left and right max at each index, O(n^2) time. Only the min of left and right max matters tho
function trap(height) {
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
function lexicographicallySmallestArray(nums, limit) {
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

// 516. Longest Palindromic Subsequence
function longestPalindromeSubseq(s) {
  // brute force is O(2^n) exponential time
  // DP solution is O(n^2) time and space (filling n x n grid)
  const n = s.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));

  // base case: every single character is a palindrome of length 1
  for (let i = 0; i < n; i++) {
      dp[i][i] = 1;
  }

  // fill by increasing substring length
  for (let left = n - 1; left >= 0; left--) {
      for (let right = left + 1; right < n; right++) {
          if (s[left] === s[right]) {
              dp[left][right] = dp[left + 1][right - 1] + 2;
          } else {
              dp[left][right] = Math.max(dp[left + 1][right], dp[left][right - 1]);
          }
      }
  }

  return dp[0][n - 1];
};

// 3. Longest Substring Without Repeating Characters
// sliding window pattern
// Both l and r traverse the string once, so total work is O(n) time, O(min(n, m)) ~= O(1)
function lengthOfLongestSubstring(s) {
  const windowSet = new Set();
  let l = 0, res = 0;

  for (let r = 0; r < s.length; r++) {
    while (windowSet.has(s[r])) {
      windowSet.delete(s[l]);
      l++;
    }
    windowSet.add(s[r]);
    res = Math.max(res, r - l + 1);
  }
  return res;
};

// 64. Minimum Path Sum
// brute force is recursion, dp is optimal
// space optimization: since dp[r][c] only ever depends on the row directly above and the current row so far, we can collapse the 2D table down to a single 1D array of length n, updating it in place as you scan row by row to improve space from O(m*n) to O(n)
// O(n * m) time and O(n) space
function minPathSum(grid) {
  const m = grid.length; // rows
  const n = grid[0].length; // cols
  const dp = new Array(n).fill(0);

  for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
          if (r === 0 && c === 0) {
              dp[c] = grid[r][c];
          } else if (r === 0) {
              dp[c] = dp[c - 1] + grid[r][c];
          } else if (c === 0) {
              dp[c] = dp[c] + grid[r][c]; // dp[c] currently holds the value from the row above
          } else {
              dp[c] = grid[r][c] + Math.min(dp[c], dp[c - 1]);
          }
      }
  }

  return dp[n - 1];
};

// 2791. Count Paths That Can Form a Palindrome in a Tree
// brute force: For every pair (u, v), find the path between them (walk up from both to their LCA, or just do a BFS/DFS between them), collect the multiset of edge characters along that path, and check if that multiset's character counts allow rearrangement into a palindrome — which happens if and only if at most one character has an odd count
function countPalindromePaths(parent, s) {
  const n = parent.length;
  const children = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) {
      children[parent[i]].push(i);
  }

  const mask = new Array(n).fill(0);

  // iterative DFS to compute root-to-node parity masks
  const stack = [0];
  while (stack.length > 0) {
      const node = stack.pop();
      for (const child of children[node]) {
          const bit = 1 << (s.charCodeAt(child) - 97); // 'a' = 97
          mask[child] = mask[node] ^ bit;
          stack.push(child);
      }
  }

  let count = 0;
  const freq = new Map();

  for (let node = 0; node < n; node++) {
      const m = mask[node];

      // popcount 0: exact mask match
      count += freq.get(m) || 0;

      // popcount 1: exactly one bit different
      for (let i = 0; i < 26; i++) {
          const target = m ^ (1 << i);
          count += freq.get(target) || 0;
      }

      freq.set(m, (freq.get(m) || 0) + 1);
  }

  return count;
};

// 790. Domino and Tromino Tiling
// brute force: The natural brute force for any tiling-counting problem is backtracking: find the leftmost uncovered cell, try placing every piece orientation that could legally cover it (vertical domino, horizontal domino, or one of the four tromino rotations), recurse on the remaining uncovered cells, and backtrack
// ** single-state DP won't capture this because of the tromino overhang — I need a second state for a partially-covered column
// O(n) time (single pass) and space (dp array)
function numTilings(n) {
  const MOD = 1_000_000_007;
  const dp = new Array(n + 1).fill(0);

  dp[0] = 1;
  if (n >= 1) dp[1] = 1;
  if (n >= 2) dp[2] = 2;

  for (let i = 3; i <= n; i++) {
      dp[i] = (2 * dp[i - 1] + dp[i - 3]) % MOD;
  }

  return dp[n];
};
